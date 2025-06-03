import {
    Box,
    Container,
    Typography,
    Paper,
    Avatar,
    useTheme,
    Grid,
} from "@mui/material";
import { useInView } from "react-intersection-observer";

const customers = [
    {
        id: 1,
        company: "Sandnes kommune",
        logo: "https://cdn-icons-png.flaticon.com/512/3105/3105807.png",
        contact: "Erik Hansen, Prosjektleder",
        usage: "Bruker Smartplan til planlegging og ressursstyring i større boligprosjekter i Sandnes-regionen.",
    },
    {
        id: 2,
        company: "Consult1 AS",
        logo: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
        contact: "Marte Olsen, Daglig leder",
        usage: "Benytter systemet daglig for HMS-sjekklister og oppfølging av RUH-rapporter på byggeplass.",
    },
    {
        id: 3,
        company: "Sola kommune",
        logo: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
        contact: "Thomas Berg, Anleggsleder",
        usage: "Bruker Smartplan for å koordinere møter, holde styr på SJA-er og for dokumentasjon i felt.",
    },
];

function TestimonialSection() {
    const theme = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <Box
            sx={{
                py: 10,
                backgroundColor: theme.palette.grey[50],
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage:
                        "radial-gradient(circle at 20% 30%, rgba(25, 118, 210, 0.05) 0%, transparent 300px), radial-gradient(circle at 80% 70%, rgba(0, 160, 176, 0.05) 0%, transparent 400px)",
                },
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Våre største kunder
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            color: theme.palette.text.secondary,
                            fontWeight: 400,
                        }}
                    >
                        Flere ledende entreprenører bruker Smartplan hver dag –
                        her er hva de bruker det til.
                    </Typography>
                </Box>

                <Grid container spacing={4} ref={ref}>
                    {customers.map((customer, index) => (
                        <Grid
                            item
                            xs={12}
                            md={4}
                            key={customer.id}
                            className={inView ? "fade-in" : ""}
                            sx={{ animationDelay: `${0.2 + index * 0.2}s` }}
                        >
                            <Paper
                                elevation={0}
                                className="animated-element"
                                sx={{
                                    p: 4,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 4,
                                    border: "1px solid",
                                    borderColor: theme.palette.grey[100],
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 3,
                                    }}
                                >
                                    <Avatar
                                        src={customer.logo}
                                        alt={customer.company}
                                        variant="rounded"
                                        sx={{ width: 56, height: 56, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                        >
                                            {customer.company}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {customer.contact}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        flex: 1,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {customer.usage}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default TestimonialSection;
