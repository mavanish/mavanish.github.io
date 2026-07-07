# Mat-IQ Website Content Guide

This site keeps the original Mat-IQ AI/materials visual style, but routine content is now easier to update using files in the `data/` folder.

## Quick reference

| To update | Edit this file | Optional images go in |
|---|---|---|
| Team/group members | `data/people.json` | `assets/img/people/` |
| Research cards and modal text | `data/research.json` | `assets/img/research/` |
| Selected publications | `data/publications.json` | `assets/img/publications/` |
| Software/tools | `data/software.json` | `assets/img/software/` |
| News/updates | `data/news.json` | `assets/img/news/` |
| Layout/theme/AI visual design | `index.html`, `index.css`, `index.js` | — |

## Important JSON rules

- Keep the file wrapped in square brackets: `[ ... ]`.
- Each item is wrapped in curly braces: `{ ... }`.
- Every item except the last needs a comma after it.
- Text must use double quotes.
- Do not put unescaped straight double quotes inside text. Use curly quotes or escape them as `\"`.
- Before publishing, paste changed JSON into a validator such as jsonlint.com.

## Team members: `data/people.json`

Example:

```json
{
  "name": "Jane Doe",
  "role": "Postdoctoral Researcher",
  "section": "postdoc",
  "initials": "JD",
  "photo": "assets/img/people/jane-doe.jpg",
  "dates": "09/2026 - present",
  "details": ["Co-advised with ...", "Research area: AI for materials"]
}
```

Sections currently supported:

- `pi`
- `postdoc`
- `student`

If `photo` is blank, the website shows initials. To add a photo, place a square image in `assets/img/people/` and update the `photo` path.

## Research cards: `data/research.json`

Each entry controls one card and its pop-up modal.

Fields:

- `id`: unique modal id, e.g. `modal-ai`.
- `title`: card/modal title.
- `icon`: emoji or short symbol shown in the card.
- `summary`: short card text.
- `tags`: list of chips.
- `body`: HTML text for the modal. Use `<p>...</p>`, `<h4>...</h4>`, `<ul><li>...</li></ul>`.

## Publications: `data/publications.json`

Add new selected papers at the top of the list.

Example:

```json
{
  "year": "2026",
  "title": "Paper title",
  "authors": "A. Mishra and collaborators",
  "venue": "Journal or status",
  "links": [
    { "label": "DOI", "url": "https://doi.org/..." },
    { "label": "Scholar", "url": "https://scholar.google.com/scholar?q=..." }
  ]
}
```

The live Crossref DOI search is still available on the Publications page. If it fails, the page falls back to the curated JSON list.

## Software/tools: `data/software.json`

Each entry appears as one tool card.

```json
{
  "name": "Tool Name",
  "url": "https://example.com",
  "description": "Short description.",
  "tag": "Python · AI · Database"
}
```

## News: `data/news.json`

Each entry appears on the News page.

```json
{
  "date": "Mar 2026",
  "tag": "Award",
  "title": "News title",
  "excerpt": "One or two sentence update.",
  "image": "assets/img/news/example.jpg"
}
```

The current renderer shows text cards. The `image` field is included so the News section can be extended with images later without changing the data format.

## What changed architecturally

The site still uses:

- `index.html` for the single-page layout,
- `index.css` for the AI/light/neural theme,
- `index.js` for particles, routing, modals, DOI search, and interactions.

New files:

- `assets/js/content-renderer.js` loads the JSON files and renders content.
- `data/*.json` stores routine editable content.
- `assets/img/...` folders organize future images.

Backups of the original files were saved as:

- `index.html.backup-before-simple-ai`
- `index.css.backup-before-simple-ai`
- `index.js.backup-before-simple-ai`


## Openings / Jobs

Edit open positions in:

```text
data/openings.json
```

The openings page is organized as three rows:

- `postdoc`
- `graduate`
- `undergraduate`

To add a new job, add another object inside the relevant row's `jobs` list:

```json
{
  "title": "New Position Title",
  "status": "Open",
  "items": [
    "Short requirement or topic",
    { "text": "Application link", "url": "https://example.com" }
  ],
  "note": "Optional note for applicants.",
  "buttonLabel": "Apply or contact",
  "buttonUrl": "#contact"
}
```
