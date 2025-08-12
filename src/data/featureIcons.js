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

export const normalizeSlug = (s = "") =>
    s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, " og ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/æ/g, "ae")
        .replace(/ø/g, "o")
        .replace(/å/g, "a")
        .replace(/[\s_/]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/-+/g, "-") //
        .replace(/^-|-$/g, "");

const add = (map, key, icon, aliases = []) => {
    map.set(normalizeSlug(key), icon);
    aliases.forEach((a) => map.set(normalizeSlug(a), icon));
};

const ICONS_BY_SLUG = new Map();

add(ICONS_BY_SLUG, "Prosjektplanlegging", ConstructionIcon);
add(ICONS_BY_SLUG, "Ressursstyring", TrendingUpIcon);
add(ICONS_BY_SLUG, "Samarbeid i sanntid", PeopleIcon);
add(ICONS_BY_SLUG, "Tidsplanlegging", ScheduleIcon);
add(ICONS_BY_SLUG, "Rapportering og analyse", AnalyticsIcon);
add(ICONS_BY_SLUG, "HMS-dokumentasjon", SecurityIcon);
add(ICONS_BY_SLUG, "RUH og SJA", WarningIcon);

add(ICONS_BY_SLUG, "Møter og referater", GroupsIcon, [
    "Moter og referater",
    "Moter og referat",
    "Møter & referater",
    "moter-referater",
]);

add(ICONS_BY_SLUG, "Økonomi og fakturering", RequestQuoteIcon, [
    "Okonomi og fakturering",
    "Økonomi & fakturering",
    "Okonomi & fakturering",
    "okonomi-fakturering",
    "okonomi og fakturering",
]);

export function getIconFromSlug(slug) {
    const key = normalizeSlug(slug || "");
    return ICONS_BY_SLUG.get(key) || HelpOutlineIcon;
}

export { ICONS_BY_SLUG };
