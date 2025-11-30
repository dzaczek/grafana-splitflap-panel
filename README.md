# Split Flap Panel for Grafana

![Split Flap Logo](src/img/logo.svg)

A retro-style **Split Flap** (or Solari board) display panel for Grafana. This plugin brings the classic aesthetic of airport arrival/departure boards to your dashboards.

## Features

- **Retro Animation**: Realistic flip animation for characters and numbers.
- **Auto-Scaling**: Automatically resizes tiles to fit the panel dimensions.
- **Multi-Series Support**: Displays multiple data series in a grid (horizontal or vertical layout).
- **Threshold Integration**: Changes text or tile color based on data thresholds.
- **Customizable**:
  - 6 Visual Themes (Classic, iOS Light/Dark, Neon, Wood, Red)
  - Adjustable speed and layout
  - Custom units and labels positioning

## Usage

1. **Add the panel**: Select "Split Flap" from the visualization list.
2. **Query Data**: The panel expects a single value per series (last value). It works best with gauges, counters, or status codes.
3. **Customize**:
   - **Layout**: Choose Vertical or Horizontal alignment for multiple series.
   - **Theme**: Pick a visual style that fits your dashboard.
   - **Dimensions**: Enable "Auto Fit" for responsive sizing or set fixed "Size (px)".
   - **Thresholds**: Configure standard Grafana thresholds to colorize text or tiles.

## Installation

### From Grafana Catalog
(Coming soon)

### Manual Installation
1. Download the latest release zip.
2. Extract into your Grafana plugins directory (usually `/var/lib/grafana/plugins`).
3. Restart Grafana.

## Development

### 1. Install dependencies

```bash
npm install
```

### 2. Build plugin in development mode

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Run tests

```bash
npm run test
```
