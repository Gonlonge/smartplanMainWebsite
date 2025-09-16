import { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebase/queries/loginUser";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await loginUser(email, password);
            console.log("Bruker:", userCredential.user);

            navigate("/admin");
        } catch (err) {
            console.error("Login-feil:", err);
            setError("Ugyldig e-post eller passord.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ my: 8, p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Log in
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login;
