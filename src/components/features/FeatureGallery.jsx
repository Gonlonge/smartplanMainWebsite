// import { useEffect, useState } from "react";
// import {
//     Grid,
//     Box,
//     IconButton,
//     Tooltip,
//     Skeleton,
//     Dialog,
//     DialogContent,
//     Stack,
//     Button,
//     Typography,
// } from "@mui/material";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//     doc,
//     onSnapshot,
//     query,
//     where,
//     limit as qlimit,
//     collection,
//     updateDoc,
// } from "firebase/firestore";
// import { ref as storageRef, deleteObject } from "firebase/storage";
// import { db, auth, storage } from "../../firebaseConfig";

// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import CloseIcon from "@mui/icons-material/Close";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// export default function FeatureGallery({
//     images: imagesProp,
//     docId,
//     slug,
//     field = "images",
//     start = 0,
//     limit = null,
//     editable = false,
//     onChange,
//     deleteFromStorage = true,
//     aspect = "1 / 1",
// }) {
//     const [user, setUser] = useState(null);

//     const [loading, setLoading] = useState(!!(!imagesProp && (docId || slug)));
//     const [error, setError] = useState("");
//     const [fullImages, setFullImages] = useState([]);
//     const [currentDocId, setCurrentDocId] = useState(docId || null);

//     // Lightbox
//     const [viewerOpen, setViewerOpen] = useState(false);
//     const [viewerIndex, setViewerIndex] = useState(0);

//     useEffect(() => {
//         const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
//         return () => unsub();
//     }, []);

//     useEffect(() => {
//         if (imagesProp) {
//             setLoading(false);
//             setError("");
//             return;
//         }
//         if (!docId && !slug) {
//             setLoading(false);
//             return;
//         }

//         setLoading(true);
//         setError("");
//         let unsub;

//         const apply = (data, id) => {
//             const raw = data && Array.isArray(data[field]) ? data[field] : [];
//             setFullImages(raw);
//             if (id) setCurrentDocId(id);
//             setLoading(false);
//         };

//         const onErr = (err) => {
//             setError(err.message || "Kunne ikke hente bilder.");
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
//                 qlimit(1)
//             );
//             unsub = onSnapshot(
//                 qy,
//                 (qs) => {
//                     if (!qs.empty) {
//                         const d = qs.docs[0];
//                         apply(d.data() || {}, d.id);
//                     } else {
//                         setFullImages([]);
//                         setCurrentDocId(null);
//                         setLoading(false);
//                     }
//                 },
//                 onErr
//             );
//         }

//         return () => unsub && unsub();
//     }, [imagesProp, docId, slug, field]);

//     const sourceImages = imagesProp ?? fullImages;
//     const end =
//         limit == null ? sourceImages.length : start + Math.max(0, limit);
//     const displayImages = sourceImages.slice(start, end);

//     if (!loading && displayImages.length === 0 && !editable) return null;

//     const openViewer = (idx) => {
//         setViewerIndex(idx);
//         setViewerOpen(true);
//     };
//     const closeViewer = () => setViewerOpen(false);
//     const prev = () =>
//         setViewerIndex(
//             (i) => (i - 1 + displayImages.length) % displayImages.length
//         );
//     const next = () => setViewerIndex((i) => (i + 1) % displayImages.length);

//     const canEdit = editable && !!user;

//     const extractStoragePath = (url) => {
//         try {
//             const m = url.match(/\/o\/([^?]+)/);
//             if (!m) return null;
//             return decodeURIComponent(m[1]);
//         } catch {
//             return null;
//         }
//     };

//     const removeAt = async (idxInDisplay) => {
//         const absoluteIndex = start + idxInDisplay;
//         const urlToDelete = sourceImages[absoluteIndex];

//         if (imagesProp) {
//             const nextImages = [...sourceImages];
//             nextImages.splice(absoluteIndex, 1);
//             if (onChange) onChange(nextImages);
//             return;
//         }

//         if (!currentDocId) return;
//         try {
//             const nextImages = [...fullImages];
//             nextImages.splice(absoluteIndex, 1);

//             await updateDoc(doc(db, "features", currentDocId), {
//                 [field]: nextImages,
//             });
//             setFullImages(nextImages);

//             if (deleteFromStorage && urlToDelete) {
//                 const path = extractStoragePath(urlToDelete);
//                 if (path) {
//                     try {
//                         await deleteObject(storageRef(storage, path));
//                     } catch {
//                         setError(
//                             "Bildet ble fjernet fra listen, men kunne ikke slettes fra Storage."
//                         );
//                     }
//                 }
//             }
//         } catch (e) {
//             setError(e.message || "Kunne ikke fjerne bilde.");
//         }
//     };

//     return (
//         <Box sx={{ my: 6, position: "relative" }}>
//             {loading ? (
//                 <Grid container spacing={4}>
//                     {[0, 1, 2].map((i) => (
//                         <Grid item xs={12} sm={6} md={4} key={i}>
//                             <Box
//                                 sx={{
//                                     position: "relative",
//                                     borderRadius: 2,
//                                     overflow: "hidden",
//                                     aspectRatio: aspect,
//                                 }}
//                             >
//                                 <Skeleton
//                                     variant="rectangular"
//                                     sx={{ position: "absolute", inset: 0 }}
//                                 />
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             ) : displayImages.length === 0 ? (
//                 <Box sx={{ textAlign: "center" }}>
//                     <Typography variant="body2" color="text.secondary">
//                         (Ingen bilder ennå)
//                     </Typography>
//                 </Box>
//             ) : (
//                 <Grid container spacing={4}>
//                     {displayImages.map((img, index) => (
//                         <Grid
//                             item
//                             xs={12}
//                             sm={6}
//                             md={4}
//                             key={`${img}-${index}`}
//                         >
//                             {/* uniform tiles */}
//                             <Box
//                                 sx={{
//                                     position: "relative",
//                                     borderRadius: 2,
//                                     overflow: "hidden",
//                                     boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
//                                     aspectRatio: aspect,
//                                 }}
//                             >
//                                 <Box
//                                     component="img"
//                                     src={img}
//                                     alt={`Eksempel ${start + index + 1}`}
//                                     onClick={() => openViewer(index)}
//                                     sx={{
//                                         position: "absolute",
//                                         inset: 0,
//                                         width: "100%",
//                                         height: "100%",
//                                         objectFit: "cover",
//                                         display: "block",
//                                         cursor: "zoom-in", // du kan sette til 'default' hvis du vil
//                                     }}
//                                 />

//                                 {/* Kun slett-ikon for innloggede (fjernet "åpne" ikon) */}
//                                 {canEdit && (
//                                     <Stack
//                                         direction="row"
//                                         spacing={1}
//                                         sx={{
//                                             position: "absolute",
//                                             top: 8,
//                                             right: 8,
//                                             opacity: 0.98,
//                                         }}
//                                     >
//                                         <Tooltip title="Fjern bilde">
//                                             <IconButton
//                                                 size="small"
//                                                 onClick={() => removeAt(index)}
//                                                 sx={{
//                                                     bgcolor:
//                                                         "rgba(255,255,255,0.9)",
//                                                 }}
//                                             >
//                                                 <DeleteForeverIcon fontSize="small" />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </Stack>
//                                 )}
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}

//             {error && (
//                 <Typography variant="body2" color="error" sx={{ mt: 2 }}>
//                     {error}
//                 </Typography>
//             )}

//             {/* Lightbox */}
//             <Dialog
//                 open={viewerOpen}
//                 onClose={closeViewer}
//                 maxWidth="lg"
//                 fullWidth
//             >
//                 <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     sx={{ px: 2, pt: 1 }}
//                 >
//                     <Button
//                         onClick={prev}
//                         startIcon={<NavigateBeforeIcon />}
//                         disabled={displayImages.length <= 1}
//                     >
//                         Forrige
//                     </Button>
//                     <IconButton onClick={closeViewer}>
//                         <CloseIcon />
//                     </IconButton>
//                 </Stack>
//                 <DialogContent sx={{ p: 2 }}>
//                     <Box
//                         component="img"
//                         src={displayImages[viewerIndex]}
//                         alt={`Bilde ${start + viewerIndex + 1}`}
//                         sx={{
//                             width: "100%",
//                             maxHeight: "80vh",
//                             objectFit: "contain",
//                             display: "block",
//                         }}
//                     />
//                     <Stack
//                         direction="row"
//                         justifyContent="space-between"
//                         sx={{ mt: 1 }}
//                     >
//                         <Button
//                             onClick={prev}
//                             startIcon={<NavigateBeforeIcon />}
//                             disabled={displayImages.length <= 1}
//                         >
//                             Forrige
//                         </Button>
//                         <Button
//                             onClick={next}
//                             endIcon={<NavigateNextIcon />}
//                             disabled={displayImages.length <= 1}
//                         >
//                             Neste
//                         </Button>
//                     </Stack>
//                 </DialogContent>
//             </Dialog>
//         </Box>
//     );
// }
