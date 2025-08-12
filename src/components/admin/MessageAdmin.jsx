import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    useTheme,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { getContactMessages } from "../../firebase/queries/getContactMessages";
import { deleteContactMessage } from "../../firebase/queries/deleteContactMessage";
import LogoutButton from "../logout/LogoutButton";

function MessagesAdmin() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const msgs = await getContactMessages();
                setMessages(msgs);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const handleOpenModal = (msg) => setSelectedMessage(msg);
    const handleCloseModal = () => setSelectedMessage(null);

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteContactMessage(messageId);
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    // ----- Email helpers -----
    const buildSubject = (msg) =>
        `Svar på din henvendelse${
            msg?.inquiryType ? ` – ${msg.inquiryType}` : ""
        }`;

    const buildBody = (msg) =>
        `Hei ${msg?.firstName || ""},\n\n` +
        `Takk for henvendelsen din.\n\n` +
        `Med vennlig hilsen / Kind regards\nSmartplan AS`;

    // Outlook Web compose-link
    const buildOutlookWebHref = (msg) => {
        const to = (msg?.email || "").trim();
        if (!to) return null;
        const su = encodeURIComponent(buildSubject(msg));
        const body = encodeURIComponent(buildBody(msg));
        return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(
            to
        )}&subject=${su}&body=${body}`;
        // For privat/live: https://outlook.live.com/owa/?path=/mail/action/compose&to=...&subject=...&body=...
    };

    // Åpne i NY fane (ikke forlat appen)
    const openOutlookWebInNewTab = (msg) => {
        const url = buildOutlookWebHref(msg);
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
            <Container maxWidth="lg">
                <Box sx={{ position: "relative", mb: 2 }}>
                    <Typography
                        variant="h2"
                        sx={{ fontWeight: 700, textAlign: "center" }}
                    >
                        Innkommende meldinger
                    </Typography>
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                        <LogoutButton />
                    </Box>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        maxWidth: 700,
                        mx: "auto",
                        mb: 4,
                        textAlign: "center",
                    }}
                >
                    Her ser du alle meldinger sendt inn via kontaktskjema.
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography align="center">
                        Ingen meldinger enda.
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {messages.map((msg) => (
                            <Grid item xs={12} sm={6} md={4} key={msg.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        border: "1px solid",
                                        borderColor: theme.palette.grey[100],
                                        transition:
                                            "transform 0.3s ease, box-shadow 0.3s ease",
                                        "&:hover": {
                                            transform:
                                                "translateY(-5px) scale(1.02)",
                                            boxShadow:
                                                "0 8px 20px rgba(0, 0, 0, 0.1)",
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {msg.firstName} {msg.lastName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ mb: 1 }}
                                            >
                                                {msg.company}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>E-post:</strong>{" "}
                                                {msg.email}
                                            </Typography>
                                            {msg.phone && (
                                                <Typography variant="body2">
                                                    <strong>Telefon:</strong>{" "}
                                                    {msg.phone}
                                                </Typography>
                                            )}
                                            <Typography variant="body2">
                                                <strong>
                                                    Henvendelsestype:
                                                </strong>{" "}
                                                {msg.inquiryType}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mt: 1,
                                                    maxHeight: 60,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {msg.message}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                mt: 2,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 2,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    handleOpenModal(msg)
                                                }
                                                sx={{
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: "50px",
                                                    "&:hover": {
                                                        borderColor: "white",
                                                        backgroundColor:
                                                            "rgba(255, 255, 255, 0.1)",
                                                    },
                                                }}
                                            >
                                                Les mer
                                            </Button>

                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() =>
                                                    openOutlookWebInNewTab(msg)
                                                }
                                                disabled={
                                                    !buildOutlookWebHref(msg)
                                                }
                                                sx={{
                                                    borderRadius: "50px",
                                                    px: 4,
                                                    py: 1.5,
                                                }}
                                            >
                                                Svar til avsender
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Dialog
                    open={!!selectedMessage}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Melding fra {selectedMessage?.firstName}{" "}
                        {selectedMessage?.lastName}
                    </DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            <strong>Firma:</strong> {selectedMessage?.company}{" "}
                            <br />
                            <strong>E-post:</strong> {selectedMessage?.email}{" "}
                            <br />
                            {selectedMessage?.phone && (
                                <>
                                    <strong>Telefon:</strong>{" "}
                                    {selectedMessage.phone} <br />
                                </>
                            )}
                            <strong>Henvendelsestype:</strong>{" "}
                            {selectedMessage?.inquiryType} <br />
                            <br />
                            <strong>Melding:</strong> <br />
                            {selectedMessage?.message}
                            <br />
                            <br />
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Sendt:{" "}
                                {selectedMessage?.createdAt?.toDate &&
                                    selectedMessage.createdAt
                                        .toDate()
                                        .toLocaleString()}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        {/* Venstre side */}
                        <Button
                            color="error"
                            onClick={() =>
                                handleDeleteMessage(selectedMessage.id)
                            }
                        >
                            Slett
                        </Button>

                        {/* Høyre side */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button onClick={handleCloseModal}>Lukk</Button>
                            <Button
                                variant="contained"
                                onClick={() =>
                                    openOutlookWebInNewTab(selectedMessage)
                                }
                                disabled={!buildOutlookWebHref(selectedMessage)}
                            >
                                Svar til avsender
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default MessagesAdmin;
