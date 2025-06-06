import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useInView } from "react-intersection-observer";

const faqItems = [
    {
        question: "Hvordan kan jeg starte min prøveperiode?",
        answer: 'Det er enkelt å komme i gang med Smartplan. Klikk på "Prøv gratis" knappen", registrer en konto, og du vil få umiddelbar tilgang til en gratis prøveversjon. Ingen kredittkortinformasjon kreves for prøveperioden.',
    },
    {
        question: "Kan jeg oppgradere eller nedgradere pakken min senere?",
        answer: "Ja, du kan enkelt bytte mellom pakker når som helst. Hvis du oppgraderer midt i en fakturaperiode, vil du kun bli belastet for differansen. Ved nedgradering vil endringen tre i kraft ved starten av neste fakturaperiode.",
    },
    {
        question: "Får jeg support inkludert i prisen?",
        answer: (
            <>
                Alle pakker inkluderer support. bruker{" "}
                <a
                    href="https://support.smartplan.no/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                    https://support.smartplan.no/
                </a>
            </>
        ),
    },
    {
        question: "Hvor lagres dataene mine og er de sikre?",
        answer: "Alle data lagres i EU-baserte datasentre som følger GDPR-regler. Vi bruker industristandardkryptering, regelmessige sikkerhetskopier og strenge tilgangskontroller for å sikre dine data. Vi gjennomfører også regelmessige sikkerhetsvurderinger.",
    },
    {
        question: "Kan jeg få en demonstrasjon før jeg bestemmer meg?",
        answer: "Absolutt! Vi tilbyr personlige demonstrasjoner for alle potensielle kunder. Vårt salgsteam vil gjennomgå alle funksjoner og svare på spesifikke spørsmål om hvordan Smartplan kan tilpasses ditt firmas behov. Kontakt oss for å planlegge en demo.",
    },
    {
        question: "Hvilke betalingsmetoder aksepterer dere?",
        answer: "Vi aksepterer alle større kredittkort, bankkonto-overføringer og fakturering for årlige abonnementer. Enterprise-kunder kan også få tilpassede fakturaløsninger ved behov.",
    },
];

function FaqSection() {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ py: 10, backgroundColor: theme.palette.grey[50] }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Vanlige spørsmål
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
                        Her finner du svar på de vanligste spørsmålene om
                        Smartplan og våre tjenester.
                    </Typography>
                </Box>

                <Box
                    ref={ref}
                    sx={{
                        maxWidth: 900,
                        mx: "auto",
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? "translateY(0)"
                            : "translateY(20px)",
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                    }}
                >
                    <Grid container spacing={2}>
                        {faqItems.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <Accordion
                                    expanded={expanded === `panel${index}`}
                                    onChange={handleChange(`panel${index}`)}
                                    sx={{
                                        boxShadow: "none",
                                        border: "1px solid",
                                        borderColor: theme.palette.grey[200],
                                        borderRadius: "8px !important",
                                        mb: 2,
                                        "&:before": {
                                            display: "none",
                                        },
                                        "&.Mui-expanded": {
                                            margin: 0,
                                            mb: 2,
                                        },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                            padding: "16px 24px",
                                            "&.Mui-expanded": {
                                                minHeight: 56,
                                            },
                                        }}
                                    >
                                        <Typography fontWeight={600}>
                                            {item.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{ padding: "0 24px 24px" }}
                                    >
                                        <Typography color="text.secondary">
                                            {item.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}

export default FaqSection;
