// import { useState, useEffect } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Header from "./components/layout/Header";
// import Footer from "./components/layout/Footer";
// import HomePage from "./pages/HomePage";
// import PricingPage from "./pages/PricingPage";
// import ContactPage from "./pages/ContactPage";
// import AdminPage from "./pages/AdminPage";
// import LoginPage from "./pages/LogInPage";

// import FeatureDetails from "./components/features/FeatureDetails";

// function App() {
//     const { pathname } = useLocation();
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [pathname]);

//     useEffect(() => {
//         const handleScroll = () => {
//             setScrolled(window.scrollY > 50);
//         };
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     return (
//         <>
//             <Header scrolled={scrolled} />
//             <main>
//                 <Routes>
//                     <Route path="/" element={<HomePage />} />
//                     <Route path="/pricing" element={<PricingPage />} />
//                     <Route path="/contact" element={<ContactPage />} />
//                     <Route path="/admin" element={<AdminPage />} />
//                     <Route path="/loginpage" element={<LoginPage />} />
//                     <Route
//                         path="/funksjoner/:slug"
//                         element={<FeatureDetails />}
//                     />
//                 </Routes>
//             </main>
//             <Footer />
//         </>
//     );
// }

// export default App;

// App.js
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LogInPage";

// ❌ Ikke importer FeatureDetails direkte her
// import FeatureDetails from "./components/features/FeatureDetails";

// ✅ Bruk heller FeatureDetailsPage
import FeatureDetailsPage from "./pages/FeatureDetailsPage";

function App() {
    const { pathname } = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Header scrolled={scrolled} />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/loginpage" element={<LoginPage />} />
                    <Route
                        path="/funksjoner/:slug"
                        element={<FeatureDetailsPage />}
                    />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
