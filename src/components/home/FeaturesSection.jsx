import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    useTheme,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import ConstructionIcon from "@mui/icons-material/Construction";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import GroupsIcon from "@mui/icons-material/Groups";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

const features = [
    {
        icon: <ConstructionIcon fontSize="large" />,
        title: "Prosjektplanlegging",
        description:
            "Planlegg alle faser av prosjektet med et intuitivt grensesnitt og drag-and-drop funksjonalitet.",
    },
    {
        icon: <TrendingUpIcon fontSize="large" />,
        title: "Ressursstyring",
        description:
            "Administrer personale, utstyr og materialer for optimal utnyttelse og reduserte kostnader.",
    },
    {
        icon: <PeopleIcon fontSize="large" />,
        title: "Samarbeid i sanntid",
        description:
            "Forbedre kommunikasjonen mellom alle involverte parter med sanntids oppdateringer og meldinger.",
    },
    {
        icon: <ScheduleIcon fontSize="large" />,
        title: "Tidsplanlegging",
        description:
            "Hold prosjektet på riktig spor med avanserte tidsplanleggingsverktøy og automatiske påminnelser.",
    },
    {
        icon: <AnalyticsIcon fontSize="large" />,
        title: "Rapportering og analyse",
        description:
            "Få innsikt med detaljerte rapporter og dashboards som viser fremgang og identifiserer flaskehalser.",
    },
    {
        icon: <SecurityIcon fontSize="large" />,
        title: "HMS-dokumentasjon",
        description:
            "Sikre at alle HMS-krav blir møtt med innebygde sjekklister og dokumentasjonssystemer.",
    },
    {
        icon: <WarningIcon fontSize="large" />,
        title: "RUH og SJA",
        description:
            "Rapporter uønskede hendelser (RUH) og gjennomfør Sikker Jobb Analyse (SJA) på en strukturert og effektiv måte.",
    },
    {
        icon: <GroupsIcon fontSize="large" />,
        title: "Møter og referater",
        description:
            "Planlegg møter, lag agendaer og dokumenter referater – alt på ett sted.",
    },
    {
        icon: <RequestQuoteIcon fontSize="large" />,
        title: "Økonomi og fakturering",
        description:
            "Få oversikt over budsjett, utgifter og fakturaer for bedre økonomikontroll i prosjektet.",
    },
];

function FeaturesSection() {
    const theme = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Funksjoner som forenkler prosjektstyring
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
                        Smartplan er designet for å håndtere komplekse
                        byggprosjekter med enkle, intuitive verktøy som sparer
                        tid og reduserer feil.
                    </Typography>
                </Box>

                <Grid container spacing={4} ref={ref}>
                    {features.map((feature, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                            className={inView ? "scale-in" : ""}
                            sx={{ animationDelay: `${0.1 + index * 0.1}s` }}
                        >
                            <Card
                                className="animated-element"
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    border: "1px solid",
                                    borderColor: theme.palette.grey[100],
                                    transform: "scale(1)", // ensure default state
                                    transition:
                                        "transform 0.3s ease 0.1s, box-shadow 0.3s ease 0.1s",
                                    "&:hover": {
                                        transform:
                                            "translateY(-5px) scale(1.02)",
                                        boxShadow:
                                            "0 8px 20px rgba(0, 0, 0, 0.1)",
                                    },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                    <Box
                                        sx={{
                                            mb: 2,
                                            color: theme.palette.primary.main,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            backgroundColor: `${theme.palette.primary.main}15`,
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{ mb: 1, fontWeight: 600 }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default FeaturesSection;
