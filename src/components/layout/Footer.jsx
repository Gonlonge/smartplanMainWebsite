import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Stack,
    IconButton,
    useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
    const theme = useTheme();
    const year = new Date().getFullYear();

    return (
        <Box
            sx={{
                bgcolor: theme.palette.grey[900],
                color: "white",
                pt: 8,
                pb: 6,
                mt: "auto",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                    letterSpacing: ".2rem",
                                    color: "#ffffff",
                                    textDecoration: "none",
                                }}
                            >
                                Smartplan
                            </Typography>
                            <Box
                                sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    backgroundColor: "#8051C9",
                                    display: "inline-block",
                                    mt: 1.1,
                                    ml: 0.2,
                                }}
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ mb: 2, opacity: 0.8, maxWidth: 300 }}
                        >
                            Et digitalt verktøy for alle faser i bygg- og
                            anleggsprosjekter. Opplev en enklere, smartere og
                            mer effektiv prosjektstyring.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                size="small"
                                sx={{ color: "white" }}
                                component="a"
                                href="https://www.facebook.com/smartplan.no"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FacebookIcon />
                            </IconButton>
                            {/*                             <IconButton size="small" sx={{ color: "white" }}>
                                <TwitterIcon />
                            </IconButton> */}
                            <IconButton
                                size="small"
                                sx={{ color: "white" }}
                                component="a"
                                href="https://www.linkedin.com/company/smartplan-as/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedInIcon />
                            </IconButton>
                            {/*                       <IconButton size="small" sx={{ color: "white" }}>
                                <InstagramIcon />
                            </IconButton> */}
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Produkt
                        </Typography>
                        <Stack spacing={1}>
                            <Link
                                href="/pricing"
                                underline="hover"
                                color="inherit"
                                sx={{ opacity: 0.8 }}
                            >
                                Priser
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Om oss
                        </Typography>
                        <Stack spacing={1}>
                            <Link
                                href="/contact"
                                underline="hover"
                                color="inherit"
                                sx={{ opacity: 0.8 }}
                            >
                                Kontakt
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Ressurser
                        </Typography>
                        <Stack spacing={1}>
                            <Link
                                href="https://support.smartplan.no/"
                                underline="hover"
                                color="inherit"
                                sx={{ opacity: 0.8 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Support
                            </Link>
                            <Link
                                href="/loginPage"
                                underline="hover"
                                color="inherit"
                                sx={{ opacity: 0.8 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Admin
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: 6,
                        pt: 3,
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        © {year} Smartplan. Alle rettigheter reservert.
                    </Typography>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                        <Link
                            href="mailto:post@smartplan.no"
                            underline="hover"
                            color="inherit"
                            sx={{ opacity: 0.7 }}
                        >
                            post@smartplan.no
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
