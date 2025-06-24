import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const pages = [
    { label: "Hjem", path: "/" },
    { label: "Priser", path: "/pricing" },
    { label: "Kontakt", path: "/contact" },
];

function Header({ scrolled }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === "/";
    const textColor = isHome ? "#fff" : "#000";
    const iconColor = textColor;

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleCloseNavMenu();
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: scrolled
                    ? isHome
                        ? "rgba(0, 0, 0, 0.15)"
                        : "rgba(255, 255, 255, 0.15)"
                    : "transparent",
                backdropFilter: scrolled ? "blur(8px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
                transition:
                    "background-color 0.3s ease, backdrop-filter 0.3s ease",
                boxShadow: scrolled
                    ? "0px 2px 10px rgba(0, 0, 0, 0.05)"
                    : "none",
                color: textColor,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo for desktop */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "flex-start",
                            mr: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 500,
                                letterSpacing: ".2rem",
                                color: textColor,
                                textDecoration: "none",
                            }}
                        >
                            Smartplan
                        </Typography>
                        <Box
                            sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: "#8051C9",
                                display: "inline-block",
                                mt: 1.9,
                                ml: 0.2,
                            }}
                        />
                    </Box>

                    {/* Mobile menu logo */}
                    <Box
                        sx={{
                            display: { xs: "flex", md: "none" },
                            alignItems: "flex-start",
                            mr: 2,
                        }}
                    >
                        <Typography
                            variant="h5"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: ".1rem",
                                color: textColor,
                                textDecoration: "none",
                            }}
                        >
                            Smartplan
                        </Typography>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "#8051C9",
                                display: "inline-block",
                                mt: 1.2,
                                ml: 0.5,
                            }}
                        />
                    </Box>

                    {/* Mobile menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                            justifyContent: "flex-end",
                            pr: 1,
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: iconColor }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.path}
                                    onClick={() => handleNavigate(page.path)}
                                    selected={location.pathname === page.path}
                                >
                                    <Typography textAlign="center">
                                        {page.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Desktop menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "flex-end",
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page.path}
                                onClick={() => handleNavigate(page.path)}
                                sx={{
                                    mx: 1,
                                    my: 2,
                                    color: textColor,
                                    position: "relative",
                                    fontWeight:
                                        location.pathname === page.path
                                            ? 600
                                            : 500,
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 0,
                                        left: "50%",
                                        width:
                                            location.pathname === page.path
                                                ? "100%"
                                                : "0%",
                                        height: "2px",
                                        backgroundColor: textColor,
                                        transition: "all 0.3s ease",
                                        transform: "translateX(-50%)",
                                    },
                                    "&:hover::after": {
                                        width: "100%",
                                    },
                                }}
                            >
                                {page.label}
                            </Button>
                        ))}
                        <Button
                            component="a"
                            href="https://support.smartplan.no/"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant={isHome ? "outlined" : "contained"}
                            sx={{
                                ml: 2,
                                my: 2,
                                borderRadius: "24px",
                                px: 3,
                                fontWeight: 600,
                                color: isHome ? "#fff" : "#000",
                                backgroundColor: isHome
                                    ? "transparent"
                                    : theme.palette.primary.main,
                                borderColor: isHome ? "#fff" : "transparent",
                                "&:hover": {
                                    backgroundColor: isHome
                                        ? "rgba(255,255,255,0.1)"
                                        : theme.palette.primary.dark,
                                },
                            }}
                        >
                            Support
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
