// // src/data/featureIconMap.js
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import { features } from "./features";

// // Normaliser slug (tåler ø/æ/å, aksenter, mellomrom)
// const norm = (s = "") =>
//     s
//         .toString()
//         .trim()
//         .toLowerCase()
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "") // fjern diakritikk
//         .replace(/æ/g, "ae")
//         .replace(/å/g, "a")
//         .replace(/ø/g, "o")
//         .replace(/\s+/g, "-");

// // Map slug -> index i features[]
// // Oppdater denne hvis du legger til nye sider
// export const iconIndexBySlug = {
//     prosjektplanlegging: 0, // ConstructionIcon
//     vekst: 1, // TrendingUpIcon
//     bemanning: 2, // PeopleIcon
//     tidsplanlegging: 3, // ScheduleIcon
//     analyse: 4, // AnalyticsIcon
//     sikkerhet: 5, // SecurityIcon
//     risiko: 6, // WarningIcon
//     team: 7, // GroupsIcon
//     økonomi: 8,
//     okonomi: 8, // alias uten diakritikk
// };

// // Deterministisk fallback hvis slug ikke er mappet
// const hash = (s) => {
//     let h = 0;
//     for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
//     return Math.abs(h);
// };

// // Hent ikon-komponent fra features[] basert på slug
// export function getIconFromSlug(slug) {
//     const n = norm(slug || "");
//     const idx =
//         iconIndexBySlug[n] ??
//         iconIndexBySlug[slug] ?? // prøv u-normalisert også, i tilfelle du bruker eksakt nøkkel
//         undefined;

//     if (Number.isInteger(idx) && features[idx]?.icon) {
//         return features[idx].icon;
//     }

//     if (features.length > 0) {
//         const fallbackIdx = hash(n) % features.length;
//         return features[fallbackIdx]?.icon || HelpOutlineIcon;
//     }

//     return HelpOutlineIcon;
// }

// src/data/featureIconMap.js
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import ConstructionIcon from "@mui/icons-material/Construction";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import GroupsIcon from "@mui/icons-material/Groups";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

// Normalize to match your route slugs (handles ø/æ/å etc.)
const norm = (s = "") =>
    s
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip accents/diacritics
        .replace(/æ/g, "ae")
        .replace(/ø/g, "o")
        .replace(/å/g, "a")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

// Define icons by the **feature titles** you use in the grid.
// We'll normalize these titles to the same slug format your app uses.
const RAW_ICON_MAP = {
    Prosjektplanlegging: ConstructionIcon,
    Ressursstyring: TrendingUpIcon,
    "Samarbeid i sanntid": PeopleIcon,
    Tidsplanlegging: ScheduleIcon,
    "Rapportering og analyse": AnalyticsIcon,
    "HMS-dokumentasjon": SecurityIcon,
    "RUH og SJA": WarningIcon,
    "Møter og referater": GroupsIcon,
    "Økonomi og fakturering": RequestQuoteIcon,
};

// Build a normalized lookup (keys look like "rapportering-og-analyse")
const ICONS_BY_SLUG = new Map(
    Object.entries(RAW_ICON_MAP).map(([title, Icon]) => [norm(title), Icon])
);

// Public API: get icon component from a slug
export function getIconFromSlug(slug) {
    const key = norm(slug || "");
    return ICONS_BY_SLUG.get(key) || HelpOutlineIcon;
}

// (Optional) export map if you want to tweak quickly elsewhere
export { ICONS_BY_SLUG };
