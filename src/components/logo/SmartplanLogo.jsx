// SmartplanLogo.jsx
import React from "react";

/**
 * Smartplan-style mark coded as pure SVG (no images).
 * - size: px (number | string)
 * - color: CSS color (default purple)
 * - stroke: stroke width (defaults scale with size)
 */
function BaseLogo({
    size = 220,
    color = "#7B61FF", // nice lively purple
    stroke, // optional custom stroke width
    ...rest
}) {
    const s = Number(size) || 220;
    const sw = stroke ?? Math.max(8, Math.round(s * 0.07));

    return (
        <svg
            width={s}
            height={s * 0.72}
            viewBox="0 0 300 216"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Smartplan Logo"
            {...rest}
        >
            <g
                stroke={color}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* LEFT CLUSTER (concentric rounded arcs with opening on right) */}
                {/* outer */}
                <path
                    d="
          M 30 108
          a 78 78 0 1 1 78 -78
        "
                />
                {/* mid */}
                <path
                    d="
          M 52 108
          a 56 56 0 1 1 56 -56
        "
                />
                {/* inner */}
                <path
                    d="
          M 74 108
          a 34 34 0 1 1 34 -34
        "
                />
                {/* tail/ending stroke */}
                <path d="M 96 150 a 84 84 0 0 1 -42 -24" />

                {/* RIGHT CLUSTER (mirrored, opening on left) */}
                {/* outer */}
                <path
                    d="
          M 270 108
          a 78 78 0 1 0 -78 -78
        "
                />
                {/* mid */}
                <path
                    d="
          M 248 108
          a 56 56 0 1 0 -56 -56
        "
                />
                {/* inner */}
                <path
                    d="
          M 226 108
          a 34 34 0 1 0 -34 -34
        "
                />
                {/* tail/ending stroke */}
                <path d="M 204 150 a 84 84 0 0 0 42 -24" />
            </g>

            {/* Subtle optical tweaks to emulate the broken-ring look */}
            <g stroke="white" strokeWidth={sw} strokeLinecap="round">
                {/* left gap (near right edge of left cluster) */}
                <path d="M 108 52 L 122 52" />
                <path d="M 116 86 L 132 86" />
                {/* right gap (near left edge of right cluster) */}
                <path d="M 192 52 L 178 52" />
                <path d="M 168 86 L 184 86" />
            </g>
        </svg>
    );
}

export default function SmartplanLogo(props) {
    return <BaseLogo {...props} />;
}

export function SmartplanLogoMono(props) {
    return <BaseLogo color="#111" {...props} />;
}
