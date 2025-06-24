import { Box, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // OBS: Sørg for riktig path
import { useNavigate } from "react-router-dom";

function LogoutButton({ redirectTo = "/" }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            console.error("Logout-feil:", err);
        }
    };

    return (
        <Box>
            <Button variant="outlined" onClick={handleLogout}>
                Logg ut
            </Button>
        </Box>
    );
}

export default LogoutButton;
