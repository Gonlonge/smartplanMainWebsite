// src/components/MessagesAdmin.js
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
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";

function MessagesAdmin() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const q = query(
                    collection(db, "contactMessages"),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(data);
            } catch (error) {
                console.error("Feil ved henting av meldinger:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleOpenModal = (msg) => {
        setSelectedMessage(msg);
    };

    const handleCloseModal = () => {
        setSelectedMessage(null);
    };

    return (
        <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                        Innkommende meldinger
                    </Typography>
                    <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto" }}>
                        Her ser du alle meldinger sendt inn via kontaktskjema.
                    </Typography>
                </Box>

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

                                        <Box sx={{ mt: 2 }}>
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
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Modal */}
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
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Lukk</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default MessagesAdmin;
