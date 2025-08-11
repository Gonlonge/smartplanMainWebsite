import { Grid, Box, Typography } from "@mui/material";

export default function FeatureMainContent({ feature }) {
    const mainImage = feature.images?.[0];

    return (
        <Box sx={{ mb: 6 }}>
            <Grid container spacing={6} alignItems="flex-start">
                {mainImage && (
                    <Grid item xs={12} md={6}>
                        <Box sx={{ width: "100%" }}>
                            <img
                                src={mainImage}
                                alt={feature.title}
                                style={{
                                    width: "100%",
                                    borderRadius: 16,
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                    display: "block",
                                }}
                            />
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            {feature.title}
                        </Typography>

                        {feature.shortDescription && (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ maxWidth: 600 }}
                            >
                                {feature.shortDescription}
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
FeatureMainContent.jsx;
