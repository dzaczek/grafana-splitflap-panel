# Changelog

## 2.2.1 (2026-01-08)

### Fixes
- **CI/CD**: Fixed dependency installation issues in GitHub Actions by switching `react-data-grid` to HTTPS protocol.
- **Linting**: Fixed missing dependency in `useEffect` hook in `FlipDigit` component.

---

## 2.2.0 (2026-01-08)

### Features
- **AM/PM Customization**: Added full control over AM/PM indicator in 12-hour clock mode:
  - **Position**: Can be placed Left, Right, or Inline (In Text).
  - **Orientation**: Support for Vertical (stacked characters) or Horizontal layout.
  - **Styling**: Independent control over font size and gap/spacing.
  - **Independent Rendering**: AM/PM is now rendered as a separate FlipDisplay component even in "In Text" mode, allowing for consistent styling and animation.

### Improvements
- **Clock Logic**: Optimized clock animation to use a dedicated 0-9 numeric drum for seconds/minutes, eliminating lag and "scrolling" through special characters during time changes.
- **Layout**: Improved layout engine for FlipItem to better handle "shrink-wrap" sizing, ensuring the clock stays centered regardless of timezone or AM/PM alignment.

---

## 2.1.38 (2025-12-12)

### Fixes
- **Flip Animation Logic**: Fixed a synchronization issue where the bottom half of the digit changed too early (before the flap finished falling). Now implements correct split-flap physics:
  - Top half reveals the new character immediately.
  - Bottom half keeps the old character until covered by the falling flap.
  - Falling flap transitions from old character (front) to new character (back).
- **Animation Speed**: Adjusted default flip duration from 0.6s to 0.49s for snappier, more realistic mechanical movement.

### Documentation
- **Intro Rewrite**: Made the README introduction more accessible and developer-friendly.

---

## 2.1.37 (2025-12-12)

### Summary
This release represents a major evolution of the Split Flap Panel, with significant improvements across security, architecture, themes, and documentation. The journey from 1.1.31 to 2.1.37 has been organized into three main development stages:

1. **Etap 1: Security & Architecture Overhaul (1.1.32)** - Complete security hardening and React migration
2. **Etap 2: Theme Expansion & Visual Enhancements (1.2.x - 2.0.x)** - Major theme expansion from 9 to 22 themes
3. **Etap 3: Final Polish & Documentation (2.1.x)** - Comprehensive documentation updates

### Statistics
- **Themes**: Expanded from 9 to 22 themes (+144% increase)
- **Security**: Eliminated all XSS vulnerabilities, full CSP compliance
- **Code Quality**: Migrated 754 lines of legacy code to modern React architecture
- **Documentation**: Complete rewrite covering all features and options

### Statistics
- **Themes**: Expanded from 9 to 22 themes (+144% increase)
- **Security**: Eliminated all XSS vulnerabilities, full CSP compliance
- **Code Quality**: Migrated 754 lines of legacy code to modern React architecture
- **Documentation**: Complete rewrite covering all features and options

### Documentation
- **Complete README overhaul**: Comprehensive update documenting all 22 available themes, all configuration options, Clock Mode features, and layout customization options
- **CHANGELOG expansion**: Added detailed changelog entries for all versions from 1.1.31 to 2.1.37, organized by development stages
- **Configuration documentation**: Fully documented Clock Mode options (time separator, date format, day of week)
- **Layout documentation**: Complete documentation of name and unit positioning, alignment, rotation, and font size options
- **Animation documentation**: Added Fast Speed option documentation

---

## Etap 3: Final Polish & Documentation (2.1.x)

### 2.1.32 (2025-12-08)

#### Documentation
- **Complete README update**: Added all 22 available themes to documentation with descriptions and use cases:
  - Aviation themes (Departure, Cockpit, Tarmac)
  - Swiss SBB themes (Black, White, Blue)
  - iOS themes (Light, Dark)
  - Specialty themes (Wood, Red 3D, Blue Glass, Rainbow, Newspaper)
- **Configuration options**: Documented all Clock Mode options:
  - Time separator options (Colon, Dot, Dash, Space, None)
  - Date format options (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD.MM.YYYY)
  - Day of week display option
- **Layout options**: Documented name and unit positioning, alignment, rotation, and font size options
- **Animation options**: Added Fast Speed option documentation
- **Data options**: Documented value aggregation, main content display modes, and auto-fit functionality

---

## Etap 2: Theme Expansion & Visual Enhancements (1.2.x - 2.0.x)

### 2.0.0 (2025-12-04)

#### Features
- **Major Theme Expansion**: Added 13 new professional themes bringing total to 22 themes:
  - **Aviation Collection** (3 themes):
    - `aviation-departure`: Classic airport board style with yellow text (`#f7d100`) on black background, uses Oswald font
    - `aviation-cockpit`: Technical instrument style with cyan text (`#00ffcc`) on dark gray, uses Share Tech Mono font
    - `aviation-tarmac`: Orange/amber high-visibility style (`#fdcb6e`) for ground operations
  - **Swiss SBB Collection** (3 themes):
    - `swiss-sbb-black`: Black background with white text
    - `swiss-sbb-white`: White background with black text
    - `swiss-sbb-blue`: Dark blue with red border (added in 1.2.0)
  - **iOS Collection** (2 themes):
    - `ios-light`: Apple iOS light mode style with white background
    - `ios-dark`: Apple iOS dark mode style with dark background
  - **Specialty Themes** (5 themes):
    - `wood`: Natural wooden texture with brown tones
    - `red-3d`: Red 3D gradient style for alerts/warnings
    - `blue-glass`: Blue-tinted glass effect with transparency
    - `rainbow`: Colorful gradient display with rainbow effect
    - `newspaper`: Halftone newspaper print style with vintage look

#### Improvements
- **Font System**: Updated logo and theme fonts to use system fonts for improved cross-platform compatibility
  - Aviation themes automatically load Google Fonts (Oswald, Share Tech Mono) when available
  - Graceful fallback to system fonts for offline/air-gapped environments
- **Theme Organization**: Better categorization and naming of themes for easier discovery
- **Visual Polish**: Enhanced gradients, shadows, and effects across all new themes

### 1.2.0 (2025-12-11)

#### Features
- **Swiss SBB Blue Theme**: Added official Swiss railway blue theme (`swiss-sbb-blue`) with:
  - Dark blue background (`#0B1E3C`)
  - White text
  - Red border accent (`#EB0000`) matching SBB branding
  - Gradient effects for depth

#### Improvements
- **Theme Refinements**: Improved visual consistency across all themes
- **Theme Organization**: Better categorization of themes in the selector

---

## Etap 1: Security & Architecture Overhaul (1.1.32)

#### 1.1.32 (2025-12-11)

#### Security
- **XSS Protection**: Removed XSS vulnerabilities by replacing `innerHTML` (lines 328, 584 in old flip-engine) with React rendering
- **Character Escaping**: Added character escaping in FlipDigit to only allow safe characters (numbers, letters, and specific symbols)
- **Safe DOM Updates**: All DOM updates now use React's safe rendering mechanisms

#### CSP Compatibility
- **Removed Google Fonts**: Removed Google Fonts `@import` statements (lines 330-331) that violated Content Security Policy
- **System Font Fallbacks**: Replaced with system font fallbacks (e.g., `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `sans-serif`)
- **Local Fonts Only**: All fonts now use local/system fonts that work with strict CSP policies

#### Architecture Overhaul
- **React Migration**: Complete migration from custom elements to React components
  - Created `FlipDigit.tsx` — React component for individual flip digits with animation logic
  - Created `FlipDisplay.tsx` — Component managing multiple digits
  - Removed custom element (`FlipSensorCard`) in favor of React components
  - Updated `FlipBoard.tsx` to use the new React components
- **Styling Modernization**: 
  - Converted all styles to Emotion CSS-in-JS (Grafana best practice)
  - Removed shadow DOM and inline styles
  - All themes preserved with the same visual appearance
- **Code Cleanup**: 
  - Removed deprecated `src/core/flip-engine.ts` (754 lines removed)
  - Removed duplicate `src/core/flip-engine.tx` file
  - Improved code organization and maintainability

#### Impact
- **Security**: Plugin is now safe from XSS attacks and CSP-compliant
- **Maintainability**: React-based architecture is easier to maintain and extend
- **Performance**: Better React optimization and rendering performance
- **Compatibility**: Works in environments with strict CSP policies

## 1.1.31 (2025-11-30)

### Maintenance
- Fixed incorrect path for `grafana/plugin-actions/build-plugin` in release workflow (reverted to explicit tag path).

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
