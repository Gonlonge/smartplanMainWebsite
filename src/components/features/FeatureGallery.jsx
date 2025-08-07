import { Grid, Box } from "@mui/material";

export default function FeatureGallery({ images }) {
    if (!images || images.length === 0) return null;

    return (
        <Box sx={{ my: 6 }}>
            <Grid container spacing={4}>
                {images.map((img, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                            component="img"
                            src={img}
                            alt={`Eksempel ${index + 1}`}
                            sx={{
                                width: "100%",
                                borderRadius: 2,
                                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                display: "block",
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
