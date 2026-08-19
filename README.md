# Blake Walker — Creative Developer

Personal GitHub Pages portfolio for Blake Walker, customised around the uploaded static-site structure.

## Selected work

- Aurora Athletics Studio
- Nexora
- The Corrections Assistant Bot — Creator
- Corrections Control Center Bot — Creator
- Character / 3D
- Development
- Experiments

## Before publishing

Replace these placeholders in `index.html`:

- `YOUR_DISCORD_ID`
- `YOUR_STEAM_ID`
- `YOUR_EMAIL@example.com`

Replace `YOUR_DISCORD_USER_ID` in `discord.js` with your numeric Discord user ID. The live card uses Lanyard and stays hidden until the account is available there.

Your GitHub link is already set to `https://github.com/XVBIGKILLERXV`.

## Projects

Edit `links.json` to rename, reorder, add, remove, or change project descriptions.

## Background

The original personal background media has been removed. The existing CSS gradient fallback still works. To add your own looping background later, use:

- `assets/bg.webm`
- `assets/bg.mp4`
- optional `assets/poster.jpg`

## GitHub Pages

Publish from `main` and `/(root)` under **Settings → Pages**.

## Colour theme

This build uses Blake Walker's Discord-inspired palette: deep purple-black backgrounds, aubergine panels, electric violet highlights, soft lavender text, magenta hard-aspect accents, and cyan soft-aspect accents.


## Natal chart

The interactive natal chart section is restored. It includes house-system switching, aspect filtering, hover tracing, placement details and a permalink anchor. Tarot remains removed.


## Live Discord presence

The site includes the Lanyard-powered live Discord presence card from the reference implementation. It uses REST for the first paint, a WebSocket for real-time updates, automatic reconnect, and a REST fallback. It can show your avatar and decoration, online/idle/DND state, primary guild tag, custom status, current activity, and Spotify.

1. Open `discord-config.js`.
2. Replace `YOUR_DISCORD_USER_ID` with your numeric Discord User ID.
3. Join the Lanyard Discord server and remain a member so Lanyard can observe your presence.
4. Commit the change to GitHub Pages.

If the ID has not been configured, the site shows a small setup notice instead of a broken/empty card.
