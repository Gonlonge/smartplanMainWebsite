// import { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Skeleton,
//     Button,
//     Stack,
//     TextField,
//     Chip,
//     LinearProgress,
//     Divider,
//     Alert,
// } from "@mui/material";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//     doc,
//     onSnapshot,
//     query,
//     where,
//     limit,
//     collection,
//     updateDoc,
//     addDoc,
//     serverTimestamp,
// } from "firebase/firestore";
// import {
//     ref as fbRef,
//     uploadBytesResumable,
//     getDownloadURL,
// } from "firebase/storage";
// import { db, auth, storage } from "../../firebaseConfig";
// import FeatureGallery from "./FeatureGallery";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import UploadIcon from "@mui/icons-material/Upload";

// export default function FeatureBottom({ docId, slug }) {
//     const [titleTwo, setTitleTwo] = useState("");
//     const [description, setDescription] = useState("");
//     const [longDescription, setLongDescription] = useState("");
//     const [images, setImages] = useState([]);

//     const [loading, setLoading] = useState(!!(docId || slug));
//     const [error, setError] = useState("");
//     const [user, setUser] = useState(null);

//     // edit mode
//     const [edit, setEdit] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [draft, setDraft] = useState({
//         titleTwo: "",
//         description: "",
//         longDescription: "",
//     });

//     // upload state
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState({}); // {filename|id: percent}

//     const [currentDocId, setCurrentDocId] = useState(docId || null);

//     const slugify = (t) =>
//         t
//             ?.toLowerCase()
//             .trim()
//             .replace(/\s+/g, "-")
//             .replace(/[^\w-]+/g, "") || "";

//     // ---- Requirements for gallery ----
//     const GALLERY_TARGET = 3;
//     const hasMain = images.length > 0;
//     const galleryCount = Math.max(0, images.length - 1); // vi viser images[1..3]
//     const missing = Math.max(0, GALLERY_TARGET - galleryCount);

//     // auth for edit button
//     useEffect(() => {
//         const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
//         return () => unsub();
//     }, []);

//     // fetch from Firestore
//     useEffect(() => {
//         if (!docId && !slug) {
//             setLoading(false);
//             return;
//         }
//         setLoading(true);
//         setError("");
//         let unsub;

//         const apply = (data, id) => {
//             setCurrentDocId(id || currentDocId);
//             setTitleTwo(data.titleTwo || "");
//             setDescription(data.description || "");
//             setLongDescription(data.longDescription || "");
//             setImages(Array.isArray(data.images) ? data.images : []);
//             setLoading(false);
//         };

//         const onErr = (err) => {
//             setError(err.message || "Kunne ikke hente data.");
//             setLoading(false);
//         };

//         if (docId) {
//             const ref = doc(db, "features", docId);
//             unsub = onSnapshot(
//                 ref,
//                 (snap) => {
//                     if (snap.exists()) apply(snap.data() || {}, snap.id);
//                     else setLoading(false);
//                 },
//                 onErr
//             );
//         } else {
//             const qy = query(
//                 collection(db, "features"),
//                 where("slug", "==", slug),
//                 limit(1)
//             );
//             unsub = onSnapshot(
//                 qy,
//                 (qs) => {
//                     if (!qs.empty) {
//                         const d = qs.docs[0];
//                         apply(d.data() || {}, d.id);
//                     } else {
//                         // not found -> allow create on save
//                         setCurrentDocId(null);
//                         setLoading(false);
//                     }
//                 },
//                 onErr
//             );
//         }

//         return () => unsub && unsub();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [docId, slug]);

//     const startEdit = () => {
//         setDraft({
//             titleTwo: titleTwo || "",
//             description: description || "",
//             longDescription: longDescription || "",
//         });
//         setEdit(true);
//         setError("");
//     };

//     const cancelEdit = () => {
//         setEdit(false);
//         setError("");
//         setSelectedFiles([]);
//         setUploadProgress({});
//         setUploading(false);
//     };

//     const ensureDoc = async () => {
//         if (currentDocId) return currentDocId;
//         if (!slug) throw new Error("Mangler slug for å opprette dokument.");
//         const created = await addDoc(collection(db, "features"), {
//             slug,
//             titleTwo: draft.titleTwo || "",
//             description: draft.description || "",
//             longDescription: draft.longDescription || "",
//             images: [],
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//         });
//         setCurrentDocId(created.id);
//         return created.id;
//     };

//     const handleSave = async () => {
//         if (!user) {
//             setError("Du må være innlogget for å redigere.");
//             return;
//         }
//         setSaving(true);
//         setError("");

//         try {
//             const id = await ensureDoc();
//             await updateDoc(doc(db, "features", id), {
//                 titleTwo: draft.titleTwo,
//                 description: draft.description,
//                 longDescription: draft.longDescription,
//                 updatedAt: serverTimestamp(),
//             });

//             // sync local state and exit edit
//             setTitleTwo(draft.titleTwo);
//             setDescription(draft.description);
//             setLongDescription(draft.longDescription);
//             setEdit(false);
//         } catch (e) {
//             setError(e.message || "Noe gikk galt ved lagring.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // ---- Local image upload to Firebase Storage ----
//     // Merge newly picked files with the queue (avoid duplicates by name+size)
//     const onPickFiles = (e) => {
//         const files = Array.from(e.target.files || []);
//         if (!files.length) return;

//         setSelectedFiles((prev) => {
//             const map = new Map();
//             [...prev, ...files].forEach((f) => {
//                 map.set(`${f.name}-${f.size}`, f);
//             });
//             return Array.from(map.values());
//         });

//         // allow re-picking same file name again if needed
//         e.target.value = "";
//     };

//     // Upload all selected files in PARALLELL
//     const uploadAll = async () => {
//         if (!user) {
//             setError("Du må være innlogget for å laste opp bilder.");
//             return;
//         }
//         if (!selectedFiles.length) return;

//         setUploading(true);
//         setError("");
//         setUploadProgress({});

//         const effectiveSlug = (slug || slugify(titleTwo) || "untitled").slice(
//             0,
//             60
//         );

//         try {
//             const id = await ensureDoc();

//             // create one task per file — upload in parallel
//             const tasks = selectedFiles.map((file) => {
//                 const ext = file.name.split(".").pop() || "jpg";
//                 const path = `features/${effectiveSlug}/bottom/${Date.now()}_${Math.random()
//                     .toString(36)
//                     .slice(2)}.${ext}`;

//                 const fileRef = fbRef(storage, path);
//                 const task = uploadBytesResumable(fileRef, file, {
//                     contentType: file.type || "image/jpeg",
//                 });

//                 return new Promise((resolve, reject) => {
//                     task.on(
//                         "state_changed",
//                         (snap) => {
//                             const pct = Math.round(
//                                 (snap.bytesTransferred / snap.totalBytes) * 100
//                             );
//                             setUploadProgress((p) => ({
//                                 ...p,
//                                 [`${file.name}-${file.size}`]: pct,
//                             }));
//                         },
//                         (err) => reject(err),
//                         async () => {
//                             const downloadURL = await getDownloadURL(
//                                 task.snapshot.ref
//                             );
//                             resolve(downloadURL);
//                         }
//                     );
//                 });
//             });

//             const urls = await Promise.all(tasks);

//             const next = [...images, ...urls];
//             await updateDoc(doc(db, "features", id), {
//                 images: next,
//                 updatedAt: serverTimestamp(),
//             });

//             // local sync + reset picker
//             setImages(next);
//             setSelectedFiles([]);
//             setUploadProgress({});
//         } catch (e) {
//             setError(e.message || "Opplasting feilet.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     const isEmpty =
//         !titleTwo && !description && !longDescription && images.length === 0;

//     return (
//         <Box sx={{ textAlign: "center", mt: 4, position: "relative" }}>
//             {/* Top-right edit button */}
//             {user && !loading && !edit && (
//                 <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{ position: "absolute", top: 0, right: 0 }}
//                 >
//                     <Button
//                         size="small"
//                         startIcon={<EditIcon />}
//                         onClick={startEdit}
//                     >
//                         Rediger
//                     </Button>
//                 </Stack>
//             )}

//             {loading ? (
//                 <>
//                     <Skeleton
//                         variant="text"
//                         height={44}
//                         sx={{ maxWidth: 400, mx: "auto", mb: 1 }}
//                     />
//                     <Skeleton
//                         variant="text"
//                         height={24}
//                         sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
//                     />
//                 </>
//             ) : !edit ? (
//                 <>
//                     <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
//                         {titleTwo || " "}
//                     </Typography>

//                     {/* Small requirement indicator (view mode) */}
//                     {/* Vis bare for innloggede */}
//                     {user && (
//                         <Stack
//                             direction="row"
//                             spacing={1}
//                             justifyContent="center"
//                             sx={{ mb: 1 }}
//                         >
//                             <Chip
//                                 size="small"
//                                 label={`Galleribilder: ${galleryCount}/${GALLERY_TARGET}`}
//                                 color={
//                                     galleryCount >= GALLERY_TARGET
//                                         ? "success"
//                                         : "warning"
//                                 }
//                                 variant="outlined"
//                             />
//                         </Stack>
//                     )}

//                     {missing > 0 && user && (
//                         <Typography
//                             variant="body2"
//                             color="text.secondary"
//                             sx={{ mb: 2 }}
//                             component="div"
//                         >
//                             Ingen innhold her ennå. Trykk rediger for å komme i
//                             gang, anbefaler 3 bilder
//                         </Typography>
//                     )}

//                     {description && (
//                         <Typography
//                             variant="body1"
//                             color="text.secondary"
//                             sx={{ maxWidth: 800, mx: "auto", mb: 2 }}
//                         >
//                             {description}
//                         </Typography>
//                     )}

//                     {/* Gallery with inline delete for logged-in users */}
//                     <FeatureGallery
//                         docId={currentDocId}
//                         slug={slug}
//                         start={1}
//                         limit={3}
//                         editable
//                         aspect="1 / 1" // square tiles (uniform)
//                     />

//                     {longDescription && (
//                         <Box sx={{ mb: 6, mt: 2 }}>
//                             <Typography variant="body1" color="text.secondary">
//                                 {longDescription}
//                             </Typography>
//                         </Box>
//                     )}

//                     {isEmpty && (
//                         <Typography
//                             variant="body2"
//                             color="text.secondary"
//                             sx={{ mt: 2 }}
//                         >
//                             (Ingen innhold i bunnseksjonen ennå){" "}
//                             {user ? (
//                                 <Button
//                                     size="small"
//                                     startIcon={<EditIcon />}
//                                     onClick={startEdit}
//                                     sx={{ ml: 1 }}
//                                 >
//                                     Rediger
//                                 </Button>
//                             ) : (
//                                 "Logg inn for å redigere."
//                             )}
//                         </Typography>
//                     )}

//                     {error && (
//                         <Typography
//                             variant="body2"
//                             color="error"
//                             sx={{ mt: 2 }}
//                         >
//                             {error}
//                         </Typography>
//                     )}
//                 </>
//             ) : (
//                 // EDIT MODE (text + image upload)
//                 <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
//                     {/* Text fields */}
//                     <Stack spacing={2}>
//                         <TextField
//                             label="Seksjonstittel (titleTwo)"
//                             value={draft.titleTwo}
//                             onChange={(e) =>
//                                 setDraft((d) => ({
//                                     ...d,
//                                     titleTwo: e.target.value,
//                                 }))
//                             }
//                             fullWidth
//                         />
//                         <TextField
//                             label="Kort beskrivelse (description)"
//                             value={draft.description}
//                             onChange={(e) =>
//                                 setDraft((d) => ({
//                                     ...d,
//                                     description: e.target.value,
//                                 }))
//                             }
//                             fullWidth
//                             multiline
//                             minRows={3}
//                         />
//                         <TextField
//                             label="Lang beskrivelse (longDescription)"
//                             value={draft.longDescription}
//                             onChange={(e) =>
//                                 setDraft((d) => ({
//                                     ...d,
//                                     longDescription: e.target.value,
//                                 }))
//                             }
//                             fullWidth
//                             multiline
//                             minRows={4}
//                         />
//                     </Stack>

//                     {/* Requirement banner (edit mode) */}
//                     <Alert
//                         severity={
//                             galleryCount >= GALLERY_TARGET ? "success" : "info"
//                         }
//                     >
//                         <strong>Målet er 3 galleribilder.</strong> Vi viser
//                         bildene #2–#4 (etter hovedbildet).
//                         {hasMain
//                             ? " Hovedbilde er allerede satt."
//                             : " Du trenger også et hovedbilde (første bilde i listen)."}
//                         <Box sx={{ mt: 1 }}>
//                             <Chip
//                                 size="small"
//                                 label={`Galleribilder: ${galleryCount}/${GALLERY_TARGET}`}
//                                 color={
//                                     galleryCount >= GALLERY_TARGET
//                                         ? "success"
//                                         : "warning"
//                                 }
//                                 variant="outlined"
//                             />
//                             {missing > 0 && (
//                                 <Typography
//                                     component="span"
//                                     variant="body2"
//                                     sx={{ ml: 1 }}
//                                 >
//                                     Legg til minst <strong>{missing}</strong>{" "}
//                                     til.
//                                 </Typography>
//                             )}
//                         </Box>
//                     </Alert>

//                     {/* Upload box */}
//                     <Box
//                         sx={{
//                             border: "1.5px dashed",
//                             borderColor: "divider",
//                             borderRadius: 2,
//                             p: 3,
//                             textAlign: "center",
//                         }}
//                     >
//                         <Button
//                             component="label"
//                             variant="outlined"
//                             startIcon={<AddPhotoAlternateIcon />}
//                             disabled={uploading}
//                             sx={{ mb: 1 }}
//                         >
//                             Velg lokale bilder
//                             <input
//                                 hidden
//                                 type="file"
//                                 accept="image/*"
//                                 multiple
//                                 onChange={onPickFiles}
//                             />
//                         </Button>
//                         <Typography variant="body2" color="text.secondary">
//                             Velg flere på én gang (Ctrl/Cmd-klikk),{" "}
//                             <strong>eller</strong> velg flere ganger – vi legger
//                             dem i kø. PNG / JPG / WEBP støttes.
//                         </Typography>

//                         {selectedFiles.length > 0 && (
//                             <Stack spacing={1} sx={{ mt: 2 }}>
//                                 <Stack
//                                     direction="row"
//                                     spacing={1}
//                                     flexWrap="wrap"
//                                     useFlexGap
//                                 >
//                                     {selectedFiles.map((f) => (
//                                         <Chip
//                                             key={`${f.name}-${f.size}`}
//                                             label={f.name}
//                                             variant="outlined"
//                                             sx={{ mb: 1 }}
//                                         />
//                                     ))}
//                                 </Stack>

//                                 {Object.keys(uploadProgress).length > 0 && (
//                                     <Stack spacing={1}>
//                                         {selectedFiles.map((f) => (
//                                             <Box key={`${f.name}-${f.size}`}>
//                                                 <Typography variant="caption">
//                                                     {f.name}
//                                                 </Typography>
//                                                 <LinearProgress
//                                                     variant="determinate"
//                                                     value={
//                                                         uploadProgress[
//                                                             `${f.name}-${f.size}`
//                                                         ] ?? 0
//                                                     }
//                                                     sx={{ mt: 0.5 }}
//                                                 />
//                                             </Box>
//                                         ))}
//                                     </Stack>
//                                 )}

//                                 <Stack
//                                     direction="row"
//                                     spacing={1}
//                                     justifyContent="center"
//                                 >
//                                     <Button
//                                         onClick={uploadAll}
//                                         disabled={
//                                             !selectedFiles.length || uploading
//                                         }
//                                         variant="contained"
//                                         startIcon={<UploadIcon />}
//                                     >
//                                         {uploading
//                                             ? "Laster opp…"
//                                             : "Last opp alle"}
//                                     </Button>
//                                     <Button
//                                         onClick={() => {
//                                             setSelectedFiles([]);
//                                             setUploadProgress({});
//                                         }}
//                                         disabled={uploading}
//                                     >
//                                         Tøm kø
//                                     </Button>
//                                 </Stack>
//                             </Stack>
//                         )}
//                     </Box>

//                     <Divider />

//                     {error && (
//                         <Typography variant="body2" color="error">
//                             {error}
//                         </Typography>
//                     )}

//                     {/* Save/Cancel */}
//                     <Stack direction="row" spacing={1} justifyContent="center">
//                         <Button
//                             variant="contained"
//                             startIcon={<SaveIcon />}
//                             onClick={handleSave}
//                             disabled={saving || uploading}
//                         >
//                             {saving ? "Lagrer…" : "Lagre tekst"}
//                         </Button>
//                         <Button
//                             variant="text"
//                             startIcon={<CloseIcon />}
//                             onClick={cancelEdit}
//                             disabled={saving || uploading}
//                         >
//                             Avbryt
//                         </Button>
//                     </Stack>
//                 </Stack>
//             )}
//         </Box>
//     );
// }

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
    doc,
    onSnapshot,
    query,
    where,
    limit,
    collection,
    updateDoc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    ref as fbRef,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { db, auth, storage } from "../../firebaseConfig";
import FeatureGallery from "./FeatureGallery.jsx";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadIcon from "@mui/icons-material/Upload";

export default function FeatureBottom({ docId, slug }) {
    const [titleTwo, setTitleTwo] = useState("");
    const [description, setDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(!!(docId || slug));
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [draft, setDraft] = useState({
        titleTwo: "",
        description: "",
        longDescription: "",
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [currentDocId, setCurrentDocId] = useState(docId || null);

    const slugify = (t) =>
        t
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || "";

    const GALLERY_TARGET = 3;
    const hasMain = images.length > 0;
    const galleryCount = Math.max(0, images.length - 1);
    const missing = Math.max(0, GALLERY_TARGET - galleryCount);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!docId && !slug) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        let unsub;

        const apply = (data, id) => {
            setCurrentDocId(id || currentDocId);
            setTitleTwo(data.titleTwo || "");
            setDescription(data.description || "");
            setLongDescription(data.longDescription || "");
            setImages(Array.isArray(data.images) ? data.images : []);
            setLoading(false);
        };

        const onErr = (err) => {
            setError(err.message || "Kunne ikke hente data.");
            setLoading(false);
        };

        if (docId) {
            const ref = doc(db, "features", docId);
            unsub = onSnapshot(
                ref,
                (snap) => {
                    if (snap.exists()) apply(snap.data() || {}, snap.id);
                    else setLoading(false);
                },
                onErr
            );
        } else {
            const qy = query(
                collection(db, "features"),
                where("slug", "==", slug),
                limit(1)
            );
            unsub = onSnapshot(
                qy,
                (qs) => {
                    if (!qs.empty) {
                        const d = qs.docs[0];
                        apply(d.data() || {}, d.id);
                    } else {
                        setCurrentDocId(null);
                        setLoading(false);
                    }
                },
                onErr
            );
        }

        return () => unsub && unsub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docId, slug]);

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
        if (!slug) throw new Error("Mangler slug for å opprette dokument.");
        const created = await addDoc(collection(db, "features"), {
            slug,
            titleTwo: draft.titleTwo || "",
            description: draft.description || "",
            longDescription: draft.longDescription || "",
            images: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        setCurrentDocId(created.id);
        return created.id;
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
            await updateDoc(doc(db, "features", id), {
                titleTwo: draft.titleTwo,
                description: draft.description,
                longDescription: draft.longDescription,
                updatedAt: serverTimestamp(),
            });

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

            const tasks = selectedFiles.map((file) => {
                const ext = file.name.split(".").pop() || "jpg";
                const path = `features/${effectiveSlug}/bottom/${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2)}.${ext}`;

                const fileRef = fbRef(storage, path);
                const task = uploadBytesResumable(fileRef, file, {
                    contentType: file.type || "image/jpeg",
                });

                return new Promise((resolve, reject) => {
                    task.on(
                        "state_changed",
                        (snap) => {
                            const pct = Math.round(
                                (snap.bytesTransferred / snap.totalBytes) * 100
                            );
                            setUploadProgress((p) => ({
                                ...p,
                                [`${file.name}-${file.size}`]: pct,
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
            });

            const urls = await Promise.all(tasks);

            const next = [...images, ...urls];
            await updateDoc(doc(db, "features", id), {
                images: next,
                updatedAt: serverTimestamp(),
            });

            setImages(next);
            setSelectedFiles([]);
            setUploadProgress({});
        } catch (e) {
            setError(e.message || "Opplasting feilet.");
        } finally {
            setUploading(false);
        }
    };

    const isEmpty =
        !titleTwo && !description && !longDescription && images.length === 0;

    return (
        <Box sx={{ textAlign: "center", mt: 4, position: "relative" }}>
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
                    <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
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

                    <FeatureGallery
                        docId={currentDocId}
                        slug={slug}
                        start={1}
                        limit={3}
                        editable
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

                    {error && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 2 }}
                        >
                            {error}
                        </Typography>
                    )}
                </>
            ) : (
                <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
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

                    <Alert
                        severity={
                            galleryCount >= GALLERY_TARGET ? "success" : "info"
                        }
                    >
                        <strong>Målet er 3 galleribilder.</strong> Vi viser
                        bildene #2–#4 (etter hovedbildet).
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

                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}

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
