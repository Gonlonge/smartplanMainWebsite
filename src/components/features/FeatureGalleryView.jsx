// src/components/features/FeatureGalleryView.jsx
import {
    Grid,
    Box,
    IconButton,
    Tooltip,
    Skeleton,
    Dialog,
    DialogContent,
    Stack,
    Button,
    Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState } from "react";

export default function FeatureGalleryView({
    images,
    loading,
    error,
    editable = false,
    onDelete, // (indexInDisplay) => void
    start = 0,
    limit = null,
    aspect = "1 / 1",
}) {
    const end = limit == null ? images.length : start + Math.max(0, limit);
    const displayImages = images.slice(start, end);

    // Lightbox
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const openViewer = (idx) => {
        setViewerIndex(idx);
        setViewerOpen(true);
    };
    const closeViewer = () => setViewerOpen(false);
    const prev = () =>
        setViewerIndex(
            (i) => (i - 1 + displayImages.length) % displayImages.length
        );
    const next = () => setViewerIndex((i) => (i + 1) % displayImages.length);

    if (!loading && displayImages.length === 0 && !editable) return null;

    return (
        <Box sx={{ my: 6, position: "relative" }}>
            {loading ? (
                <Grid container spacing={4}>
                    {[0, 1, 2].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Box
                                sx={{
                                    position: "relative",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    aspectRatio: aspect,
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    sx={{ position: "absolute", inset: 0 }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : displayImages.length === 0 ? (
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        (Ingen bilder ennå)
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {displayImages.map((img, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`${img}-${index}`}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                    aspectRatio: aspect,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={img}
                                    alt={`Eksempel ${start + index + 1}`}
                                    onClick={() => openViewer(index)}
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        cursor: "zoom-in",
                                    }}
                                />
                                {editable && (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            opacity: 0.98,
                                        }}
                                    >
                                        <Tooltip title="Fjern bilde">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    onDelete && onDelete(index)
                                                }
                                                sx={{
                                                    bgcolor:
                                                        "rgba(255,255,255,0.9)",
                                                }}
                                            >
                                                <DeleteForeverIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

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
                        disabled={displayImages.length <= 1}
                    >
                        Forrige
                    </Button>
                    <IconButton onClick={closeViewer}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <DialogContent sx={{ p: 2 }}>
                    <Box
                        component="img"
                        src={displayImages[viewerIndex]}
                        alt={`Bilde ${start + viewerIndex + 1}`}
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
                            disabled={displayImages.length <= 1}
                        >
                            Forrige
                        </Button>
                        <Button
                            onClick={next}
                            endIcon={<NavigateNextIcon />}
                            disabled={displayImages.length <= 1}
                        >
                            Neste
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
