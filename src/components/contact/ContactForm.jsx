import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    useTheme,
    MenuItem,
    Snackbar,
    Alert,
    Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useInView } from "react-intersection-observer";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const inquiryTypes = [
    { value: "general", label: "Generell forespørsel" },
    { value: "demo", label: "Ønsker en presentasjon" },
    { value: "pricing", label: "Spørsmål om priser" },
];

function ContactForm() {
    const theme = useTheme();
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        inquiryType: "general",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim())
            newErrors.firstName = "Fornavn er påkrevd";
        if (!formData.lastName.trim())
            newErrors.lastName = "Etternavn er påkrevd";
        if (!formData.email.trim()) {
            newErrors.email = "E-post er påkrevd";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "E-post er ugyldig";
        }
        if (!formData.company.trim())
            newErrors.company = "Firmanavn er påkrevd";
        if (!formData.message.trim()) newErrors.message = "Melding er påkrevd";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await addDoc(collection(db, "contactMessages"), {
                ...formData,
                createdAt: serverTimestamp(),
            });

            setSnackbar({
                open: true,
                message: "Din forespørsel er sendt! Vi vil kontakte deg snart.",
                severity: "success",
            });

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                company: "",
                phone: "",
                inquiryType: "general",
                message: "",
            });
        } catch (error) {
            console.error("Firebase-feil:", error);
            setSnackbar({
                open: true,
                message: "Noe gikk galt. Prøv igjen senere.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Kontaktdetaljer (venstre side) */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        className={inView ? "fade-in" : ""}
                    >
                        <Box sx={{ maxWidth: 450 }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{ fontWeight: 700, mb: 3 }}
                            >
                                Kontakt oss
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    color: theme.palette.text.secondary,
                                    fontWeight: 400,
                                }}
                            >
                                Har du spørsmål om Smartplan eller ønsker en
                                presentasjon? Fyll ut skjemaet, så tar vi
                                kontakt med deg så fort som mulig.
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 4 }}
                            >
                                Vårt team er tilgjengelig mandag til fredag,
                                08:00–16:00.
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 4,
                                    bgcolor: theme.palette.primary.light + "10",
                                    border: "1px solid",
                                    borderColor:
                                        theme.palette.primary.light + "30",
                                    borderRadius: 2,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{ mb: 2 }}
                                >
                                    Kontaktinformasjon
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    E-post:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    post@smartplan.no
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    Telefon:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    +47 52 05 52 25
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    Besøksadresse:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Svanholmen 7, 4313 Sandnes
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    Etasje:
                                </Typography>
                                <Typography variant="body2">2</Typography>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Skjema (høyre side) */}
                    <Grid
                        item
                        xs={12}
                        md={7}
                        ref={ref}
                        className={inView ? "slide-in-right" : ""}
                        sx={{ animationDelay: "0.2s" }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: theme.palette.grey[200],
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mb: 3 }}
                            >
                                Send oss en melding
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Fornavn"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!errors.firstName}
                                            helperText={errors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Etternavn"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="E-post"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Firma"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!errors.company}
                                            helperText={errors.company}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Telefon"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            label="Type henvendelse"
                                            name="inquiryType"
                                            value={formData.inquiryType}
                                            onChange={handleChange}
                                            fullWidth
                                        >
                                            {inquiryTypes.map((option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Din melding"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            multiline
                                            rows={5}
                                            fullWidth
                                            required
                                            error={!!errors.message}
                                            helperText={errors.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            endIcon={<SendIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: "8px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Send henvendelse
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ContactForm;
