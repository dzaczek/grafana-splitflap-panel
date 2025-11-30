# Split Flap Panel for Grafana

![Split Flap Logo](src/img/logo.svg)

Basically, it's a retro **Split Flap** (or Solari board) display for your Grafana dashboards. Gives you that classic airport terminal vibe, but runs smooth in the browser.

## Features

### 🔄 Smart Animation
The flip logic isn't just random:
- **Numbers**: Flip fast using a numeric-only path (e.g., 1 -> 2 is quick).
- **Text**: Goes through the full alphabet cycle, just like the real mechanical ones.
- **Physics**: Long flips accelerate and then slow down at the end (easing).

### 🎨 Themes
Comes with a bunch of built-in styles so you don't have to write CSS:

| Theme | Description | Best For |
|-------|-------------|----------|
| **Classic** | Standard dark grey, flat look. | General use |
| **Classic 3D** | Like Classic but with more depth and shadows. | Realistic look |
| **Airport** | Gold text on black background. | Flight boards |
| **Mechanical** | White/Metal industrial style. | IoT / Machinery |
| **Cyberpunk** | Neon cyan with CRT scanlines. | Sci-fi dashboards |
| **Matrix** | Actual digital rain animation in the background. | Hacker vibes |
| **Neon** | Dark background with heavy text glow. | Night mode |
| **E-Ink** | High contrast, paper-like with vignette. | E-readers look |
| **Glass** | Frosted glass effect with transparency. | Modern UI |

### 📊 Data Options

| Option | What it does |
|--------|--------------|
| **Value Aggregation** | Pick what to show from the series: `Last`, `First`, `Min`, `Max`, `Mean`, etc. |
| **Main Content** | Choose what goes on the flaps: `Value`, `Name`, `Name + Value`, or `Value + Name`. |
| **Auto Fit** | Automatically calculates the best card size to fit the panel. Turn off for fixed size. |

## Examples

See the panel in action with different configurations:

### Default View
![Split Flap Panel Example](src/img/example_1.jpg)
*Shows numeric values with the classic airport look.*

## Usage

1. **Add it**: Find "Split Flap" in the visualization list.
2. **Feed it data**: Any data source works. It'll grab the last value by default.
3. **Tweak it**:
   - Change layout (Vertical/Horizontal).
   - Pick a theme that fits your dashboard.
   - Set up **Thresholds** to change colors dynamically (e.g., red when value > 80).

## Configuration

### Panel Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Layout** | Direction of the series grid (Horizontal / Vertical). | Horizontal |
| **Show Separators** | Draw lines between different series. | Off |
| **Theme** | Visual style of the flaps (see above). | Classic |
| **Show Name** | Display series name outside the flaps. | On |
| **Show Unit** | Display unit outside the flaps. | On |
| **Threshold Target** | What to colorize: Text, Tile (card background), or Panel background. | None |

### Flip Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Digits** | Minimum number of characters/cards to show. | 6 |
| **Rounding** | Decimal places for numbers. | 1 |
| **Auto Fit** | Auto-scale card size to fill the panel. | On |
| **Size (px)** | Fixed card height (if Auto Fit is off). | 50 |
| **Gap** | Space between individual cards. | 4 |
| **Speed** | Animation speed multiplier. | 0.6 |

## Installation

### Manual
1. Grab the latest release zip.
2. Unzip it into your Grafana plugins folder (usually `/var/lib/grafana/plugins`).
3. Restart Grafana.

## Dev Setup

### 1. Install

```bash
npm install
```

### 2. Run in dev mode

```bash
npm run dev
```

### 3. Build for prod

```bash
npm run build
```
