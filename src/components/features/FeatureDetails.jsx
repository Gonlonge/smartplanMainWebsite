// import { useParams } from "react-router-dom";
// import { Container, Grid, Box, Typography } from "@mui/material";
// import { features } from "../../data/features";
// import CtaSection from "../home/CtaSection";
// import FeatureGallery from "./FeatureGallery";

// const slugify = (text) =>
//     text
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w-]+/g, "");

// export default function FeatureDetails() {
//     const { slug } = useParams();
//     const feature = features.find((f) => slugify(f.title) === slug);

//     if (!feature) {
//         return (
//             <Container sx={{ py: 10 }}>
//                 <Typography variant="h4" align="center">
//                     Fant ikke funksjonen.
//                 </Typography>
//             </Container>
//         );
//     }

//     return (
//         <Box>
//             <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
//                 <Box sx={{ textAlign: "center", mb: 6 }}>
//                     <Box
//                         sx={{
//                             color: "primary.main",
//                             bgcolor: (theme) =>
//                                 `${theme.palette.primary.main}15`,
//                             borderRadius: "50%",
//                             width: 72,
//                             height: 72,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             mx: "auto",
//                             mb: 2,
//                         }}
//                     >
//                         {feature.icon}
//                     </Box>

//                     <Typography
//                         variant="h2"
//                         component="h1"
//                         sx={{ fontWeight: 700, mb: 2 }}
//                     >
//                         {feature.heading || feature.title}
//                     </Typography>

//                     {feature.intro && (
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
//                             {feature.intro}
//                         </Typography>
//                     )}
//                 </Box>

//                 <Box sx={{ mb: 6 }}>
//                     <Grid container spacing={6} alignItems="center">
//                         {feature.image && (
//                             <Grid item xs={12} md={6}>
//                                 <Box sx={{ width: "100%" }}>
//                                     <img
//                                         src={feature.image}
//                                         alt={feature.title}
//                                         style={{
//                                             width: "100%",
//                                             borderRadius: 16,
//                                             boxShadow:
//                                                 "0 6px 20px rgba(0,0,0,0.06)",
//                                             display: "block",
//                                         }}
//                                     />
//                                 </Box>
//                             </Grid>
//                         )}

//                         <Grid item xs={12} md={6}>
//                             <Box>
//                                 <Typography
//                                     variant="h3"
//                                     fontWeight={700}
//                                     gutterBottom
//                                 >
//                                     {feature.title}
//                                 </Typography>

//                                 {feature.shortDescription && (
//                                     <Typography
//                                         variant="body1"
//                                         color="text.secondary"
//                                         sx={{ maxWidth: 600 }}
//                                     >
//                                         {feature.shortDescription}
//                                     </Typography>
//                                 )}

//                                 {feature.videoUrl && (
//                                     <Box
//                                         sx={{
//                                             mt: 4,
//                                             aspectRatio: "16 / 9",
//                                             position: "relative",
//                                             width: "100%",
//                                         }}
//                                     >
//                                         <iframe
//                                             src={feature.videoUrl}
//                                             title={feature.title}
//                                             frameBorder="0"
//                                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                             allowFullScreen
//                                             style={{
//                                                 position: "absolute",
//                                                 top: 0,
//                                                 left: 0,
//                                                 width: "100%",
//                                                 height: "100%",
//                                                 borderRadius: 16,
//                                             }}
//                                         />
//                                     </Box>
//                                 )}
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </Box>

//                 {feature.images && feature.images.length >= 4 && (
//                     <Box sx={{ textAlign: "center" }}>
//                         <Typography
//                             variant="h2"
//                             sx={{ fontWeight: 700, mb: 2 }}
//                         >
//                             {feature.titleTwo}
//                         </Typography>

//                         {feature.description && (
//                             <Typography
//                                 variant="body1"
//                                 color="text.secondary"
//                                 sx={{ maxWidth: 800, mx: "auto" }}
//                             >
//                                 {feature.description}
//                             </Typography>
//                         )}

//                         <FeatureGallery images={feature.images.slice(1, 4)} />

//                         {feature.longDescription && (
//                             <Box sx={{ mb: 6 }}>
//                                 <Typography
//                                     variant="body1"
//                                     color="text.secondary"
//                                 >
//                                     {feature.longDescription}
//                                 </Typography>
//                             </Box>
//                         )}
//                     </Box>
//                 )}
//             </Container>

//             <Box>
//                 <CtaSection />
//             </Box>
//         </Box>
//     );
// }

import { useParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { features } from "../../data/features";
import CtaSection from "../home/CtaSection";
import FeatureHeader from "./FeatureHeader";
import FeatureMainContent from "./FeatureMainContent";
import FeatureBottom from "./FeatureBottom";

const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

export default function FeatureDetails() {
    const { slug } = useParams();
    const feature = features.find((f) => slugify(f.title) === slug);

    if (!feature) {
        return (
            <Container sx={{ py: 10 }}>
                <h2 style={{ textAlign: "center" }}>Fant ikke funksjonen.</h2>
            </Container>
        );
    }

    return (
        <Box>
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <FeatureHeader
                    icon={feature.icon} // 👈 Videresender komponenten
                    heading={feature.heading || feature.title}
                    intro={feature.intro}
                />
                <FeatureMainContent feature={feature} />
                {feature.images?.length >= 4 && (
                    <FeatureBottom feature={feature} />
                )}
            </Container>
            <Box>
                <CtaSection />
            </Box>
        </Box>
    );
}
