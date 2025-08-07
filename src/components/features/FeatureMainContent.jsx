// import { Grid, Box, Typography } from "@mui/material";

// export default function FeatureMainContent({ feature }) {
//     return (
//         <Box sx={{ mb: 6 }}>
//             <Grid container spacing={6} alignItems="center">
//                 {feature.image && (
//                     <Grid item xs={12} md={6}>
//                         <Box sx={{ width: "100%" }}>
//                             <img
//                                 src={feature.image}
//                                 alt={feature.title}
//                                 style={{
//                                     width: "100%",
//                                     borderRadius: 16,
//                                     boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
//                                     display: "block",
//                                 }}
//                             />
//                         </Box>
//                     </Grid>
//                 )}
//                 <Grid item xs={12} md={6}>
//                     <Typography variant="h3" fontWeight={700} gutterBottom>
//                         {feature.title}
//                     </Typography>
//                     {feature.shortDescription && (
//                         <Typography
//                             variant="body1"
//                             color="text.secondary"
//                             sx={{ maxWidth: 600 }}
//                         >
//                             {feature.shortDescription}
//                         </Typography>
//                     )}
//                     {feature.videoUrl && (
//                         <Box
//                             sx={{
//                                 mt: 4,
//                                 aspectRatio: "16 / 9",
//                                 position: "relative",
//                                 width: "100%",
//                             }}
//                         >
//                             <iframe
//                                 src={feature.videoUrl}
//                                 title={feature.title}
//                                 frameBorder="0"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                 allowFullScreen
//                                 style={{
//                                     position: "absolute",
//                                     top: 0,
//                                     left: 0,
//                                     width: "100%",
//                                     height: "100%",
//                                     borderRadius: 16,
//                                 }}
//                             />
//                         </Box>
//                     )}
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }

import { Grid, Box, Typography } from "@mui/material";

export default function FeatureMainContent({ feature }) {
    const mainImage = feature.images?.[0];

    return (
        <Box sx={{ mb: 6 }}>
            <Grid container spacing={6} alignItems="center">
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

                    {feature.videoUrl && (
                        <Box
                            sx={{
                                mt: 4,
                                aspectRatio: "16 / 9",
                                position: "relative",
                                width: "100%",
                            }}
                        >
                            <iframe
                                src={feature.videoUrl}
                                title={feature.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 16,
                                }}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
