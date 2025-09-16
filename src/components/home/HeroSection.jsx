// import {
//     Box,
//     Container,
//     Typography,
//     Button,
//     Grid,
//     useTheme,
// } from "@mui/material";
// import { useInView } from "react-intersection-observer";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

// function HeroSection() {
//     const theme = useTheme();
//     const { ref: heroRef, inView: heroInView } = useInView({
//         triggerOnce: true,
//         threshold: 0.1,
//     });

//     return (
//         <Box
//             ref={heroRef}
//             sx={{
//                 position: "relative",
//                 minHeight: "100vh",
//                 display: "flex",
//                 alignItems: "center",
//                 background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
//                 overflow: "hidden",
//                 pb: { xs: 6, sm: 10, md: 6 }, // 👈 added bottom padding
//                 "&::before": {
//                     content: '""',
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundImage:
//                         "url(https://solabygg.no/wp-content/uploads/2024/07/35e4b3_63ce8c6487eb4a6c9d5fe2ea658de8b9mv2.webp)",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     opacity: 0.15,
//                 },
//                 "&::after": {
//                     content: '""',
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "30%",
//                     background:
//                         "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
//                 },
//             }}
//         >
//             <Container
//                 maxWidth="lg"
//                 sx={{
//                     position: "relative",
//                     zIndex: 2,
//                     pt: { xs: 10, sm: 12 },
//                 }}
//             >
//                 <Grid container spacing={6} alignItems="center">
//                     {/* Left content */}
//                     <Grid
//                         item
//                         xs={12}
//                         md={6}
//                         className={heroInView ? "fade-in" : ""}
//                         sx={{
//                             color: "white",
//                             textAlign: { xs: "center", md: "left" },
//                             animationDelay: "0.2s",
//                         }}
//                     >
//                         <Typography
//                             variant="overline"
//                             sx={{
//                                 color: theme.palette.secondary.light,
//                                 letterSpacing: 2,
//                                 fontWeight: 600,
//                                 mb: 2,
//                                 display: "block",
//                             }}
//                         >
//                             FREMTIDEN INNEN PROSJEKTSTYRING
//                         </Typography>

//                         <Typography
//                             variant="h1"
//                             component="h1"
//                             sx={{
//                                 fontWeight: 700,
//                                 mb: 3,
//                                 fontSize: {
//                                     xs: "2.5rem",
//                                     sm: "3.5rem",
//                                     md: "4rem",
//                                 },
//                                 lineHeight: 1.1,
//                                 letterSpacing: "-0.02em",
//                             }}
//                         >
//                             Smartere prosjektstyring for byggebransjen
//                         </Typography>

//                         <Typography
//                             variant="h5"
//                             sx={{
//                                 mb: 5,
//                                 fontWeight: 400,
//                                 opacity: 0.9,
//                                 maxWidth: 600,
//                                 fontSize: { xs: "1.1rem", sm: "1.25rem" },
//                                 mx: { xs: "auto", md: 0 },
//                             }}
//                         >
//                             Et digitalt verktøy for alle faser i bygg- og
//                             anleggsprosjekter. Opplev en enklere og mer effektiv
//                             arbeidshverdag med Smartplan.
//                         </Typography>

//                         {/* Buttons */}
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 gap: 3,
//                                 flexWrap: "wrap",
//                                 justifyContent: {
//                                     xs: "center",
//                                     md: "flex-start",
//                                 },
//                             }}
//                         >
//                             <Button
//                                 variant="contained"
//                                 size="large"
//                                 href="https://app.smartplan.no/"
//                                 endIcon={<ArrowForwardIcon />}
//                                 sx={{
//                                     px: 4,
//                                     py: 2,
//                                     fontSize: "1.1rem",
//                                     fontWeight: 600,
//                                     borderRadius: "50px",
//                                     background:
//                                         "linear-gradient(45deg, #9575cd 30%, #7e57c2 90%)",
//                                     boxShadow:
//                                         "0 8px 20px rgba(149,117,205,0.3)",
//                                     "&:hover": {
//                                         background:
//                                             "linear-gradient(45deg, #7e57c2 30%, #5e35b1 90%)",
//                                         transform: "translateY(-2px)",
//                                         boxShadow:
//                                             "0 12px 24px rgba(149,117,205,0.4)",
//                                     },
//                                     transition: "all 0.3s ease",
//                                 }}
//                             >
//                                 Prøv gratis
//                             </Button>
//                             <Button
//                                 variant="outlined"
//                                 size="large"
//                                 startIcon={<PlayCircleOutlineIcon />}
//                                 href="https://support.smartplan.no/assets/opprett_nytt_prosjekt_cover-BG3-WaQH.jpg"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 sx={{
//                                     px: 4,
//                                     py: 2,
//                                     fontSize: "1.1rem",
//                                     color: "white",
//                                     borderColor: "rgba(255,255,255,0.5)",
//                                     borderWidth: 2,
//                                     borderRadius: "50px",
//                                     backdropFilter: "blur(10px)",
//                                     backgroundColor: "rgba(255,255,255,0.1)",
//                                     "&:hover": {
//                                         borderColor: "white",
//                                         backgroundColor:
//                                             "rgba(255,255,255,0.2)",
//                                         transform: "translateY(-2px)",
//                                     },
//                                     transition: "all 0.3s ease",
//                                 }}
//                             >
//                                 Se produktvideo
//                             </Button>
//                         </Box>

//                         {/* Stats */}
//                         <Box
//                             sx={{
//                                 mt: 6,
//                                 pt: 6,
//                                 borderTop: "1px solid rgba(255,255,255,0.2)",
//                                 display: "flex",
//                                 gap: 4,
//                                 flexWrap: "wrap",
//                                 justifyContent: {
//                                     xs: "center",
//                                     md: "flex-start",
//                                 },
//                             }}
//                         >
//                             {[
//                                 { number: "100+", text: "Aktive kunder" },
//                                 { number: "37%", text: "Økt effektivitet" },
//                                 { number: "98%", text: "Kundetilfredshet" },
//                             ].map((stat, index) => (
//                                 <Box key={index} sx={{ textAlign: "center" }}>
//                                     <Typography
//                                         variant="h3"
//                                         sx={{
//                                             fontWeight: 700,
//                                             color: theme.palette.secondary
//                                                 .light,
//                                         }}
//                                     >
//                                         {stat.number}
//                                     </Typography>
//                                     <Typography
//                                         variant="body1"
//                                         sx={{
//                                             opacity: 0.8,
//                                             fontWeight: 500,
//                                         }}
//                                     >
//                                         {stat.text}
//                                     </Typography>
//                                 </Box>
//                             ))}
//                         </Box>
//                     </Grid>

//                     {/* Right images */}
//                     <Grid
//                         item
//                         xs={12}
//                         md={6}
//                         className={heroInView ? "slide-in-right" : ""}
//                         sx={{
//                             display: { xs: "none", md: "block" },
//                             position: "relative",
//                             animationDelay: "0.4s",
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 position: "relative",
//                                 height: "600px",
//                                 "&::before": {
//                                     content: '""',
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     width: "140%",
//                                     height: "140%",
//                                     background:
//                                         "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
//                                     animation: "pulse 3s infinite",
//                                 },
//                             }}
//                         >
//                             <Box
//                                 component="img"
//                                 src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
//                                 alt="Construction site planning"
//                                 sx={{
//                                     position: "absolute",
//                                     top: "25%",
//                                     left: "45%",
//                                     width: "60%",
//                                     height: "auto",
//                                     borderRadius: "16px",
//                                     boxShadow: "15px 15px 30px rgba(0,0,0,0.3)",
//                                     transition: "all 0.5s ease",
//                                     zIndex: 2,
//                                     transform:
//                                         "perspective(1000px) rotateY(-15deg)",
//                                     "&:hover": {
//                                         transform:
//                                             "perspective(1000px) rotateY(0deg) translateY(-10px)",
//                                         boxShadow:
//                                             "20px 20px 40px rgba(0,0,0,0.4)",
//                                     },
//                                 }}
//                             />
//                             <Box
//                                 component="img"
//                                 src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
//                                 alt="Team working on construction project"
//                                 sx={{
//                                     position: "absolute",
//                                     bottom: "15%",
//                                     right: "5%",
//                                     width: "85%",
//                                     height: "auto",
//                                     borderRadius: "24px",
//                                     boxShadow: "25px 25px 50px rgba(0,0,0,0.5)",
//                                     transition: "all 0.5s ease",
//                                     zIndex: 1,
//                                     transform:
//                                         "perspective(1000px) rotateY(-15deg)",
//                                     "&:hover": {
//                                         transform:
//                                             "perspective(1000px) rotateY(0deg) translateY(-10px)",
//                                         boxShadow:
//                                             "30px 30px 60px rgba(0,0,0,0.6)",
//                                     },
//                                 }}
//                             />
//                         </Box>
//                     </Grid>
//                 </Grid>
//             </Container>
//         </Box>
//     );
// }

// export default HeroSection;

import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    useTheme,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

function HeroSection() {
    const theme = useTheme();
    const { ref: heroRef, inView: heroInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <Box
            ref={heroRef}
            sx={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                overflow: "hidden",
                pb: { xs: 6, sm: 10, md: 6 }, // 👈 added bottom padding
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                        "url(https://solabygg.no/wp-content/uploads/2024/07/35e4b3_63ce8c6487eb4a6c9d5fe2ea658de8b9mv2.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.15,
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "30%",
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                },
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    pt: { xs: 10, sm: 12 },
                }}
            >
                <Grid container spacing={6} alignItems="center">
                    {/* Left content */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className={heroInView ? "fade-in" : ""}
                        sx={{
                            color: "white",
                            textAlign: { xs: "center", md: "left" },
                            animationDelay: "0.2s",
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: theme.palette.secondary.light,
                                letterSpacing: 2,
                                fontWeight: 600,
                                mb: 2,
                                display: "block",
                            }}
                        >
                            FREMTIDEN INNEN PROSJEKTSTYRING
                        </Typography>

                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                fontSize: {
                                    xs: "2.5rem",
                                    sm: "3.5rem",
                                    md: "4rem",
                                },
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Smartere prosjektstyring for byggebransjen
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                mb: 5,
                                fontWeight: 400,
                                opacity: 0.9,
                                maxWidth: 600,
                                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                                mx: { xs: "auto", md: 0 },
                            }}
                        >
                            Et digitalt verktøy for alle faser i bygg- og
                            anleggsprosjekter. Opplev en enklere og mer effektiv
                            arbeidshverdag med Smartplan.
                        </Typography>

                        {/* Buttons */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap",
                                justifyContent: {
                                    xs: "center",
                                    md: "flex-start",
                                },
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                href="https://app.smartplan.no/"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    borderRadius: "50px",
                                    background:
                                        "linear-gradient(45deg, #9575cd 30%, #7e57c2 90%)",
                                    boxShadow:
                                        "0 8px 20px rgba(149,117,205,0.3)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(45deg, #7e57c2 30%, #5e35b1 90%)",
                                        transform: "translateY(-2px)",
                                        boxShadow:
                                            "0 12px 24px rgba(149,117,205,0.4)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Prøv gratis
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<PlayCircleOutlineIcon />}
                                href="https://support.smartplan.no/assets/opprett_nytt_prosjekt_cover-BG3-WaQH.jpg"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontSize: "1.1rem",
                                    color: "white",
                                    borderColor: "rgba(255,255,255,0.5)",
                                    borderWidth: 2,
                                    borderRadius: "50px",
                                    backdropFilter: "blur(10px)",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor:
                                            "rgba(255,255,255,0.2)",
                                        transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Se produktvideo
                            </Button>
                        </Box>

                        {/* Stats */}
                        <Box
                            sx={{
                                mt: 6,
                                pt: 6,
                                borderTop: "1px solid rgba(255,255,255,0.2)",
                                display: "flex",
                                gap: 4,
                                flexWrap: "wrap",
                                justifyContent: {
                                    xs: "center",
                                    md: "flex-start",
                                },
                            }}
                        >
                            {[
                                { number: "100+", text: "Aktive kunder" },
                                { number: "37%", text: "Økt effektivitet" },
                                { number: "98%", text: "Kundetilfredshet" },
                            ].map((stat, index) => (
                                <Box key={index} sx={{ textAlign: "center" }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.palette.secondary
                                                .light,
                                        }}
                                    >
                                        {stat.number}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            opacity: 0.8,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {stat.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    {/* Right images */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        className={heroInView ? "slide-in-right" : ""}
                        sx={{
                            display: { xs: "none", md: "block" },
                            position: "relative",
                            animationDelay: "0.4s",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                height: "600px",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "140%",
                                    height: "140%",
                                    background:
                                        "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                                    animation: "pulse 3s infinite",
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="/public/images/groupOfPeopleHavingAMeeting.PNG" // 👈 local image
                                alt="Construction site planning"
                                sx={{
                                    position: "absolute",
                                    top: "25%",
                                    left: "45%",
                                    width: "60%",
                                    height: "auto",
                                    borderRadius: "16px",
                                    boxShadow: "15px 15px 30px rgba(0,0,0,0.3)",
                                    transition: "all 0.5s ease",
                                    zIndex: 2,
                                    transform:
                                        "perspective(1000px) rotateY(-15deg)",
                                    "&:hover": {
                                        transform:
                                            "perspective(1000px) rotateY(0deg) translateY(-10px)",
                                        boxShadow:
                                            "20px 20px 40px rgba(0,0,0,0.4)",
                                    },
                                }}
                            />
                            <Box
                                component="img"
                                src="/public/images/womanCheckingHMS.PNG" // 👈 local image
                                alt="Team working on construction project"
                                sx={{
                                    position: "absolute",
                                    bottom: "15%",
                                    right: "5%",
                                    width: "85%",
                                    height: "auto",
                                    borderRadius: "24px",
                                    boxShadow: "25px 25px 50px rgba(0,0,0,0.5)",
                                    transition: "all 0.5s ease",
                                    zIndex: 1,
                                    transform:
                                        "perspective(1000px) rotateY(-15deg)",
                                    "&:hover": {
                                        transform:
                                            "perspective(1000px) rotateY(0deg) translateY(-10px)",
                                        boxShadow:
                                            "30px 30px 60px rgba(0,0,0,0.6)",
                                    },
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default HeroSection;
