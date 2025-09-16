import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
    Grid,
    Box,
    Typography,
    Button,
    Stack,
    LinearProgress,
    Card,
    CardContent,
    Divider,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogContent,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    onSnapshot,
    updateDoc,
    serverTimestamp,
    query,
    where,
    limit,
    collection,
    addDoc,
} from "firebase/firestore";
import {
    ref as fbRef,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { db, auth, storage } from "../../firebaseConfig";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const FeatureMainContent = forwardRef(function FeatureMainContent(
    { docId, slug },
    fwdRef
) {
    const [title, setTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentDocId, setCurrentDocId] = useState(null);

    // local upload state
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({}); // {filename: percent}

    // viewer (zoom modal)
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const mainImage = images?.[0];
    const slugify = (t) =>
        t
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || "";

    // expose methods to parent (header)
    useImperativeHandle(
        fwdRef,
        () => ({
            openEdit: () => setEdit(true),
            closeEdit: () => setEdit(false),
            isEditing: () => edit,
        }),
        [edit]
    );

    // Auth (only to show edit controls)
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
        return () => unsub();
    }, []);

    // Subscribe by docId OR by slug (realtime)
    useEffect(() => {
        setLoading(true);
        setError("");
        let unsubDoc;
        let unsubQuery;

        const apply = (data, id) => {
            setCurrentDocId(id || null);
            if (data) {
                setTitle(data.title || "");
                setShortDesc(data.shortDescription || "");
                setImages(Array.isArray(data.images) ? data.images : []);
            } else {
                setTitle("");
                setShortDesc("");
                setImages([]);
            }
            setLoading(false);
        };

        try {
            if (docId) {
                unsubDoc = onSnapshot(
                    doc(db, "features", docId),
                    (snap) => apply(snap.exists() ? snap.data() : null, docId),
                    (err) => {
                        setError(err.message || "Kunne ikke lese dokument.");
                        setLoading(false);
                    }
                );
            } else if (slug) {
                const q = query(
                    collection(db, "features"),
                    where("slug", "==", slug),
                    limit(1)
                );
                unsubQuery = onSnapshot(
                    q,
                    (qs) => {
                        if (!qs.empty) {
                            const ds = qs.docs[0];
                            apply(ds.data(), ds.id);
                        } else {
                            apply(null, null); // create mode
                        }
                    },
                    (err) => {
                        setError(err.message || "Kunne ikke lese dokument.");
                        setLoading(false);
                    }
                );
            } else {
                apply(null, null);
            }
        } catch (e) {
            setError(e.message || "Uventet feil ved tilkobling.");
            setLoading(false);
        }

        return () => {
            if (unsubDoc) unsubDoc();
            if (unsubQuery) unsubQuery();
        };
    }, [docId, slug]);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            if (currentDocId) {
                await updateDoc(doc(db, "features", currentDocId), {
                    title,
                    shortDescription: shortDesc,
                    images,
                    updatedAt: serverTimestamp(),
                });
            } else {
                const effectiveSlug = slug ?? slugify(title);
                const created = await addDoc(collection(db, "features"), {
                    slug: effectiveSlug,
                    title,
                    shortDescription: shortDesc,
                    images,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                setCurrentDocId(created.id); // subscription picks it up
            }
            setEdit(false);
        } catch (e) {
            setError(e.message || "Noe gikk galt ved lagring.");
        } finally {
            setSaving(false);
        }
    };

    // ---- Local image upload to Firebase Storage ----
    const onPickFiles = (e) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    };

    const uploadAll = async () => {
        if (!user) {
            setError("Du må være innlogget for å laste opp bilder.");
            return;
        }
        if (!selectedFiles.length) return;

        setUploading(true);
        setError("");
        setUploadProgress({});

        const effectiveSlug = (slug || slugify(title) || "untitled").slice(
            0,
            60
        );

        try {
            const urls = [];
            for (const file of selectedFiles) {
                const ext = file.name.split(".").pop() || "jpg";
                const path = `features/${effectiveSlug}/${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2)}.${ext}`;

                const fileRef = fbRef(storage, path);
                const task = uploadBytesResumable(fileRef, file, {
                    contentType: file.type || "image/jpeg",
                });

                const url = await new Promise((resolve, reject) => {
                    task.on(
                        "state_changed",
                        (snap) => {
                            const pct = Math.round(
                                (snap.bytesTransferred / snap.totalBytes) * 100
                            );
                            setUploadProgress((p) => ({
                                ...p,
                                [file.name]: pct,
                            }));
                        },
                        (err) => reject(err),
                        async () => {
                            const downloadURL = await getDownloadURL(
                                task.snapshot.ref
                            );
                            resolve(downloadURL);
                        }
                    );
                });

                urls.push(url);
            }

            setImages((prev) => [...prev, ...urls]);
            setSelectedFiles([]);
            setUploadProgress({});
        } catch (e) {
            setError(e.message || "Opplasting feilet.");
        } finally {
            setUploading(false);
        }
    };

    // Remove an image from the list (UI only)
    const removeImage = (url) => {
        setImages((prev) => prev.filter((u) => u !== url));
    };

    // ---- Viewer helpers ----
    const openViewer = (idx) => {
        setViewerIndex(idx);
        setViewerOpen(true);
    };
    const closeViewer = () => setViewerOpen(false);
    const prev = () =>
        setViewerIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setViewerIndex((i) => (i + 1) % images.length);

    return (
        <Box sx={{ mb: 6 }}>
            <Grid container spacing={6} alignItems="flex-start">
                {mainImage && (
                    <Grid item xs={12} md={6}>
                        <Box sx={{ width: "100%" }}>
                            <img
                                src={mainImage}
                                alt={title || "Bilde"}
                                onClick={() => openViewer(0)}
                                style={{
                                    width: "100%",
                                    borderRadius: 16,
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                    display: "block",
                                    cursor: "zoom-in",
                                }}
                            />
                        </Box>
                    </Grid>
                )}

                <Grid item xs={12} md={mainImage ? 6 : 12}>
                    <Box>
                        {loading ? (
                            <Typography variant="body1" color="text.secondary">
                                Laster…
                            </Typography>
                        ) : !edit ? (
                            <>
                                <Typography
                                    variant="h3"
                                    fontWeight={700}
                                    gutterBottom
                                    sx={{ pr: 12 }}
                                >
                                    {title || ""}
                                </Typography>
                                {shortDesc && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ maxWidth: 600 }}
                                    >
                                        {shortDesc}
                                    </Typography>
                                )}
                                {!currentDocId && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 2 }}
                                    >
                                        Ingen innhold her ennå. Trykk rediger
                                        for å komme i gang
                                    </Typography>
                                )}

                                {/* Bunn-plassert redigeringsknapp (kun ved innlogging) */}
                                {user && (
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        sx={{ mt: 3 }}
                                    >
                                        <Button
                                            size="medium"
                                            startIcon={<EditIcon />}
                                            onClick={() => setEdit(true)}
                                        >
                                            Rediger
                                        </Button>
                                    </Stack>
                                )}
                            </>
                        ) : (
                            <Stack spacing={2} sx={{ pt: 4 }}>
                                {/* Title + Description card */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Stack spacing={1}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                >
                                                    Tittel
                                                </Typography>
                                                <Box
                                                    component="input"
                                                    value={title}
                                                    onChange={(e) =>
                                                        setTitle(e.target.value)
                                                    }
                                                    placeholder="Skriv tittel…"
                                                    sx={{
                                                        width: "100%",
                                                        px: 1.5,
                                                        py: 1.2,
                                                        borderRadius: 1.5,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        fontSize: 16,
                                                    }}
                                                />
                                            </Stack>

                                            <Stack spacing={1}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                >
                                                    Kort beskrivelse
                                                </Typography>
                                                <Box
                                                    component="textarea"
                                                    value={shortDesc}
                                                    onChange={(e) =>
                                                        setShortDesc(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Skriv en kort beskrivelse…"
                                                    rows={3}
                                                    sx={{
                                                        width: "100%",
                                                        px: 1.5,
                                                        py: 1.2,
                                                        borderRadius: 1.5,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        fontSize: 16,
                                                        fontFamily: "inherit",
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Upload + redigeringsvisning */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                            >
                                                Bilder
                                            </Typography>

                                            <Box
                                                sx={{
                                                    border: "1.5px dashed",
                                                    borderColor: "divider",
                                                    borderRadius: 2,
                                                    p: 3,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={
                                                        <AddPhotoAlternateIcon />
                                                    }
                                                    disabled={uploading}
                                                    sx={{ mb: 1 }}
                                                >
                                                    Velg lokale bilder
                                                    <input
                                                        hidden
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={onPickFiles}
                                                    />
                                                </Button>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    PNG / JPG / WEBP • Flere
                                                    filer støttes
                                                </Typography>
                                            </Box>

                                            {selectedFiles.length > 0 && (
                                                <Stack spacing={1}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        flexWrap="wrap"
                                                        useFlexGap
                                                    >
                                                        {selectedFiles.map(
                                                            (f) => (
                                                                <Chip
                                                                    key={f.name}
                                                                    label={
                                                                        f.name
                                                                    }
                                                                    variant="outlined"
                                                                    sx={{
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                    </Stack>

                                                    {Object.keys(uploadProgress)
                                                        .length > 0 && (
                                                        <Stack spacing={1}>
                                                            {selectedFiles.map(
                                                                (f) => (
                                                                    <Box
                                                                        key={
                                                                            f.name
                                                                        }
                                                                    >
                                                                        <Typography variant="caption">
                                                                            {
                                                                                f.name
                                                                            }
                                                                        </Typography>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={
                                                                                uploadProgress[
                                                                                    f
                                                                                        .name
                                                                                ] ??
                                                                                0
                                                                            }
                                                                            sx={{
                                                                                mt: 0.5,
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                )
                                                            )}
                                                        </Stack>
                                                    )}

                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                    >
                                                        <Button
                                                            onClick={uploadAll}
                                                            disabled={
                                                                !selectedFiles.length ||
                                                                uploading
                                                            }
                                                            variant="contained"
                                                            startIcon={
                                                                <UploadIcon />
                                                            }
                                                        >
                                                            {uploading
                                                                ? "Laster opp…"
                                                                : "Last opp"}
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedFiles(
                                                                    []
                                                                );
                                                                setUploadProgress(
                                                                    {}
                                                                );
                                                            }}
                                                            disabled={uploading}
                                                        >
                                                            Tøm valg
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            )}

                                            {/* Redigerings-grid (kun i edit-mode) */}
                                            {images.length > 0 && (
                                                <>
                                                    <Divider />
                                                    <Typography variant="subtitle2">
                                                        Bilder i dokumentet
                                                    </Typography>

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {images.map(
                                                            (url, idx) => (
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={6}
                                                                    md={4}
                                                                    key={url}
                                                                >
                                                                    <Box
                                                                        onClick={() =>
                                                                            openViewer(
                                                                                idx
                                                                            )
                                                                        }
                                                                        sx={{
                                                                            position:
                                                                                "relative",
                                                                            borderRadius: 2,
                                                                            overflow:
                                                                                "hidden",
                                                                            boxShadow:
                                                                                "0 6px 20px rgba(0,0,0,0.06)",
                                                                            aspectRatio:
                                                                                "1 / 1",
                                                                            cursor: "zoom-in",
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            component="img"
                                                                            src={
                                                                                url
                                                                            }
                                                                            alt="opplastet"
                                                                            loading="lazy"
                                                                            sx={{
                                                                                position:
                                                                                    "absolute",
                                                                                inset: 0,
                                                                                width: "100%",
                                                                                height: "100%",
                                                                                objectFit:
                                                                                    "cover",
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        />
                                                                        <Tooltip title="Fjern fra listen">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    removeImage(
                                                                                        url
                                                                                    );
                                                                                }}
                                                                                sx={{
                                                                                    position:
                                                                                        "absolute",
                                                                                    top: 6,
                                                                                    right: 6,
                                                                                    bgcolor:
                                                                                        "rgba(0,0,0,0.5)",
                                                                                    color: "white",
                                                                                    "&:hover":
                                                                                        {
                                                                                            bgcolor:
                                                                                                "rgba(0,0,0,0.7)",
                                                                                        },
                                                                                }}
                                                                            >
                                                                                <DeleteForeverIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Grid>
                                                            )
                                                        )}
                                                    </Grid>
                                                </>
                                            )}

                                            {error && (
                                                <Typography
                                                    variant="body2"
                                                    color="error"
                                                >
                                                    {error}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Footer actions */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        disabled={saving || uploading}
                                    >
                                        {saving ? "Lagrer…" : "Lagre endringer"}
                                    </Button>
                                    <Button
                                        variant="text"
                                        startIcon={<CloseIcon />}
                                        disabled={saving || uploading}
                                        onClick={() => setEdit(false)}
                                    >
                                        Avbryt
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Zoom Modal */}
            <Dialog
                open={viewerOpen}
                onClose={closeViewer}
                maxWidth="lg"
                fullWidth
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 2, pt: 1 }}
                >
                    <Button
                        onClick={prev}
                        startIcon={<NavigateBeforeIcon />}
                        disabled={images.length <= 1}
                    >
                        Forrige
                    </Button>
                    <IconButton onClick={closeViewer}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <DialogContent sx={{ p: 2 }}>
                    {images.length > 0 && (
                        <>
                            <Box
                                component="img"
                                src={images[viewerIndex]}
                                alt={`Bilde ${viewerIndex + 1}`}
                                sx={{
                                    width: "100%",
                                    maxHeight: "80vh",
                                    objectFit: "contain",
                                    display: "block",
                                }}
                            />
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{ mt: 1 }}
                            >
                                <Button
                                    onClick={prev}
                                    startIcon={<NavigateBeforeIcon />}
                                    disabled={images.length <= 1}
                                >
                                    Forrige
                                </Button>
                                <Button
                                    onClick={next}
                                    endIcon={<NavigateNextIcon />}
                                    disabled={images.length <= 1}
                                >
                                    Neste
                                </Button>
                            </Stack>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
});

export default FeatureMainContent;
