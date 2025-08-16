# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-08-16

### Added
- App icon integrated into UI header and as favicon/apple-touch-icon.
- Social preview meta tags (Open Graph/Twitter) using `image.png`.
- GitHub Pages deployment via Actions workflow.
- Demo link in README.

### Changed
- Simplified UI to single save button: "💾 Klasöre Kaydet (Yerel)".
- `script.js`: removed unused folder selection code; simplified file discovery to `README.md`.
- `style.css`: polished header icon styles.
- Project structure cleaned and organized into `tests/`, `samples/`, `tools/`, `logs/`.

### Removed
- Legacy files: `CNAME`, `REPO_DESCRIPTION.md`, `logo.webp`.

### Documentation
- README revised with new UI flow, images (relative paths), browser support notes.

### Notes
- Local folder save requires Chromium-based browsers.
