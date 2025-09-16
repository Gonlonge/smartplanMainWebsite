// // import {
// //     Box,
// //     Container,
// //     Typography,
// //     Button,
// //     Grid,
// //     useTheme,
// // } from "@mui/material";
// // import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// // import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// // import { useInView } from "react-intersection-observer";
// // import { useNavigate } from "react-router-dom";

// // const benefits = [
// //     "Spar 37% tid på prosjektplanlegging",
// //     "Reduser budsjettoverskridelser",
// //     "Forbedre teamsamarbeid og kommunikasjon",
// //     "Få tilgang til sanntidsdata og rapporter",
// // ];

// // function CtaSection() {
// //     const theme = useTheme();
// //     const navigate = useNavigate();
// //     const { ref, inView } = useInView({
// //         triggerOnce: true,
// //         threshold: 0.1,
// //     });

// //     return (
// //         <Box
// //             ref={ref}
// //             sx={{
// //                 py: 10,
// //                 background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
// //                 color: "white",
// //             }}
// //         >
// //             <Container maxWidth="md">
// //                 <Grid container spacing={4} alignItems="center">
// //                     <Grid
// //                         item
// //                         xs={12}
// //                         md={7}
// //                         className={inView ? "fade-in" : ""}
// //                     >
// //                         <Typography
// //                             variant="h2"
// //                             component="h2"
// //                             sx={{
// //                                 fontWeight: 700,
// //                                 mb: 3,
// //                                 fontSize: { xs: "2rem", md: "2.5rem" },
// //                             }}
// //                         >
// //                             Klar til å optimalisere dine byggeprosjekter?
// //                         </Typography>

// //                         <Typography
// //                             variant="h6"
// //                             sx={{
// //                                 mb: 4,
// //                                 fontWeight: 400,
// //                                 opacity: 0.9,
// //                             }}
// //                         >
// //                             Kom i gang med Smartplan i dag og oppdag hvordan du
// //                             kan transformere prosjektstyringen i din bedrift.
// //                         </Typography>

// //                         <Grid container spacing={2} sx={{ mb: 4 }}>
// //                             {benefits.map((benefit, index) => (
// //                                 <Grid
// //                                     item
// //                                     xs={12}
// //                                     sm={6}
// //                                     key={index}
// //                                     sx={{
// //                                         display: "flex",
// //                                         alignItems: "center",
// //                                     }}
// //                                 >
// //                                     <CheckCircleOutlineIcon
// //                                         sx={{
// //                                             mr: 1,
// //                                             color: theme.palette.secondary
// //                                                 .light,
// //                                         }}
// //                                     />
// //                                     <Typography variant="body1">
// //                                         {benefit}
// //                                     </Typography>
// //                                 </Grid>
// //                             ))}
// //                         </Grid>

// //                         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
// //                             <Button
// //                                 variant="contained"
// //                                 color="primary"
// //                                 size="large"
// //                                 endIcon={<ArrowForwardIcon />}
// //                                 onClick={() => navigate("/pricing")}
// //                                 sx={{
// //                                     px: 4,
// //                                     py: 1.5,
// //                                     fontWeight: 600,
// //                                     fontSize: "1rem",
// //                                     borderRadius: "50px",
// //                                     bgcolor: "white",
// //                                     color: theme.palette.secondary.main,
// //                                     boxShadow:
// //                                         "0 8px 20px rgba(255, 255, 255, 0.2)",
// //                                     "&:hover": {
// //                                         bgcolor: "rgba(255, 255, 255, 0.9)",
// //                                     },
// //                                 }}
// //                             >
// //                                 Se våre priser
// //                             </Button>
// //                             <Button
// //                                 variant="outlined"
// //                                 size="large"
// //                                 onClick={() => navigate("/contact")}
// //                                 sx={{
// //                                     px: 4,
// //                                     py: 1.5,
// //                                     color: "white",
// //                                     borderColor: "white",
// //                                     borderRadius: "50px",
// //                                     "&:hover": {
// //                                         borderColor: "white",
// //                                         backgroundColor:
// //                                             "rgba(255, 255, 255, 0.1)",
// //                                     },
// //                                 }}
// //                             >
// //                                 Kontakt oss
// //                             </Button>
// //                         </Box>
// //                     </Grid>
// //                     <Grid
// //                         item
// //                         xs={12}
// //                         md={5}
// //                         className={inView ? "slide-in-right" : ""}
// //                         sx={{
// //                             display: { xs: "none", md: "block" },
// //                             animationDelay: "0.3s",
// //                         }}
// //                     >
// //                         <Box
// //                             sx={{
// //                                 position: "relative",
// //                                 height: "400px",
// //                                 background:
// //                                     "url('https://images.pexels.com/photos/8961008/pexels-photo-8961008.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
// //                                 backgroundSize: "cover",
// //                                 backgroundPosition: "center",
// //                                 borderRadius: "16px",
// //                                 boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
// //                                 overflow: "hidden",
// //                                 "&::after": {
// //                                     content: '""',
// //                                     position: "absolute",
// //                                     top: 0,
// //                                     left: 0,
// //                                     width: "100%",
// //                                     height: "100%",
// //                                     backgroundColor: "rgba(0, 0, 0, 0.2)",
// //                                     backdropFilter: "blur(1px)",
// //                                 },
// //                             }}
// //                         />
// //                     </Grid>
// //                 </Grid>
// //             </Container>
// //         </Box>
// //     );
// // }

// // export default CtaSection;
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const benefits = [
    "Spar 37% tid på prosjektplanlegging",
    "Reduser budsjettoverskridelser",
    "Forbedre teamsamarbeid og kommunikasjon",
    "Få tilgang til sanntidsdata og rapporter",
];

function CtaSection() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <Box
            ref={ref}
            sx={{
                py: 10,
                background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={4} alignItems="center">
                    {/* Left Section */}
                    <Grid
                        item
                        xs={12}
                        md={7}
                        className={inView ? "fade-in" : ""}
                    >
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                fontSize: { xs: "2rem", md: "2.5rem" },
                            }}
                        >
                            Klar til å optimalisere dine byggeprosjekter?
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 4,
                                fontWeight: 400,
                                opacity: 0.9,
                            }}
                        >
                            Kom i gang med Smartplan i dag og oppdag hvordan du
                            kan transformere prosjektstyringen i din bedrift.
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {benefits.map((benefit, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <CheckCircleOutlineIcon
                                        sx={{
                                            mr: 1,
                                            color: theme.palette.secondary
                                                .light,
                                        }}
                                    />
                                    <Typography variant="body1">
                                        {benefit}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate("/pricing")}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    borderRadius: "50px",
                                    bgcolor: "white",
                                    color: theme.palette.secondary.main,
                                    boxShadow:
                                        "0 8px 20px rgba(255, 255, 255, 0.2)",
                                    "&:hover": {
                                        bgcolor: "rgba(255, 255, 255, 0.9)",
                                    },
                                }}
                            >
                                Se våre priser
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate("/contact")}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    color: "white",
                                    borderColor: "white",
                                    borderRadius: "50px",
                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                Kontakt oss
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Section with image */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        className={inView ? "slide-in-right" : ""}
                        sx={{
                            display: { xs: "none", md: "block" },
                            animationDelay: "0.3s",
                        }}
                    >
                        <Box
                            component="img"
                            src="/src/images/maleCheckingSmartplan.PNG" // 👈 public folder
                            alt="Prosjektmøte"
                            sx={{
                                display: "block",
                                width: "100%",
                                height: 400,
                                objectFit: "cover",
                                borderRadius: "16px",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default CtaSection;
