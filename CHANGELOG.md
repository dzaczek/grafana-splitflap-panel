# Changelog

## 1.1.30 (2025-11-30)

### Maintenance
- Reverted to official `grafana/plugin-actions/build-plugin` workflow, now that signing issues are resolved via CLI flags.
- Kept `softprops/action-gh-release` for artifact publishing.

## 1.1.29 (2025-11-30)

### Maintenance
- Official release (removed `-beta` suffix).
- Stabilized build workflow with manual signing and packaging steps.

## 1.1.28-beta.26 (2025-11-30)

### Maintenance
- Fixed release artifact naming by using git tag version instead of parsing JSON.
- Marked release as full release (not prerelease).

## 1.1.28-beta.25 (2025-11-30)

### Maintenance
- Replaced opaque `package-plugin` action with manual `zip` command to ensure artifact creation and correct naming for release upload.

## 1.1.28-beta.24 (2025-11-30)

### Maintenance
- Switched to `softprops/action-gh-release` for reliable GitHub Release creation.

## 1.1.28-beta.23 (2025-11-30)

### Maintenance
- Added manual MD5 checksum generation step to release workflow.

## 1.1.28-beta.22 (2025-11-30)

### Maintenance
- Corrected artifact path pattern for GitHub Release upload (checking root directory instead of `dist/`).

## 1.1.28-beta.21 (2025-11-30)

### Maintenance
- Added GitHub Release step to upload plugin artifacts (.zip and .md5) to the release page.

## 1.1.28-beta.20 (2025-11-30)

### Maintenance
- Added `id-token: write` and `attestations: write` permissions to workflow for build provenance attestation.

## 1.1.28-beta.19 (2025-11-30)

### Maintenance
- Removed `rootUrls` from `plugin.json` to satisfy plugin validator (using command line flag for signing instead).
- Cleaned up build workflow.

## 1.1.28-beta.18 (2025-11-30)

### Maintenance
- Added `--rootUrls` flag to `yarn sign` command as a fallback for JSON configuration.

## 1.1.28-beta.17 (2025-11-30)

### Maintenance
- Fixed GitHub Action path for `package-plugin`.
- Added forced injection of `rootUrls` into `dist/plugin.json` before signing to ensure field presence.

## 1.1.28-beta.16 (2025-11-30)

### Maintenance
- Switched to manual build workflow in GitHub Actions to debug signing issues.

## 1.1.28-beta.15 (2025-11-30)

### Maintenance
- Added debug step to CI to verify `plugin.json` content.

## 1.1.28-beta.14 (2025-11-30)

### Maintenance
- Bump version to retry build process.

## 1.1.28-beta.13 (2025-11-30)

### Maintenance
- Added `rootUrls` to `plugin.json` to fix signing error for private plugin token.

## 1.1.28-beta.12 (2025-11-30)

### Maintenance
- Re-trigger release build with correct secrets configuration.

## 1.1.28-beta.11 (2025-11-30)

### Maintenance
- Fixed Github Action reference for `grafana/plugin-actions/build-plugin`.

## 1.1.28-beta.10 (2025-11-30)

### Maintenance
- Fixed yarn registry configuration to resolve installation issues in CI.
- Updated workflow configurations.

## 1.0.0 (2025-11-30)

### Features
- **Smart Flip Logic**: Numbers spin fast using a numeric drum, while text uses the full alphanumeric drum for realistic effect.
- **Animation Easing**: Added physics-based easing (acceleration/deceleration) for long flip sequences.
- **New Themes**: Added `Matrix` (digital rain), `Cyberpunk` (CRT effect), `Airport`, `Mechanical`, `Glass`, and `Neon` styles.
- **Data Aggregation**: Added selector for Last, First, Min, Max, Mean, Sum, Count value reduction.
- **Display Content**: Option to show Value, Name, or both directly on the flaps (e.g. "London 20").
- **Performance**: Added `will-change: transform` for GPU acceleration and optimized React re-renders.
- **Accessibility**: Added ARIA labels and roles for screen readers.

### Fixes
- **Thresholds**: Fixed conflict where themes overrode Grafana threshold colors (removed `!important` from styles).
- **Text Formatting**: Fixed issue where "Name + Value" ignored rounding settings (now formats numbers before combining).
- **Visual Glitches**: Fixed "TTkyo" glitch by preventing animation on disconnected DOM elements.
- **Spacing**: Added proper spacing for "Name + Value" display mode.
- **Memory**: Added cleanup logic to stop animations when panel is unmounted.
- **Timestamp**: Fixed logic to prioritize value fields over time fields.
