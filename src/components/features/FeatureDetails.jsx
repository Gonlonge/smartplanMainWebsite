import { useParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { features } from "../../data/features";
import CtaSection from "../home/CtaSection";
import FeatureHeader from "./FeatureHeader";
import FeatureMainContent from "./FeatureMainContent";
import FeatureBottom from "./featureBottom";

const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

export default function FeatureDetails() {
    const { slug } = useParams();
    const feature = features.find((f) => slugify(f.title) === slug);

    if (!feature) {
        return (
            <Container sx={{ py: 10 }}>
                <h2 style={{ textAlign: "center" }}>Fant ikke funksjonen.</h2>
            </Container>
        );
    }

    return (
        <Box>
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <FeatureHeader
                    icon={feature.icon}
                    heading={feature.heading || feature.title}
                    intro={feature.intro}
                />
                <FeatureMainContent feature={feature} />
                {feature.images?.length >= 4 && (
                    <FeatureBottom feature={feature} />
                )}
            </Container>
            <Box>
                <CtaSection />
            </Box>
        </Box>
    );
}
