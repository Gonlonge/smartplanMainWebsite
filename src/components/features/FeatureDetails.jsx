import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography } from "@mui/material";
import {
    onSnapshot,
    query,
    where,
    limit,
    collection,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

import CtaSection from "../home/CtaSection";
import FeatureHeader from "./FeatureHeader";
import FeatureMainContent from "./FeatureMainContent";
import FeatureBottom from "./FeatureBottom";

export default function FeatureDetails() {
    const { slug } = useParams();
    const mainRef = useRef(null);

    const [live, setLive] = useState({
        docId: null,
        title: "",
        shortDescription: "",
        images: [],
        loading: true,
        error: "",
    });

    useEffect(() => {
        setLive((s) => ({ ...s, loading: true, error: "" }));
        const qy = query(
            collection(db, "features"),
            where("slug", "==", slug),
            limit(1)
        );
        const unsub = onSnapshot(
            qy,
            (qs) => {
                if (!qs.empty) {
                    const d = qs.docs[0];
                    const data = d.data() || {};
                    setLive({
                        docId: d.id,
                        title: data.title || "",
                        shortDescription: data.shortDescription || "",
                        images: Array.isArray(data.images) ? data.images : [],
                        loading: false,
                        error: "",
                    });
                } else {
                    setLive({
                        docId: null,
                        title: "",
                        shortDescription: "",
                        images: [],
                        loading: false,
                        error: "",
                    });
                }
            },
            (err) =>
                setLive((s) => ({
                    ...s,
                    loading: false,
                    error: err.message || "Kunne ikke hente data.",
                }))
        );
        return () => unsub();
    }, [slug]);

    const showCreateHint = !live.loading && !live.docId;

    return (
        <Box>
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                {/* Force remount on slug change to avoid any stale state */}
                <FeatureHeader key={slug} docId={live.docId} slug={slug} />

                {showCreateHint && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: -2, mb: 2 }}
                    >
                        Ingen innhold her ennå. Trykk Rediger for å komme i gang
                    </Typography>
                )}

                <FeatureMainContent
                    ref={mainRef}
                    docId={live.docId}
                    slug={slug}
                />
                <FeatureBottom docId={live.docId} slug={slug} />
            </Container>

            <Box>
                <CtaSection />
            </Box>
        </Box>
    );
}
