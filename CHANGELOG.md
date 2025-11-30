# Changelog

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
