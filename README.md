# Craftertech website

A responsive 22-page enterprise AI and software engineering website, including the twelve-section homepage. Static HTML is generated with Node; Lenis is the only runtime package. SVG artwork is original, and the Craftertech marks were supplied by the user.

## Run locally

Requires Node 20 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. After editing source files, run `npm run build` and reload the browser. The server serves the generated `dist/` folder, and binds to loopback only.

```sh
npm run check   # syntax checks, build, unique IDs and internal anchor validation
npm run build   # generate dist/ for any static host
npm run start   # serve an existing build
```

Primary color: `#3A83F7`, with coordinated navy, blue and ice-blue shades throughout the interface and original artwork. Small text uses darker blue shades for contrast.

## Editing

- `src/render.js`: homepage structure and content.
- `src/site-layout.js`: shared header, desktop/mobile menus, footer and document shell.
- `src/pages.js`: service/industry directories, fourteen detail pages, Technology, About, Approach, Project References and Contact.
- `src/pages.css`: shared navigation and secondary-page layouts.
- `src/content.js`: capabilities, tab content and reference outcome data.
- `src/styles.css`: layout, responsive styles and visual design.
- `src/typography.css`: SentientX-inspired type scale: 60px hero, 45px sections, 30px titles, 14px body; regular weight, 1.1 heading / 1.4 body line height and −0.03em heading tracking. Uses local Neue Montreal when installed, otherwise Helvetica Neue/Helvetica/Arial. Mobile scale keeps headings and body readable.
- `src/client.js`: Lenis, navigation, keyboard-accessible tabs and disclosures.
- `src/art.js`: original line illustrations.
- `src/intelligence.js` and `src/intelligence.css`: Anveril-inspired dot field and stage selector, using Craftertech's existing enterprise AI copy. Stages advance automatically every six seconds while visible, pause on manual selection or keyboard focus, and include a playback control. Reduced-motion preferences disable automatic playback by default.
- `public/assets/craftertech-black.svg`: supplied Group 2.svg, unchanged.
- `public/assets/craftertech-white.svg`: supplied Group 1.svg, unchanged.
- `public/assets/favicon.svg`: supplied mark with light/dark color adaptation.

Lenis is pinned in package-lock.json and copied into dist/vendor during build. No third-party CDN is required. Mouse-wheel and in-page anchor navigation are smoothed; touch retains native scrolling. Reduced-motion preferences are respected, including changes while the page is open. Native links/content remain usable without JavaScript.

## Content and handoff

The initial brief specified Seasia as the factual source and SentientX/Anveril as design references. The subsequent user instruction changed the brand to Craftertech. Source history is preserved in `homepage-mapping.md`; the page no longer presents the source company's years in business as a Craftertech claim. Published case studies and metrics remain clearly identified as third-party references with their research sources retained in the mapping document. All Seasia outbound links have been removed from the live website.

Craftertech's real contact destination has been requested. Until supplied, contact links navigate to `/contact.html`, where visitors can create and download a project brief locally. This is not an inquiry submission form and does not transmit information. No email address, phone number, social profile or legal policy has been invented.

Fonts are self-hosted under the SIL Open Font License, included in assets. Lenis's MIT license is included in the generated vendor directory.

## Pages and navigation

Services in the header links directly to the services collection page, where visitors choose among six dedicated service pages. Service detail breadcrumbs link back to the collection. Industries also links directly to its collection of eight industries, each with a separate detail page and a breadcrumb back to the collection. Both collections use equal-height cards and bottom-aligned blue text CTAs. Company remains a grouped menu (About, Approach, Contact). Technology and Project References are direct menu links. Mobile uses expandable, scrollable navigation with Escape and focus restoration. All pages have shared navigation and footer links.

Page URLs use `.html` so the generated output works on a basic static host without rewrite rules. `npm run check` validates every page, internal route, fragment target, duplicate ID and absence of Seasia redirects.

Validation: all 22 routes returned HTTP 200 with HTML content; All internal links passed build validation. Desktop service navigation, mobile industry navigation, menu Escape/focus restoration, Lenis on secondary pages, and local project-brief generation were tested in the browser.

UI icons use Google Material Symbols Outlined SVGs, stored locally in `public/assets/icons/` with the Apache 2.0 license. The shared `src/icons.js` helper renders decorative inline SVGs that inherit text color.

The shared header now follows the compact floating pattern of SentientX: centered navy logo/menu bar, page label at left and a separate contact link at right. The same expandable navigation is used at every screen size; Services and Industries remain direct links to their collections.

Domain Depth uses `src/domain.js` and `src/domain.css`: eight industry cards with locally stored photography, circular previous/next controls, progress markers and links to the existing industry detail pages. Cards advance automatically every six seconds while visible, using a vertical perspective transition on desktop and mobile. Page scrolling does not change slides or pin the section. Arrow and progress controls pause autoplay for reading; the playback button resumes it. Reduced-motion preferences disable autoplay by default. The industry copy is Craftertech's existing content, not Anveril's. Image sources are recorded in `public/assets/industries/SOURCES.txt`.
