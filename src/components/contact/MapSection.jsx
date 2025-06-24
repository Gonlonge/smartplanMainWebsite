import { Box, Container, Paper, Typography, useTheme } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useInView } from "react-intersection-observer";

function MapSection() {
    const theme = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <Box sx={{ py: 8, bgcolor: theme.palette.grey[50] }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: 700,
                        mb: 4,
                        textAlign: "center",
                    }}
                >
                    Finn oss
                </Typography>

                <Box
                    ref={ref}
                    className={inView ? "scale-in" : ""}
                    sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        height: 400,
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                    }}
                >
                    <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2049.7812608093323!2d5.717601215928011!3d58.87052768159473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463a35c6ae1f2f13%3A0xf6c8c93f8f75a3e6!2sSvanholmen%207%2C%204313%20Sandnes!5e0!3m2!1sen!2sno!4v1717433000000!5m2!1sen!2sno"
                        width="100%"
                        height="100%"
                        style={{ border: 6 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    {/* 
                    <Paper
                        elevation={3}
                        sx={{
                            position: "absolute",
                            bottom: 24,
                            left: 24,
                            p: 3,
                            borderRadius: 2,
                            maxWidth: 300,
                            backdropFilter: "blur(10px)",
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 1,
                            }}
                        >
                            <LocationOnIcon
                                sx={{
                                    color: theme.palette.primary.main,
                                    mr: 1,
                                    mt: 0.5,
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{ mb: 0.5 }}
                                >
                                    Smartplan AS
                                </Typography>
                                <Typography variant="body2">
                                    Svanholmen 7,
                                    <br />
                                    4313 Sandnes
                                    <br />
                                    Norge
                                </Typography>
                            </Box>
                        </Box>
                    </Paper> */}
                </Box>
            </Container>
        </Box>
    );
}

export default MapSection;
