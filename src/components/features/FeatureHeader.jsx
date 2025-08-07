import { Box, Typography } from "@mui/material";

export default function FeatureHeader({ icon: Icon, heading, intro }) {
    return (
        <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box
                sx={{
                    color: "primary.main",
                    bgcolor: (theme) => `${theme.palette.primary.main}15`,
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
                {Icon && <Icon fontSize="large" />}
            </Box>

            <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: 700, mb: 2 }}
            >
                {heading}
            </Typography>

            {intro && (
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
                    {intro}
                </Typography>
            )}
        </Box>
    );
}
