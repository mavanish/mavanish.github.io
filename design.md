# Mat-IQ design system

Preserve Mat-IQ cobalt (#2147c4), Source Serif 4 display, and IBM Plex Sans body. Colors and fonts are defined in tokens.css. base.css supplies shared accessibility defaults; index.css defines the site compositions.

Use a centered 1320px maximum container with 48px desktop and 24px phone gutters. Use large left-aligned headings, pale blue paper, hairlines, and square controls. Research is a structured index; publications are a ledger; people are a directory; software is a typographic catalogue. Preserve all nine hash routes.

The home stage presents the existing labelled grain-boundary diagram and one concise sentence. Scientific diagrams are factual system diagrams, not decorative illustrations. Large research selectors include descriptions and intentionally exceed ordinary button heights. Home focus selectors occupy the bottom of the first screen. The footer follows each routed page; marketing inter-section spacing does not apply between mutually exclusive routes.

Keep keyboard focus visible and immediate, trap and restore research-dialog focus, pause the carousel on hover or focus, offer a visible pause button, and disable movement for reduced motion. Content must remain available without JavaScript. After JSON edits, run node scripts/build-content.mjs to regenerate static content.
