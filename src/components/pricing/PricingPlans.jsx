import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Switch,
    FormControlLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    Divider,
    Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        title: "Gratis",
        monthlyPrice: 0,
        yearlyPrice: 0,
        description:
            "For enkeltpersoner og små prosjekter med behov for grunnleggende funksjonalitet",
        features: [
            { text: "1 bruker", included: true },
            { text: "Prosjektplanlegging", included: true },
            { text: "Mobil app", included: true },
            { text: "Grunnleggende rapporter", included: false },
            { text: "Ressursstyring", included: false },
            { text: "Avansert HMS-dokumentasjon", included: false },
            { text: "API-integrasjoner", included: false },
            { text: "Egendefinerte moduler", included: false },
        ],
        isPopular: false,
        buttonText: "Kom i gang gratis",
    },
    {
        title: "Basis",
        monthlyPrice: 899,
        yearlyPrice: 8388,
        description:
            "Passer for små bedrifter som trenger grunnleggende kontroll",
        features: [
            { text: "Opptil 3 brukere", included: true },
            { text: "Prosjektplanlegging", included: true },
            { text: "Mobil app", included: true },
            { text: "Grunnleggende rapporter", included: true },
            { text: "Ressursstyring", included: false },
            { text: "Avansert HMS-dokumentasjon", included: false },
            { text: "API-integrasjoner", included: false },
            { text: "Egendefinerte moduler", included: false },
        ],
        isPopular: false,
        buttonText: "Velg Basis",
    },
    {
        title: "Pluss",
        monthlyPrice: 1599,
        yearlyPrice: 16788,
        description: "For team som ønsker bedre oversikt og mer funksjonalitet",
        features: [
            { text: "Opptil 10 brukere", included: true },
            { text: "Prosjektplanlegging", included: true },
            { text: "Mobil app", included: true },
            { text: "Grunnleggende rapporter", included: true },
            { text: "Ressursstyring", included: true },
            { text: "Avansert HMS-dokumentasjon", included: false },
            { text: "API-integrasjoner", included: false },
            { text: "Egendefinerte moduler", included: false },
        ],
        isPopular: true,
        buttonText: "Velg Pluss",
    },
    {
        title: "Komplett",
        monthlyPrice: 2199,
        yearlyPrice: 23988,
        description: "Full funksjonalitet for bedrifter med høy kompleksitet",
        features: [
            { text: "Opptil 25 brukere", included: true },
            { text: "Prosjektplanlegging", included: true },
            { text: "Mobil app", included: true },
            { text: "Grunnleggende rapporter", included: true },
            { text: "Ressursstyring", included: true },
            { text: "Avansert HMS-dokumentasjon", included: true },
            { text: "API-integrasjoner", included: true },
            { text: "Egendefinerte moduler", included: true },
        ],
        isPopular: false,
        buttonText: "Velg Komplett",
    },
];

function PricingPlans() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [yearly, setYearly] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    const handleBillingChange = () => {
        setYearly(!yearly);
    };

    const calculateSavings = (monthly, yearly) => {
        const monthlyCost = monthly * 12;
        return Math.round((1 - yearly / monthlyCost) * 100);
    };

    return (
        <Box sx={{ py: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{ fontWeight: 700, mb: 2 }}
                    >
                        Fleksible prisplaner for alle behov
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            color: theme.palette.text.secondary,
                            fontWeight: 400,
                            mb: 4,
                        }}
                    >
                        Velg pakken som passer best for din bedrift og få
                        umiddelbar tilgang til Smartplans kraftige
                        prosjektstyringsverktøy.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 5,
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={yearly}
                                    onChange={handleBillingChange}
                                    color="primary"
                                />
                            }
                            label=""
                            sx={{ mx: 1 }}
                        />
                        <Typography
                            component="span"
                            sx={{ fontWeight: yearly ? 400 : 700 }}
                        >
                            Månedlig
                        </Typography>
                        <Typography component="span" sx={{ mx: 1 }}>
                            /
                        </Typography>
                        <Typography
                            component="span"
                            sx={{ fontWeight: yearly ? 700 : 400 }}
                        >
                            Årlig
                        </Typography>
                        {yearly && (
                            <Paper
                                sx={{
                                    ml: 2,
                                    px: 1.5,
                                    py: 0.5,
                                    bgcolor: theme.palette.success.light,
                                    color: theme.palette.success.contrastText,
                                    borderRadius: "20px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                }}
                            >
                                Spar{" "}
                                {calculateSavings(
                                    plans[3].monthlyPrice,
                                    plans[3].yearlyPrice
                                )}
                                %
                            </Paper>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={4} ref={ref}>
                    {plans.map((plan, index) => (
                        <Grid
                            item
                            xs={12}
                            md={3}
                            key={plan.title}
                            className={inView ? "fade-in" : ""}
                            sx={{ animationDelay: `${0.2 + index * 0.15}s` }}
                        >
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    borderWidth: plan.isPopular ? 2 : 1,
                                    borderColor: plan.isPopular
                                        ? theme.palette.primary.main
                                        : theme.palette.grey[200],
                                    borderStyle: "solid",
                                    transform: plan.isPopular
                                        ? "scale(1.05)"
                                        : "scale(1)",
                                    zIndex: plan.isPopular ? 1 : 0,
                                    transition: "transform 0.3s ease",
                                    boxShadow: plan.isPopular
                                        ? `0 8px 30px rgba(25, 118, 210, 0.15)`
                                        : "0 4px 12px rgba(0, 0, 0, 0.05)",
                                }}
                                className="animated-element"
                            >
                                {plan.isPopular && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 12,
                                            right: 12,
                                            bgcolor: theme.palette.primary.main,
                                            color: "white",
                                            py: 0.5,
                                            px: 2,
                                            borderRadius: "16px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Mest populær
                                    </Box>
                                )}
                                <CardContent
                                    sx={{
                                        p: 4,
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: 700, mb: 1 }}
                                    >
                                        {plan.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 4, height: 48 }}
                                    >
                                        {plan.description}
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        sx={{ fontWeight: 700, mb: 0.5 }}
                                    >
                                        {plan.monthlyPrice === 0
                                            ? "0 kr/måned"
                                            : yearly
                                            ? `${plan.yearlyPrice} kr`
                                            : `${plan.monthlyPrice} kr`}
                                        {plan.monthlyPrice > 0 && (
                                            <Typography
                                                component="span"
                                                variant="body1"
                                                color="text.secondary"
                                            >
                                                {yearly ? "/år" : "/måned"}
                                            </Typography>
                                        )}
                                    </Typography>
                                    {yearly && plan.monthlyPrice > 0 && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 3 }}
                                        >
                                            Tilsvarer{" "}
                                            {Math.round(plan.yearlyPrice / 12)}{" "}
                                            kr per måned
                                        </Typography>
                                    )}
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Button
                                        component="a"
                                        href="https://app.smartplan.no/auth/register"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant={
                                            plan.isPopular
                                                ? "contained"
                                                : "outlined"
                                        }
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            mb: 4,
                                            py: 1.5,
                                            borderRadius: "8px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                    <Divider
                                        sx={{
                                            mb: 3,
                                            borderColor:
                                                theme.palette.grey[200],
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                        sx={{ mb: 2 }}
                                    >
                                        Inkluderer:
                                    </Typography>
                                    <List disablePadding sx={{ flexGrow: 0 }}>
                                        {plan.features.map((feature) => (
                                            <ListItem
                                                key={feature.text}
                                                disablePadding
                                                disableGutters
                                                sx={{ mb: 1 }}
                                            >
                                                <ListItemIcon
                                                    sx={{ minWidth: 32 }}
                                                >
                                                    {feature.included ? (
                                                        <CheckIcon
                                                            color="success"
                                                            fontSize="small"
                                                        />
                                                    ) : (
                                                        <CloseIcon
                                                            color="disabled"
                                                            fontSize="small"
                                                        />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature.text}
                                                    primaryTypographyProps={{
                                                        variant: "body2",
                                                        color: feature.included
                                                            ? "text.primary"
                                                            : "text.disabled",
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Trenger du en tilpasset løsning for din bedrift?
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        href="/contact"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: "50px",
                            fontWeight: 600,
                        }}
                    >
                        Kontakt oss for pristilbud
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default PricingPlans;
