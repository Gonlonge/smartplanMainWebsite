import { Box } from "@mui/material";
import MessagesAdmin from "../components/admin/MessageAdmin";
import FeaturesSection from "../components/home/FeaturesSection";

function AdminPage() {
    return (
        <Box component="section" sx={{ pt: 4 }}>
            <MessagesAdmin />
            <FeaturesSection />
        </Box>
    );
}

export default AdminPage;
