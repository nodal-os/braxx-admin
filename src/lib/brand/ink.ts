/**
 * Nodal OS Ink — Paper night.
 * Source: nodal-os/nodal apps/web/src/lib/brand/templates.ts (id: ink)
 * and the Brand OS apply path (applyOsTemplate / html.dark[data-brand="nodal"]).
 *
 * Do not invent a theme. Do not use Voltage.
 */
export const INK_TEMPLATE_ID = "ink";

export const INK = {
  id: "ink",
  name: "Ink",
  language: "Paper night",
  tagline: "Paperweight inverted · Inter + Space Grotesk",
  accent: "#E8C4A0",
  glow: "#E8C4A0",
  page: "#16181e",
  ink: "#f4f1ec",
  scheme: "dark" as const,
  chrome: "revo" as const,
  paper: true,
  fonts: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    display: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  },
  /** Lifted plate on the night field — same pairing Nodal uses for Ink cards. */
  card: "#1c1f26",
  /** Ink-on-copper for primary chrome. */
  onAccent: "#191e29",
  muted: "#22262e",
  mutedInk: "#a8a29e",
  border: "rgba(232, 196, 160, 0.14)",
  paperDot: "rgba(232, 196, 160, 0.10)",
} as const;

export const HAVOK = {
  name: "HAVØK",
  product: "Command Center",
  host: "admin.ridehavok.com",
  publicSite: "https://ridehavok.com",
  checkout: "np11ks-vz.myshopify.com",
  location: "DTLA",
  line: ["O3", "O3 Pro", "X1"] as const,
} as const;
