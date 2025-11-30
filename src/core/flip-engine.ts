import { FlipOptions } from '../types';

const DEFAULT_CONFIG: Partial<FlipOptions> = {
    theme: 'classic',
    gap: 4,
    cardSize: 50,
    digitCount: 6,
    speed: 0.6,
    spinSpeed: 0.12,
    unitPos: 'none'
};

export class FlipSensorCard extends HTMLElement {
  private content: HTMLElement | null = null;
  private config: Partial<FlipOptions> = { ...DEFAULT_CONFIG };
  
  private currentDisplayValue: string[] = [];
  // cache value in case data arrives before dom is ready
  private cachedValue: { val: any, unit: string } | null = null;
  private lastState: string = '';
  
  // color overrides from react thresholds
  private colorOverrides: { overrideText?: string; overrideTile?: string } = {};

  // drum sequence for flip animation, order matters for smooth transitions
  // removed letters since unit is rendered outside flip area
  private drumChars = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', ':', '%', '°', '-', '/'];
  private normalSpeed = 0.6;
  private spinSpeed = 0.12;
  
  // Definicje stylów
  private themes: Record<string, any> = {
    'classic': { 
        bg: '#333', 
        text: '#f0f0f0', 
        radius: '6px', 
        shadow: '0 2px 5px rgba(0,0,0,0.4)', 
        font: "'Oswald', sans-serif", 
        border: 'none'
        // No gradients for classic
    },
    'classic-3d': { 
        bg: '#333', 
        text: '#f0f0f0', 
        radius: '6px', 
        shadow: '0 4px 8px rgba(0,0,0,0.6)', 
        font: "'Oswald', sans-serif", 
        border: 'none',
        gradientTop: 'linear-gradient(to bottom, #4a4a4a 0%, #2a2a2a 100%)',
        gradientBottom: 'linear-gradient(to bottom, #2a2a2a 0%, #4a4a4a 100%)'
    },
    'ios-light': { 
        bg: '#ffffff', 
        text: '#000000', 
        radius: '6px', 
        shadow: '0 4px 10px rgba(0,0,0,0.15)', 
        font: "-apple-system, sans-serif", 
        border: '1px solid #e0e0e0',
        gradientTop: 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)',
        gradientBottom: 'linear-gradient(to bottom, #f0f0f0 0%, #ffffff 100%)'
    },
    'ios-dark': { 
        bg: '#1c1c1e', 
        text: '#ffffff', 
        radius: '6px', 
        shadow: '0 4px 10px rgba(0,0,0,0.3)', 
        font: "-apple-system, sans-serif", 
        border: '1px solid #333',
        gradientTop: 'linear-gradient(to bottom, #2c2c2e 0%, #1c1c1e 100%)',
        gradientBottom: 'linear-gradient(to bottom, #1c1c1e 0%, #2c2c2e 100%)'
    },
    'neon': { 
        bg: '#000000', 
        text: '#39ff14', 
        radius: '0px', 
        shadow: '0 0 10px rgba(57, 255, 20, 0.2)', 
        font: "'Courier New', monospace", 
        border: '1px solid #1a1a1a',
        specialEffect: 'bloom'
    },
    'wood': { 
        bg: '#5d4037', 
        text: '#efebe9', 
        radius: '4px', 
        shadow: '0 3px 6px rgba(0,0,0,0.4)', 
        font: "'Times New Roman', serif", 
        border: '1px solid #3e2723',
        gradientTop: 'linear-gradient(to bottom, #6d4c41 0%, #4e342e 100%)',
        gradientBottom: 'linear-gradient(to bottom, #4e342e 0%, #6d4c41 100%)'
    },
    'red-3d': { 
        bg: '#b71c1c', 
        text: '#ffffff', 
        radius: '4px', 
        shadow: '0 2px 5px rgba(0,0,0,0.5)', 
        font: "'Oswald', sans-serif", 
        border: 'none',
        gradientTop: 'linear-gradient(to bottom, #c62828 0%, #b71c1c 100%)',
        gradientBottom: 'linear-gradient(to bottom, #b71c1c 0%, #c62828 100%)'
    },
    'airport': {
        bg: '#222',
        text: '#FFD700', // Gold text
        radius: '2px',
        shadow: '0 2px 4px rgba(0,0,0,0.8)',
        font: "'Roboto Mono', monospace",
        border: '1px solid #111',
        gradientTop: 'linear-gradient(to bottom, #333 0%, #222 100%)',
        gradientBottom: 'linear-gradient(to bottom, #222 0%, #333 100%)'
    },
    'cyberpunk': {
        bg: '#050505',
        text: '#00ffea', // Cyan neon
        radius: '0px',
        shadow: '0 0 15px rgba(0, 255, 234, 0.4)',
        font: "'Courier New', monospace",
        border: '1px solid #00ffea',
        gradientTop: 'linear-gradient(180deg, rgba(0,255,234,0.1) 0%, rgba(0,0,0,0) 100%)',
        gradientBottom: 'none',
        specialEffect: 'crt'
    },
    'mechanical': {
        bg: '#d4d4d4',
        text: '#222',
        radius: '3px',
        shadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.3)',
        font: "'Oswald', sans-serif",
        border: '1px solid #999',
        gradientTop: 'linear-gradient(to bottom, #f0f0f0 0%, #d4d4d4 100%)',
        gradientBottom: 'linear-gradient(to bottom, #d4d4d4 0%, #b0b0b0 100%)'
    },
    'e-ink': {
        bg: '#f4f4f4',
        text: '#111',
        radius: '1px',
        shadow: 'none',
        font: "'Georgia', serif",
        border: '2px solid #111',
        gradientTop: 'none',
        gradientBottom: 'none',
        specialEffect: 'vignette'
    },
    'blue-glass': {
        bg: 'rgba(0, 60, 255, 0.8)',
        text: '#fff',
        radius: '8px',
        shadow: '0 4px 15px rgba(0, 60, 255, 0.4)',
        font: "-apple-system, sans-serif",
        border: '1px solid rgba(255,255,255,0.3)',
        gradientTop: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        gradientBottom: 'linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
    },
    'rainbow': {
        bg: '#1a1a1a',
        text: '#fff',
        radius: '6px',
        shadow: '0 4px 12px rgba(0,0,0,0.5)',
        font: "'Oswald', sans-serif",
        border: 'none',
        gradientTop: 'linear-gradient(180deg, #ff0000 0%, #ff7f00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
        gradientBottom: 'linear-gradient(0deg, #ff0000 0%, #ff7f00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
        specialEffect: 'rainbow'
    },
    'newspaper': {
        bg: '#f5f5dc', // Beige/cream paper color
        text: '#1a1a1a',
        radius: '2px',
        shadow: '0 2px 4px rgba(0,0,0,0.2)',
        font: "'Times New Roman', serif",
        border: '1px solid #ccc',
        gradientTop: 'none',
        gradientBottom: 'none',
        specialEffect: 'halftone'
    },
    'glass': {
        bg: 'rgba(255, 255, 255, 0.1)',
        text: '#fff',
        radius: '12px',
        shadow: '0 8px 32px rgba(0,0,0,0.3)',
        font: "-apple-system, sans-serif",
        border: '1px solid rgba(255,255,255,0.2)',
        gradientTop: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
        gradientBottom: 'linear-gradient(0deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        specialEffect: 'glass'
    },
    'matrix': {
        bg: '#020b02',
        text: '#00ff41',
        radius: '0px',
        shadow: '0 0 10px rgba(0, 255, 65, 0.35)',
        font: "'Courier New', monospace",
        border: '1px solid rgba(0, 255, 65, 0.4)',
        specialEffect: 'matrix'
    }
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // fires when element hits the page, fixes empty start issue
  connectedCallback() {
    requestAnimationFrame(() => {
        if (!this.content) {
            this.render();
            this.applyThemeVariables();
        }
        
        // if react sent data before we were ready, show it now
        if (this.cachedValue) {
            this.updateDisplayLogic(this.cachedValue.val, this.cachedValue.unit, true);
        }
    });
  }

  public setConfig(config: FlipOptions) {
    this.config = { ...this.config, ...config };
    this.normalSpeed = config.speed !== undefined ? config.speed : 0.6;
    this.spinSpeed = config.spinSpeed !== undefined ? config.spinSpeed : 0.12;
    
    if (this.content) {
       this.applyThemeVariables(); 
       // update data-effect on existing units when theme changes
       const themeName = this.config.theme || 'classic';
       const t = this.themes[themeName] || this.themes['classic'];
       const units = this.content.querySelectorAll('.flip-unit');
       units.forEach((unit: Element) => {
         if (t.specialEffect) {
           unit.setAttribute('data-effect', t.specialEffect);
         } else {
           unit.removeAttribute('data-effect');
         }
       });
    } else {
       this.render();
       this.applyThemeVariables();
    }
  }

  public updateColors(overrides: { overrideText?: string; overrideTile?: string }) {
    this.colorOverrides = overrides;
    this.applyThemeVariables();
  }

  public setValue(value: any, unitFromData: string) {
    this.cachedValue = { val: value, unit: unitFromData };
    
    // if dom not ready yet, connectedCallback will handle it
    if (!this.content) return;

    this.updateDisplayLogic(value, unitFromData, false);
  }

  private updateDisplayLogic(value: any, unitFromData: string, forceNoAnim: boolean) {
    let displayString = "";
    if (typeof value === 'number') {
        const decimals = this.config.rounding !== undefined ? this.config.rounding : 1;
        displayString = value.toFixed(decimals);
    } else if (value !== undefined && value !== null) {
        displayString = String(value);
    }
    
    // react handles unit separately now, so unitFromData is usually empty
    if (this.config.unitPos === 'none' && unitFromData) {
      displayString += unitFromData;
    }

    if (forceNoAnim || !this.lastState) {
       this.updateDisplay(displayString, true);
       this.lastState = displayString;
    } else if (displayString !== this.lastState) {
       this.lastState = displayString;
       this.updateDisplay(displayString, false);
    }
  }

  // apply theme colors and overrides to css variables
  private applyThemeVariables() {
      if (!this.shadowRoot) return;
      const themeName = this.config.theme || 'classic';
      const t = this.themes[themeName] || this.themes['classic'];
      
      const finalBg = this.colorOverrides.overrideTile ? this.colorOverrides.overrideTile : t.bg;
      const finalText = this.colorOverrides.overrideText ? this.colorOverrides.overrideText : t.text;

      this.style.setProperty('--flip-bg', finalBg);
      this.style.setProperty('--flip-text', finalText);
      this.style.setProperty('--flip-border-radius', t.radius);
      this.style.setProperty('--flip-shadow', t.shadow);
      this.style.setProperty('--flip-font', t.font);
      this.style.setProperty('--flip-border', t.border);
      this.style.setProperty('--flip-gradient-top', t.gradientTop || 'none');
      this.style.setProperty('--flip-gradient-bottom', t.gradientBottom || 'none');
      
      // special effects
      if (t.specialEffect) {
        this.style.setProperty('--flip-special-effect', t.specialEffect);
      } else {
        this.style.setProperty('--flip-special-effect', 'none');
      }
      
      // sizes
      this.style.setProperty('--card-size', `${this.config.cardSize}px`);
      this.style.setProperty('--flip-gap', `${this.config.gap}px`);
  }

  private render() {
    if (!this.shadowRoot) return;
    
    // prevent double rendering
    if (this.shadowRoot.getElementById('display')) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');

        :host { 
            display: block; 
            /* card-size set via style attribute */
            --card-width: calc(var(--card-size) * 0.70); 
            --font-size: calc(var(--card-size) * 0.85); 
            --flip-duration: 0.5s;
        }

        .flip-clock { 
            display: flex; 
            justify-content: center; 
            gap: var(--flip-gap); 
            perspective: 1000px; 
            font-family: var(--flip-font);
            transform-style: preserve-3d;
        }
        
        .flip-unit { 
            position: relative; 
            width: var(--card-width);
            height: var(--card-size); 
            background-color: var(--flip-bg); 
            color: var(--flip-text);          
            border-radius: var(--flip-border-radius); 
            font-weight: bold; 
            font-size: var(--font-size); 
            line-height: var(--card-size); 
            text-align: center; 
            box-shadow: var(--flip-shadow);
            border: var(--flip-border);
            transition: background-color 0.3s ease, color 0.3s ease;
            transform-style: preserve-3d;
        }
        
        /* glass blur effect */
        .flip-unit[data-effect="glass"] {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        /* neon glow effect */
        .flip-unit[data-effect="bloom"] {
            text-shadow: 0 0 10px var(--flip-text), 0 0 20px var(--flip-text);
        }
        
        /* crt scanline overlay */
        .flip-unit[data-effect="crt"] {
             position: relative;
             overflow: hidden;
        }
        .flip-unit[data-effect="crt"]::after {
             content: " ";
             display: block;
             position: absolute;
             top: 0; left: 0; bottom: 0; right: 0;
             background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
             background-size: 100% 2px, 6px 100%;
             pointer-events: none;
             z-index: 10;
             border-radius: inherit;
        }

        /* vignette darkening at edges */
        .flip-unit[data-effect="vignette"] {
             position: relative;
        }
        .flip-unit[data-effect="vignette"]::after {
             content: "";
             position: absolute;
             top: 0; left: 0; right: 0; bottom: 0;
             background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%);
             pointer-events: none;
             z-index: 10;
             border-radius: inherit;
        }

        /* matrix effect - animated digital rain background */
        .flip-unit[data-effect="matrix"] {
            position: relative;
            overflow: hidden;
            background-color: #020b02 !important;
            color: #9eff79;
            text-shadow: 0 0 6px rgba(0, 255, 65, 0.9);
            border-color: rgba(0, 255, 65, 0.4);
        }
        .flip-unit[data-effect="matrix"]::before {
            content: "ｱｲｳｴｵｶｷｸｹｺﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ01LpxZ#$%={}<>?!/\\+-";
            position: absolute;
            top: -180%;
            left: 0;
            right: 0;
            height: 480%;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.35;
            color: rgba(0, 255, 65, 0.35);
            text-shadow: 0 0 6px rgba(0, 255, 65, 0.85);
            writing-mode: vertical-rl;
            text-orientation: upright;
            letter-spacing: 6px;
            animation: matrix-fall 4.5s linear infinite;
            pointer-events: none;
            z-index: 0;
        }
        .flip-unit[data-effect="matrix"]::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0, 255, 65, 0.18), rgba(2, 11, 2, 0));
            mix-blend-mode: screen;
            opacity: 0.5;
            animation: matrix-pulse 3s ease-in-out infinite;
            pointer-events: none;
            z-index: 1;
        }
        .flip-unit[data-effect="matrix"] .top,
        .flip-unit[data-effect="matrix"] .bottom,
        .flip-unit[data-effect="matrix"] .flap {
            position: relative;
            z-index: 2;
            background-color: transparent;
        }

        @keyframes matrix-fall {
            0% { transform: translateY(-5%); opacity: 0.75; }
            50% { opacity: 0.95; }
            100% { transform: translateY(40%); opacity: 0.7; }
        }

        @keyframes matrix-pulse {
            0% { opacity: 0.35; }
            50% { opacity: 0.1; }
            100% { opacity: 0.35; }
        }

        /* halftone dot pattern */
        .flip-unit[data-effect="halftone"] {
            background-color: var(--flip-bg);
            position: relative;
        }
        
        .flip-unit[data-effect="halftone"]::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle, rgba(0,0,0,0.12) 0.7px, transparent 0.7px),
                radial-gradient(circle, rgba(0,0,0,0.12) 0.7px, transparent 0.7px);
            background-size: 4px 4px, 4px 4px;
            background-position: 0 0, 2px 2px;
            pointer-events: none;
            z-index: 0;
            border-radius: inherit;
        }
        
        /* keep content above halftone pattern */
        .flip-unit[data-effect="halftone"] .top {
            z-index: 1;
        }
        .flip-unit[data-effect="halftone"] .bottom {
            z-index: 1;
        }
        .flip-unit[data-effect="halftone"] .flap.front {
            z-index: 2;
        }
        .flip-unit[data-effect="halftone"] .flap.back {
            z-index: 3;
        }
        
        .top, .bottom, .flap { position: absolute; left: 0; width: 100%; height: 50%; overflow: hidden; backface-visibility: hidden; }
        
        /* top half with gradient down */
        .top, .flap.front { 
            top: 0; 
            background: var(--flip-bg);
            background-image: var(--flip-gradient-top);
            border-radius: var(--flip-border-radius) var(--flip-border-radius) 0 0; 
            border-bottom: 1px solid rgba(0,0,0,0.3); 
        }
        
        .top { z-index: 1; }
        .flap.front { transform-origin: bottom; z-index: 2; }

        /* bottom half with gradient up */
        .bottom, .flap.back { 
            bottom: 0; 
            background: var(--flip-bg);
            background-image: var(--flip-gradient-bottom);
            border-radius: 0 0 var(--flip-border-radius) var(--flip-border-radius); 
        }

        .bottom { z-index: 0; }
        
        /* halftone needs bottom above pattern */
        .flip-unit[data-effect="halftone"] .bottom {
            z-index: 1;
        }
        .flap.back { top: 50%; transform-origin: top; transform: rotateX(180deg); z-index: 3; }
        
        /* inner shadow for depth */
        .top::after {
            content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 1px;
            background: rgba(0,0,0,0.15);
        }
        .bottom::after {
            content: ""; position: absolute; left: 0; top: 0; width: 100%; height: 1px;
            background: rgba(255,255,255,0.05);
        }
        
        .top::before, .bottom::before, .flap::before { content: attr(data-val); position: absolute; left: 0; width: 100%; height: 200%; }
        .top::before, .flap.front::before { top: 0; } .bottom::before, .flap.back::before { top: -100%; }
        
        .flip-unit.flipping .flap.front { animation: flipDownFront var(--flip-duration) ease-in forwards; }
        .flip-unit.flipping .flap.back { animation: flipDownBack var(--flip-duration) ease-out forwards; }
        
        /* gpu hint for smooth animation */
        .flap { will-change: transform; }
        
        @keyframes flipDownFront { 
            0% { transform: rotateX(0deg); } 
            100% { transform: rotateX(-180deg); } 
        }
        @keyframes flipDownBack { 
            0% { transform: rotateX(180deg); } 
            100% { transform: rotateX(0deg); } 
        }
      </style>

      <div id="display" class="flip-clock"></div>
    `;
    this.content = this.shadowRoot.getElementById('display') as HTMLElement;
    this.currentDisplayValue = [];
    this.applyThemeVariables();
  }
  
  disconnectedCallback() {
    // cleanup if needed
  }

  private createDigitUnit(char: string): HTMLElement {
    const unit = document.createElement('div');
    unit.className = 'flip-unit';
    const themeName = this.config.theme || 'classic';
    const t = this.themes[themeName] || this.themes['classic'];
    if (t.specialEffect) {
      unit.setAttribute('data-effect', t.specialEffect);
    }
    unit.innerHTML = `
      <div class="top" data-val="${char}"></div>
      <div class="bottom" data-val="${char}"></div>
      <div class="flap front" data-val="${char}"></div>
      <div class="flap back" data-val="${char}"></div>
    `;
    return unit;
  }

  // add or remove cards as needed
  private async updateDisplay(inputRaw: string, skipAnimation: boolean) {
    if (!this.content) return;
    const input = String(inputRaw);
    
    // figure out how many cards we need
    const targetLen = Math.max(input.length, this.config.digitCount || 4);
    
    // add cards if missing
    while (this.content.children.length < targetLen) {
        const blank = this.createDigitUnit(' ');
        this.content.insertBefore(blank, this.content.firstChild);
        this.currentDisplayValue.unshift(' ');
    }

    // remove extra cards
    while (this.content.children.length > targetLen) {
        if (this.content.firstElementChild) {
            this.content.removeChild(this.content.firstElementChild);
            this.currentDisplayValue.shift();
        }
    }

    const paddedInput = input.padStart(targetLen, ' ');
    const targetChars = paddedInput.split('');
    const units = Array.from(this.content.children) as HTMLElement[];

    if (skipAnimation) {
        targetChars.forEach((char, i) => {
            if(units[i]) {
                this.updateStatic(units[i], char);
                this.currentDisplayValue[i] = char;
            }
        });
        return;
    }

    const promises = targetChars.map((targetChar, index) => {
      const unit = units[index];
      if (!unit) return Promise.resolve();
      const currentChar = this.currentDisplayValue[index] || ' ';
      if (currentChar === targetChar) return Promise.resolve();
      return this.spinDigit(unit, currentChar, targetChar, index);
    });

    await Promise.all(promises);
  }

  private updateStatic(unit: HTMLElement, char: string) {
    // safety check
    if (!this.isConnected) return;
    const setVal = (sel: string) => unit.querySelector(sel)?.setAttribute('data-val', char);
    setVal('.top'); setVal('.bottom'); setVal('.flap.front'); setVal('.flap.back');
  }

  private async spinDigit(element: HTMLElement, startChar: string, endChar: string, index: number) {
    if (!this.isConnected) return;
    let current = startChar;
    let safety = 0;
    
    let startIndex = this.drumChars.indexOf(startChar);
    let endIndex = this.drumChars.indexOf(endChar);
    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = 0;
    
    let distance = endIndex - startIndex;
    if (distance < 0) distance += this.drumChars.length;
    
    const useSpeed = (distance === 1) ? this.normalSpeed : this.spinSpeed;

    if (!this.drumChars.includes(endChar)) {
        this.updateStatic(element, endChar);
        this.currentDisplayValue[index] = endChar;
        return;
    }

    while (current !== endChar && safety < 30) {
      if (!this.isConnected) break; // stop if detached

      let idx = this.drumChars.indexOf(current);
      let nextIdx = (idx + 1) % this.drumChars.length;
      let nextChar = this.drumChars[nextIdx];
      await this.flipOnce(element, current, nextChar, useSpeed);
      current = nextChar;
      this.currentDisplayValue[index] = current;
      safety++;
    }
  }

  private flipOnce(element: HTMLElement, oldChar: string, newChar: string, duration: number) {
    return new Promise<void>(resolve => {
        if (!this.isConnected) { resolve(); return; }

        const top = element.querySelector('.top');
        const bottom = element.querySelector('.bottom');
        const flapFront = element.querySelector('.flap.front');
        const flapBack = element.querySelector('.flap.back');
        if(!top || !bottom || !flapFront || !flapBack) { resolve(); return; }

        element.style.setProperty('--flip-duration', duration + 's');
        top.setAttribute('data-val', newChar);
        bottom.setAttribute('data-val', oldChar);
        flapFront.setAttribute('data-val', oldChar);
        flapBack.setAttribute('data-val', newChar);

        element.classList.remove('flipping');
        void element.offsetWidth;
        element.classList.add('flipping');

        setTimeout(() => {
            bottom.setAttribute('data-val', newChar);
            flapFront.setAttribute('data-val', newChar);
            element.classList.remove('flipping');
            resolve();
        }, duration * 1000);
    });
  }
}

if (!customElements.get('flip-sensor-card')) {
  customElements.define('flip-sensor-card', FlipSensorCard);
}
