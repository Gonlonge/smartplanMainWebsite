import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Skeleton,
    Button,
    Stack,
    TextField,
    Chip,
    LinearProgress,
    Divider,
    Alert,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import {
    listenFeature,
    ensureFeatureDoc,
    updateFeatureDoc,
    uploadFilesToFeatureBottom,
    slugify,
} from "../../firebase/queries/features";
import { auth } from "../../firebaseConfig";
import FeatureGalleryView from "./FeatureGalleryView";
import { useFeatureImages } from "../../firebase/queries/useFeatureImages";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadIcon from "@mui/icons-material/Upload";

export default function FeatureBottom({ docId, slug }) {
    const [titleTwo, setTitleTwo] = useState("");
    const [description, setDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");

    const [loading, setLoading] = useState(!!(docId || slug));
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    // edit mode
    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [draft, setDraft] = useState({
        titleTwo: "",
        description: "",
        longDescription: "",
    });

    // upload state (FIXED: removed stray "the")
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({}); // {key: pct}

    const [currentDocId, setCurrentDocId] = useState(docId || null);

    // auth
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
        return () => unsub();
    }, []);

    // text-data (Firestore)
    useEffect(() => {
        setLoading(!!(docId || slug));
        setError("");

        const unsub = listenFeature(
            { docId, slug },
            (data, id) => {
                if (data) {
                    setCurrentDocId(id || data.id || null);
                    setTitleTwo(data.titleTwo || "");
                    setDescription(data.description || "");
                    setLongDescription(data.longDescription || "");
                } else {
                    setCurrentDocId(null);
                }
                setLoading(false);
            },
            (err) => {
                setError(err?.message || "Kunne ikke hente data.");
                setLoading(false);
            }
        );

        return () => unsub && unsub();
    }, [docId, slug]);

    // images via hook (én kilde til sannhet for galleriet)
    const {
        images,
        loading: imagesLoading,
        error: imagesError,
        removeAt,
    } = useFeatureImages({ docId: currentDocId, slug, field: "images" });

    // Safety: ensure array
    const imagesSafe = Array.isArray(images) ? images : [];

    // Slice off the main image so it doesn't show again in the bottom gallery
    const galleryImages = imagesSafe.slice(1, 4); // show images #2–#4 only

    // Galleri-krav
    const GALLERY_TARGET = 3;
    const hasMain = imagesSafe.length > 0;
    const galleryCount = galleryImages.length; // count only what we actually display
    const missing = Math.max(0, GALLERY_TARGET - galleryCount);

    const startEdit = () => {
        setDraft({
            titleTwo: titleTwo || "",
            description: description || "",
            longDescription: longDescription || "",
        });
        setEdit(true);
        setError("");
    };

    const cancelEdit = () => {
        setEdit(false);
        setError("");
        setSelectedFiles([]);
        setUploadProgress({});
        setUploading(false);
    };

    const ensureDoc = async () => {
        if (currentDocId) return currentDocId;
        const id = await ensureFeatureDoc({
            slug,
            initial: {
                titleTwo: draft.titleTwo || "",
                description: draft.description || "",
                longDescription: draft.longDescription || "",
                images: [],
            },
        });
        setCurrentDocId(id);
        return id;
    };

    const handleSave = async () => {
        if (!user) {
            setError("Du må være innlogget for å redigere.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const id = await ensureDoc();
            await updateFeatureDoc(id, {
                titleTwo: draft.titleTwo,
                description: draft.description,
                longDescription: draft.longDescription,
            });
            // sync local
            setTitleTwo(draft.titleTwo);
            setDescription(draft.description);
            setLongDescription(draft.longDescription);
            setEdit(false);
        } catch (e) {
            setError(e.message || "Noe gikk galt ved lagring.");
        } finally {
            setSaving(false);
        }
    };

    // ---- Opplasting ----
    const onPickFiles = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setSelectedFiles((prev) => {
            const map = new Map();
            [...prev, ...files].forEach((f) =>
                map.set(`${f.name}-${f.size}`, f)
            );
            return Array.from(map.values());
        });
        e.target.value = "";
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

        const effectiveSlug = (slug || slugify(titleTwo) || "untitled").slice(
            0,
            60
        );

        try {
            const id = await ensureDoc();

            const urls = await uploadFilesToFeatureBottom({
                featureId: id,
                files: selectedFiles,
                folderSlug: effectiveSlug,
                setProgress: (key, pct) =>
                    setUploadProgress((p) => ({ ...p, [key]: pct })),
            });

            // Append i DB – hooken fanger opp real-time endringen
            await updateFeatureDoc(id, { images: [...imagesSafe, ...urls] });

            setSelectedFiles([]);
            setUploadProgress({});
        } catch (e) {
            setError(e.message || "Opplasting feilet.");
        } finally {
            setUploading(false);
        }
    };

    const isEmpty =
        !titleTwo &&
        !description &&
        !longDescription &&
        imagesSafe.length === 0;

    return (
        <Box sx={{ textAlign: "center", mt: 4, position: "relative" }}>
            {/* Edit knapp */}
            {user && !loading && !edit && (
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 0, right: 0 }}
                >
                    <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={startEdit}
                    >
                        Rediger
                    </Button>
                </Stack>
            )}

            {loading ? (
                <>
                    <Skeleton
                        variant="text"
                        height={44}
                        sx={{ maxWidth: 400, mx: "auto", mb: 1 }}
                    />
                    <Skeleton
                        variant="text"
                        height={24}
                        sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
                    />
                </>
            ) : !edit ? (
                <>
                    <Typography variant="h3" sx={{ fontWeight: 600, mb: 1.5 }}>
                        {titleTwo || " "}
                    </Typography>

                    {user && (
                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            sx={{ mb: 1 }}
                        >
                            <Chip
                                size="small"
                                label={`Galleribilder: ${galleryCount}/${GALLERY_TARGET}`}
                                color={
                                    galleryCount >= GALLERY_TARGET
                                        ? "success"
                                        : "warning"
                                }
                                variant="outlined"
                            />
                        </Stack>
                    )}

                    {missing > 0 && user && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                            component="div"
                        >
                            Ingen innhold her ennå. Trykk rediger for å komme i
                            gang, anbefaler 3 bilder
                        </Typography>
                    )}

                    {description && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ maxWidth: 800, mx: "auto", mb: 2 }}
                        >
                            {description}
                        </Typography>
                    )}

                    {/* Galleriet – kun bilder #2–#4 */}
                    <FeatureGalleryView
                        images={galleryImages}
                        loading={imagesLoading}
                        error={imagesError}
                        editable={!!user}
                        onDelete={(idxInDisplay) =>
                            removeAt(1 + idxInDisplay, {
                                deleteFromStorage: true,
                            })
                        }
                        start={0}
                        limit={null}
                        aspect="1 / 1"
                    />

                    {longDescription && (
                        <Box sx={{ mb: 6, mt: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                {longDescription}
                            </Typography>
                        </Box>
                    )}

                    {isEmpty && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            (Ingen innhold i bunnseksjonen ennå){" "}
                            {user ? (
                                <Button
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={startEdit}
                                    sx={{ ml: 1 }}
                                >
                                    Rediger
                                </Button>
                            ) : (
                                "Logg inn for å redigere."
                            )}
                        </Typography>
                    )}

                    {(error || imagesError) && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 2 }}
                        >
                            {error || imagesError}
                        </Typography>
                    )}
                </>
            ) : (
                // EDIT
                <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
                    {/* Tekstfelter */}
                    <Stack spacing={2}>
                        <TextField
                            label="Seksjonstittel (titleTwo)"
                            value={draft.titleTwo}
                            onChange={(e) =>
                                setDraft((d) => ({
                                    ...d,
                                    titleTwo: e.target.value,
                                }))
                            }
                            fullWidth
                        />
                        <TextField
                            label="Kort beskrivelse (description)"
                            value={draft.description}
                            onChange={(e) =>
                                setDraft((d) => ({
                                    ...d,
                                    description: e.target.value,
                                }))
                            }
                            fullWidth
                            multiline
                            minRows={3}
                        />
                        <TextField
                            label="Lang beskrivelse (longDescription)"
                            value={draft.longDescription}
                            onChange={(e) =>
                                setDraft((d) => ({
                                    ...d,
                                    longDescription: e.target.value,
                                }))
                            }
                            fullWidth
                            multiline
                            minRows={4}
                        />
                    </Stack>

                    {/* Kravbanner */}
                    <Alert
                        severity={
                            galleryCount >= GALLERY_TARGET ? "success" : "info"
                        }
                    >
                        <strong>Målet er 3 galleribilder.</strong> Vi viser
                        bildene #2–#4 (etter hovedbilde).
                        {hasMain
                            ? " Hovedbilde er allerede satt."
                            : " Du trenger også et hovedbilde (første bilde i listen)."}
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                size="small"
                                label={`Galleribilder: ${galleryCount}/${GALLERY_TARGET}`}
                                color={
                                    galleryCount >= GALLERY_TARGET
                                        ? "success"
                                        : "warning"
                                }
                                variant="outlined"
                            />
                            {missing > 0 && (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                >
                                    Legg til minst <strong>{missing}</strong>{" "}
                                    til.
                                </Typography>
                            )}
                        </Box>
                    </Alert>

                    {/* Upload-boks */}
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
                            startIcon={<AddPhotoAlternateIcon />}
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
                        <Typography variant="body2" color="text.secondary">
                            Velg flere på én gang (Ctrl/Cmd-klikk),{" "}
                            <strong>eller</strong> velg flere ganger – vi legger
                            dem i kø. PNG / JPG / WEBP støttes.
                        </Typography>

                        {selectedFiles.length > 0 && (
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    {selectedFiles.map((f) => (
                                        <Chip
                                            key={`${f.name}-${f.size}`}
                                            label={f.name}
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Stack>

                                {Object.keys(uploadProgress).length > 0 && (
                                    <Stack spacing={1}>
                                        {selectedFiles.map((f) => (
                                            <Box key={`${f.name}-${f.size}`}>
                                                <Typography variant="caption">
                                                    {f.name}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={
                                                        uploadProgress[
                                                            `${f.name}-${f.size}`
                                                        ] ?? 0
                                                    }
                                                    sx={{ mt: 0.5 }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                )}

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyContent="center"
                                >
                                    <Button
                                        onClick={uploadAll}
                                        disabled={
                                            !selectedFiles.length || uploading
                                        }
                                        variant="contained"
                                        startIcon={<UploadIcon />}
                                    >
                                        {uploading
                                            ? "Laster opp…"
                                            : "Last opp alle"}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedFiles([]);
                                            setUploadProgress({});
                                        }}
                                        disabled={uploading}
                                    >
                                        Tøm kø
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </Box>

                    <Divider />

                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}

                    {/* Lagre/Avbryt */}
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving || uploading}
                        >
                            {saving ? "Lagrer…" : "Lagre tekst"}
                        </Button>
                        <Button
                            variant="text"
                            startIcon={<CloseIcon />}
                            onClick={cancelEdit}
                            disabled={saving || uploading}
                        >
                            Avbryt
                        </Button>
                    </Stack>
                </Stack>
            )}
        </Box>
    );
}
