# XVBIGKILLERXV.github.io

The root landing page / personal portfolio for **Blake Walker / XVBIGKILLERXV** — a minimal interactive hub for my Discord bots, modding projects, experiments and other development work.

The site combines a clean project directory with live Discord presence, an interactive natal chart, rotating subtaglines, terminal-style interactions and a collection of small visual experiments.

**Live:** https://xvbigkillerxv.github.io/

---

## How it works

- **Static and lightweight.** Built with plain HTML, CSS and JavaScript with no large frontend framework. GitHub Pages serves the site directly from `main`.

- **Content is data-driven.** Project information is stored in `links.json`, allowing projects to be renamed, reordered, added or removed without rebuilding the page structure.

- **Rotating subtaglines.** Additional phrases are loaded from `subtaglines.json`, giving the landing page a changing collection of development, gaming and modding-related messages.

- **Interactive project previews.** Projects can display image or looping video previews when visitors interact with them.

- **Live Discord presence.** A Lanyard-powered presence card can display my current Discord status, avatar, custom status and activity in real time.

- **Interactive natal chart.** The site includes a full natal chart with house-system controls, aspect filtering, hover tracing and placement information.

- **Interactive terminal.** A small terminal interface provides commands for exploring the site, projects and other information.

- **Hidden Developer Mode.** An experimental developer interface can be accessed through the site's terminal. It provides additional visual/debug-style information without exposing private credentials or source code.

- **Progressive enhancement.** Features that depend on external services are designed to fail gracefully so the main portfolio remains usable if an API is unavailable.

---

## Projects

Projects are organised into categories defined inside `links.json`.

The current main categories are:

- **Discord Bots**
- **Experiments**

### Nexora

An all-in-one Discord bot currently under development.

Nexora is being built as a multipurpose Discord bot covering areas such as moderation, administration, economy, tickets, entertainment and live server utilities.

**Status:** Work in Progress

### The Corrections Assistant Bot

A purpose-built Discord assistant supporting corrections workflows, information access and community operations.

**Role:** Creator  
**Availability:** Private

The project is not publicly distributed. Contact me for more information.

### Corrections Control Center Bot

A control-centre focused Discord bot designed around structured corrections operations, staff tooling and coordination.

**Role:** Creator  
**Availability:** Private

The project is not publicly distributed. Contact me for more information.

### Experiments

A collection of smaller prototypes, visual experiments, interface concepts, modding work and ideas that don't necessarily belong to a larger project.

---

## Editing projects

Project content is controlled through `links.json`.

Example:

```json
{
  "profile": {
    "handle": "XVBIGKILLERXV",
    "tagline": "Creative Developer",
    "github": "https://github.com/XVBIGKILLERXV"
  },

  "categories": [
    {
      "id": "bots",
      "label": "Discord Bots"
    },
    {
      "id": "experiments",
      "label": "Experiments"
    }
  ],

  "links": [
    {
      "title": "Nexora",
      "url": "#",
      "category": "bots",
      "blurb": "Multipurpose Discord bot covering moderation, administration, economy, tickets, entertainment and live server utilities.",
      "featured": true
    }
  ]
}
```

Categories render in the order they appear in `categories[]`, while projects render in the order they appear in `links[]`.

Setting:

```json
"featured": true
```

makes the project visible in the main portfolio.

Private projects can remain displayed as portfolio pieces without linking visitors to their source code.

---

## Project previews

Projects can display visual previews when hovered or selected.

Preview assets are stored under:

```text
assets/previews/
```

The system supports both images and looping video previews.

For example:

```text
assets/previews/nexora.webp
assets/previews/nexora.mp4

assets/previews/corrections-assistant.webp
assets/previews/corrections-control.webp

assets/previews/experiments.webp
```

This allows projects to show artwork, screenshots, interface demonstrations or short animated previews without changing the main project layout.

---

## Rotating subtaglines

The landing page uses `subtaglines.json` to rotate through different phrases.

Example:

```json
{
  "phrases": [
    "Ideas become real when you build them.",
    "Built from curiosity, refined through experimentation.",
    "Modding games one idea at a time.",
    "Breaking things is sometimes part of building them.",
    "Currently experimenting with Ghost Recon Breakpoint."
  ]
}
```

This file can be expanded without modifying the main HTML.

The site randomly selects from the available phrases rather than displaying the same tagline permanently.

---

## Live Discord presence

The portfolio includes a live Discord presence card powered by **Lanyard**.

Depending on the information available, the card can display:

- Discord avatar
- Avatar decoration
- Online status
- Idle status
- Do Not Disturb status
- Custom status
- Current activity
- Spotify activity
- Guild information

Configuration is stored in:

```text
discord-config.js
```

The presence system uses REST for initial information and a WebSocket connection for live updates.

If Discord/Lanyard information is unavailable, the feature degrades gracefully rather than breaking the rest of the page.

---

## Natal chart

The interactive natal chart is one of the larger experimental elements of the portfolio.

It includes:

- Planetary placements
- Houses
- House-system switching
- Aspect filtering
- Placement information
- Hover tracing
- Chart controls
- Permalink support

The chart has been visually integrated into the site's purple-black colour palette rather than presented as a separate application.

---

## Terminal

The site contains an interactive terminal accessible from the `>_` launcher.

Some available commands include:

```text
help
about
projects
private
status
modding
discord
github
natal
time
visitor
clear
```

The terminal is also used for several hidden/experimental features.

Try exploring it.

---

## Developer Mode

Developer Mode is an experimental extension of the terminal.

It adds additional debug-inspired interface elements, project information and development commands.

Private projects deliberately avoid exposing their source repositories and can instead display information such as:

```text
SOURCE / [REDACTED]
```

Developer Mode is a visual portfolio feature — **not a storage location for secrets**.

API keys, Discord tokens, bot credentials, private repository credentials and other sensitive information should never be stored in frontend JavaScript or exposed through GitHub Pages.

---

## Interactive effects

A collection of smaller effects is layered over the main site without changing its core structure.

These include:

- Boot/loading sequence
- Scroll-triggered reveals
- Mouse-reactive ambient glow
- Project hover previews
- Terminal interactions
- Local time
- Visitor information
- Hidden commands
- Easter eggs
- Developer Mode transitions
- Responsive effects
- Reduced-motion fallbacks

These features are primarily handled through:

```text
extras.js
extras.css
```

Keeping them separate makes the experimental functionality easier to modify without heavily changing the original site structure.

---

## Cache busting

GitHub Pages and browsers may temporarily cache older JavaScript or CSS files after an update.

To prevent visitors from receiving new HTML alongside old JavaScript/CSS, asset references in `index.html` use content-based version stamps.

For example:

```text
styles.css?v=77ecd89f
app.js?v=7fd6fa54
extras.js?v=81f9d70b
```

After editing a `.js` or `.css` file, regenerate the asset stamps:

```bash
node scripts/stamp-assets.mjs
```

Then verify them with:

```bash
node scripts/stamp-assets.mjs --check
```

The check command does **not** update anything. It only verifies that the existing stamps are correct.

If it reports:

```text
asset stamps are stale
```

run the first command again and commit the updated `index.html`.

---

## Background media

The site supports an optional looping background.

Background files can be placed in:

```text
assets/bg.webm
assets/bg.mp4
assets/poster.jpg
```

A short, seamless and muted video works best.

If no background video is present, the site falls back to its designed CSS gradient so the page remains visually complete.

---

## Local preview

The site should preferably be tested through a local HTTP server.

For example:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Opening `index.html` directly through `file://` may still display the base layout, but browser security restrictions can prevent JSON files, APIs and other fetched content from working normally.

Running a local server gives a much more accurate preview of the GitHub Pages deployment.

---

## GitHub Pages

The production site is deployed through GitHub Pages from:

```text
Branch: main
Directory: / (root)
```

After changes are committed and pushed to `main`, GitHub Pages handles deployment automatically.

The live site is available at:

**https://xvbigkillerxv.github.io/**

---

## Color theme

The site uses a dark palette inspired by my Discord profile and overall online branding.

The main visual direction consists of:

- Deep purple-black backgrounds
- Aubergine panels
- Electric violet highlights
- Soft lavender text
- Magenta accents
- Cyan secondary accents

The goal is to retain the sparse/minimal feel of the original layout while making the portfolio visually identifiable as my own.

---

## Built with

```text
HTML
CSS
JavaScript
JSON
GitHub Pages
Lanyard
```

No large frontend framework is required.

---

## Contact

Some of my projects — particularly Discord bots — are intentionally kept private.

If you're interested in one of them or would like more information, contact me through the links available on the portfolio.

**GitHub:** https://github.com/XVBIGKILLERXV

---

**Blake Walker / XVBIGKILLERXV**  
Creative Developer • Discord Bots • Modding • Interactive Projects

*Ideas become real when you build them.*
