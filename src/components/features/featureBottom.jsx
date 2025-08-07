import { Box, Typography } from "@mui/material";
import FeatureGallery from "./FeatureGallery";

export default function FeatureBottom({ feature }) {
    return (
        <Box sx={{ textAlign: "center" }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                {feature.titleTwo}
            </Typography>

            {feature.description && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 800, mx: "auto" }}
                >
                    {feature.description}
                </Typography>
            )}

            <FeatureGallery images={feature.images.slice(1, 4)} />

            {feature.longDescription && (
                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                        {feature.longDescription}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
