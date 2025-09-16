// import { useEffect, useMemo, useState } from "react";
// import {
//     Box,
//     Typography,
//     Skeleton,
//     Button,
//     Stack,
//     TextField,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
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
// import { db, auth } from "../../firebaseConfig";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";

// import { getIconFromSlug } from "../../data/featureIcons";

// export default function FeatureHeader({ docId, slug }) {
//     const Icon = useMemo(() => getIconFromSlug(slug), [slug]);

//     const [headerTitle, setHeaderTitle] = useState("");
//     const [headerIntro, setHeaderIntro] = useState("");

//     const [draftTitle, setDraftTitle] = useState("");
//     const [draftIntro, setDraftIntro] = useState("");

//     const [loading, setLoading] = useState(!!(docId || slug));
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [user, setUser] = useState(null);
//     const [editOpen, setEditOpen] = useState(false);
//     const [currentDocId, setCurrentDocId] = useState(docId || null);

//     // Auth -> show edit button
//     useEffect(() => {
//         const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
//         return () => unsub();
//     }, []);

//     // Fetch header fields (realtime)
//     useEffect(() => {
//         setLoading(!!(docId || slug));
//         setError("");
//         let unsub;

//         const applyData = (data, id) => {
//             if (id) setCurrentDocId(id);
//             setHeaderTitle(data.headerTitle || "");
//             setHeaderIntro(data.headerIntro || "");
//             setLoading(false);
//         };

//         const handleErr = (err) => {
//             setError(err.message || "Kunne ikke hente.");
//             setLoading(false);
//         };

//         if (docId) {
//             const ref = doc(db, "features", docId);
//             unsub = onSnapshot(
//                 ref,
//                 (snap) => {
//                     if (snap.exists()) applyData(snap.data() || {}, snap.id);
//                     else setLoading(false);
//                 },
//                 handleErr
//             );
//         } else if (slug) {
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
//                         applyData(d.data() || {}, d.id);
//                     } else {
//                         setCurrentDocId(null);
//                         setLoading(false);
//                     }
//                 },
//                 handleErr
//             );
//         } else {
//             setLoading(false);
//         }

//         return () => unsub && unsub();
//     }, [docId, slug]);

//     // Open modal with current values
//     const startEdit = () => {
//         setDraftTitle(headerTitle || "");
//         setDraftIntro(headerIntro || "");
//         setError("");
//         setEditOpen(true);
//     };

//     const closeEdit = () => {
//         if (saving) return; // avoid closing while saving
//         setEditOpen(false);
//         setError("");
//     };

//     const handleSave = async () => {
//         if (!user) {
//             setError("Du må være innlogget for å redigere headeren.");
//             return;
//         }
//         setSaving(true);
//         setError("");
//         try {
//             if (currentDocId) {
//                 await updateDoc(doc(db, "features", currentDocId), {
//                     headerTitle: draftTitle,
//                     headerIntro: draftIntro,
//                     updatedAt: serverTimestamp(),
//                 });
//             } else {
//                 if (!slug)
//                     throw new Error("Mangler slug for å opprette dokument.");
//                 const created = await addDoc(collection(db, "features"), {
//                     slug,
//                     headerTitle: draftTitle,
//                     headerIntro: draftIntro,
//                     images: [],
//                     createdAt: serverTimestamp(),
//                     updatedAt: serverTimestamp(),
//                 });
//                 setCurrentDocId(created.id);
//             }
//             // sync local + close
//             setHeaderTitle(draftTitle);
//             setHeaderIntro(draftIntro);
//             setEditOpen(false);
//         } catch (e) {
//             setError(e.message || "Noe gikk galt ved lagring.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const displayTitle = headerTitle || "Uten tittel";
//     const displayIntro = headerIntro || "";

//     return (
//         <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
//             {user && !loading && (
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

//             <Box
//                 sx={{
//                     color: "primary.main",
//                     bgcolor: (t) => `${t.palette.primary.main}15`,
//                     borderRadius: "50%",
//                     width: 72,
//                     height: 72,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mx: "auto",
//                     mb: 2,
//                 }}
//             >
//                 <Icon fontSize="large" />
//             </Box>

//             {loading ? (
//                 <>
//                     <Skeleton
//                         variant="text"
//                         height={48}
//                         sx={{ maxWidth: 420, mx: "auto", mb: 1 }}
//                     />
//                     <Skeleton
//                         variant="text"
//                         height={28}
//                         sx={{ maxWidth: 560, mx: "auto" }}
//                     />
//                 </>
//             ) : (
//                 <>
//                     <Typography
//                         variant="h2"
//                         component="h1"
//                         sx={{ fontWeight: 700, mb: 2 }}
//                     >
//                         {displayTitle}
//                     </Typography>
//                     {displayIntro && (
//                         <Typography
//                             variant="h6"
//                             sx={{
//                                 maxWidth: 700,
//                                 mx: "auto",
//                                 color: "text.secondary",
//                                 fontWeight: 400,
//                                 mb: 4,
//                             }}
//                         >
//                             {displayIntro}
//                         </Typography>
//                     )}
//                     {error && !editOpen && (
//                         <Typography variant="body2" color="error">
//                             {error}
//                         </Typography>
//                     )}
//                 </>
//             )}

//             {/* Edit Modal */}
//             <Dialog open={editOpen} onClose={closeEdit} maxWidth="sm" fullWidth>
//                 <DialogTitle>Rediger header</DialogTitle>
//                 <DialogContent dividers>
//                     <Stack spacing={2} sx={{ mt: 1 }}>
//                         <TextField
//                             label="Header tittel"
//                             value={draftTitle}
//                             onChange={(e) => setDraftTitle(e.target.value)}
//                             fullWidth
//                             autoFocus
//                         />
//                         <TextField
//                             label="Header intro"
//                             value={draftIntro}
//                             onChange={(e) => setDraftIntro(e.target.value)}
//                             fullWidth
//                             multiline
//                             minRows={3}
//                         />
//                         {error && (
//                             <Typography variant="body2" color="error">
//                                 {error}
//                             </Typography>
//                         )}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         startIcon={<CloseIcon />}
//                         onClick={closeEdit}
//                         disabled={saving}
//                     >
//                         Avbryt
//                     </Button>
//                     <Button
//                         variant="contained"
//                         startIcon={<SaveIcon />}
//                         onClick={handleSave}
//                         disabled={saving}
//                     >
//                         {saving ? "Lagrer…" : "Lagre"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// }

import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Skeleton,
    Button,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
import { db, auth } from "../../firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { getIconFromSlug } from "../../data/featureIcons";

export default function FeatureHeader({ docId, slug }) {
    const Icon = useMemo(() => getIconFromSlug(slug), [slug]);

    const [headerTitle, setHeaderTitle] = useState("");
    const [headerIntro, setHeaderIntro] = useState("");

    const [draftTitle, setDraftTitle] = useState("");
    const [draftIntro, setDraftIntro] = useState("");

    const [loading, setLoading] = useState(!!(docId || slug));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [currentDocId, setCurrentDocId] = useState(docId || null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
        return () => unsub();
    }, []);

    useEffect(() => {
        setLoading(!!(docId || slug));
        setError("");
        let unsub;

        const applyData = (data, id) => {
            if (id) setCurrentDocId(id);
            setHeaderTitle(data.headerTitle || "");
            setHeaderIntro(data.headerIntro || "");
            setLoading(false);
        };

        const handleErr = (err) => {
            setError(err.message || "Kunne ikke hente.");
            setLoading(false);
        };

        if (docId) {
            const ref = doc(db, "features", docId);
            unsub = onSnapshot(
                ref,
                (snap) => {
                    if (snap.exists()) applyData(snap.data() || {}, snap.id);
                    else setLoading(false);
                },
                handleErr
            );
        } else if (slug) {
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
                        applyData(d.data() || {}, d.id);
                    } else {
                        setCurrentDocId(null);
                        setLoading(false);
                    }
                },
                handleErr
            );
        } else {
            setLoading(false);
        }

        return () => unsub && unsub();
    }, [docId, slug]);

    const startEdit = () => {
        setDraftTitle(headerTitle || "");
        setDraftIntro(headerIntro || "");
        setError("");
        setEditOpen(true);
    };

    const closeEdit = () => {
        if (saving) return;
        setEditOpen(false);
        setError("");
    };

    const handleSave = async () => {
        if (!user) {
            setError("Du må være innlogget for å redigere headeren.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            if (currentDocId) {
                await updateDoc(doc(db, "features", currentDocId), {
                    headerTitle: draftTitle,
                    headerIntro: draftIntro,
                    updatedAt: serverTimestamp(),
                });
            } else {
                if (!slug)
                    throw new Error("Mangler slug for å opprette dokument.");
                const created = await addDoc(collection(db, "features"), {
                    slug,
                    headerTitle: draftTitle,
                    headerIntro: draftIntro,
                    images: [],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                setCurrentDocId(created.id);
            }
            setHeaderTitle(draftTitle);
            setHeaderIntro(draftIntro);
            setEditOpen(false);
        } catch (e) {
            setError(e.message || "Noe gikk galt ved lagring.");
        } finally {
            setSaving(false);
        }
    };

    const displayTitle = headerTitle || "";
    const displayIntro = headerIntro || "";

    return (
        <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
            {user && !loading && (
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

            <Box
                sx={{
                    color: "primary.main",
                    bgcolor: (t) => `${t.palette.primary.main}15`,
                    borderRadius: "50%",
                    width: 72,
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                }}
            >
                <Icon fontSize="large" />
            </Box>

            {loading ? (
                <>
                    <Skeleton
                        variant="text"
                        height={48}
                        sx={{ maxWidth: 420, mx: "auto", mb: 1 }}
                    />
                    <Skeleton
                        variant="text"
                        height={28}
                        sx={{ maxWidth: 560, mx: "auto" }}
                    />
                </>
            ) : (
                <>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{ fontWeight: 700, mb: 2 }}
                    >
                        {displayTitle}
                    </Typography>
                    {displayIntro && (
                        <Typography
                            variant="h6"
                            sx={{
                                maxWidth: 700,
                                mx: "auto",
                                color: "text.secondary",
                                fontWeight: 400,
                                mb: 4,
                            }}
                        >
                            {displayIntro}
                        </Typography>
                    )}
                    {error && !editOpen && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                </>
            )}

            <Dialog open={editOpen} onClose={closeEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Rediger header</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Header tittel"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Header intro"
                            value={draftIntro}
                            onChange={(e) => setDraftIntro(e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                        />
                        {error && (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        startIcon={<CloseIcon />}
                        onClick={closeEdit}
                        disabled={saving}
                    >
                        Avbryt
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Lagrer…" : "Lagre"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
