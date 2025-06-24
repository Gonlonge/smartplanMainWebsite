import { Box } from "@mui/material";
import MessagesAdmin from "../components/admin/MessageAdmin";

function AdminPage() {
    return (
        <Box component="section" sx={{ pt: 4 }}>
            <MessagesAdmin />
        </Box>
    );
}

export default AdminPage;
