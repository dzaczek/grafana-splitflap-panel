import React, { useState, useEffect, useRef, useMemo } from 'react';
import { css, cx, keyframes } from '@emotion/css';
import { FlipOptions } from '../types';

interface FlipDigitProps {
  char: string;
  config: FlipOptions;
  colorOverrides?: { overrideText?: string; overrideTile?: string };
  skipAnimation?: boolean;
}

// Theme definitions (moved from flip-engine)
const themes: Record<string, any> = {
  classic: {
    bg: '#333',
    text: '#f0f0f0',
    radius: '6px',
    shadow: '0 2px 5px rgba(0,0,0,0.4)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: 'none',
  },
  'classic-3d': {
    bg: '#333',
    text: '#f0f0f0',
    radius: '6px',
    shadow: '0 4px 8px rgba(0,0,0,0.6)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: 'none',
    gradientTop: 'linear-gradient(to bottom, #4a4a4a 0%, #2a2a2a 100%)',
    gradientBottom: 'linear-gradient(to bottom, #2a2a2a 0%, #4a4a4a 100%)',
  },
  'aviation-departure': {
    bg: '#1a1a1a',
    text: '#f7d100', // Classic departure board yellow
    radius: '2px',
    shadow: '0 1px 3px rgba(0,0,0,0.9)',
    font: "'Oswald', 'Impact', 'Arial Narrow', sans-serif",
    border: '1px solid #000',
    gradientTop: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
    gradientBottom: 'linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 100%)',
  },
  'aviation-cockpit': {
    bg: '#1c2526',
    text: '#00ffcc', // Cyan instrument color
    radius: '4px',
    shadow: 'inset 0 0 5px rgba(0,255,204,0.1)',
    font: "'Share Tech Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
    border: '1px solid #2f3e40',
    gradientTop: 'linear-gradient(to bottom, #263335 0%, #1c2526 100%)',
    gradientBottom: 'linear-gradient(to bottom, #1c2526 0%, #263335 100%)',
  },
  'aviation-tarmac': {
    bg: '#2d3436',
    text: '#fdcb6e', // Orange/Amber high vis
    radius: '3px',
    shadow: '0 2px 4px rgba(0,0,0,0.5)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: '1px solid #636e72',
    gradientTop: 'linear-gradient(to bottom, #3d4648 0%, #2d3436 100%)',
    gradientBottom: 'linear-gradient(to bottom, #2d3436 0%, #3d4648 100%)',
  },
  'swiss-sbb-black': {
    bg: '#000000',
    text: '#ffffff',
    radius: '1px',
    shadow: '0 1px 2px rgba(0,0,0,0.8)',
    font: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    border: 'none',
    gradientTop: 'linear-gradient(to bottom, #111 0%, #000 100%)',
    gradientBottom: 'linear-gradient(to bottom, #000 0%, #111 100%)',
  },
  'swiss-sbb-white': {
    bg: '#ffffff',
    text: '#000000',
    radius: '1px',
    shadow: '0 1px 3px rgba(0,0,0,0.2)',
    font: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    border: '1px solid #e0e0e0',
    gradientTop: 'linear-gradient(to bottom, #fff 0%, #f7f7f7 100%)',
    gradientBottom: 'linear-gradient(to bottom, #f7f7f7 0%, #fff 100%)',
  },
  'swiss-sbb-blue': {
    bg: '#0B1E3C', // SBB Dark Blue
    text: '#ffffff',
    radius: '1px',
    shadow: '0 1px 3px rgba(0,0,0,0.5)',
    font: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    border: '1px solid #EB0000', // SBB Red border
    gradientTop: 'linear-gradient(to bottom, #152244 0%, #0B1E3C 100%)',
    gradientBottom: 'linear-gradient(to bottom, #0B1E3C 0%, #152244 100%)',
  },
  'ios-light': {
    bg: '#ffffff',
    text: '#000000',
    radius: '6px',
    shadow: '0 4px 10px rgba(0,0,0,0.15)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: '1px solid #e0e0e0',
    gradientTop: 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)',
    gradientBottom: 'linear-gradient(to bottom, #f0f0f0 0%, #ffffff 100%)',
  },
  'ios-dark': {
    bg: '#1c1c1e',
    text: '#ffffff',
    radius: '6px',
    shadow: '0 4px 10px rgba(0,0,0,0.3)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: '1px solid #333',
    gradientTop: 'linear-gradient(to bottom, #2c2c2e 0%, #1c1c1e 100%)',
    gradientBottom: 'linear-gradient(to bottom, #1c1c1e 0%, #2c2c2e 100%)',
  },
  neon: {
    bg: '#000000',
    text: '#39ff14',
    radius: '0px',
    shadow: '0 0 10px rgba(57, 255, 20, 0.2)',
    font: "'Courier New', 'Courier', monospace",
    border: '1px solid #1a1a1a',
    specialEffect: 'bloom',
  },
  wood: {
    bg: '#5d4037',
    text: '#efebe9',
    radius: '4px',
    shadow: '0 3px 6px rgba(0,0,0,0.4)',
    font: "'Times New Roman', 'Times', serif",
    border: '1px solid #3e2723',
    gradientTop: 'linear-gradient(to bottom, #6d4c41 0%, #4e342e 100%)',
    gradientBottom: 'linear-gradient(to bottom, #4e342e 0%, #6d4c41 100%)',
  },
  'red-3d': {
    bg: '#b71c1c',
    text: '#ffffff',
    radius: '4px',
    shadow: '0 2px 5px rgba(0,0,0,0.5)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: 'none',
    gradientTop: 'linear-gradient(to bottom, #c62828 0%, #b71c1c 100%)',
    gradientBottom: 'linear-gradient(to bottom, #b71c1c 0%, #c62828 100%)',
  },
  airport: {
    bg: '#222',
    text: '#FFD700',
    radius: '2px',
    shadow: '0 2px 4px rgba(0,0,0,0.8)',
    font: "'Courier New', 'Courier', monospace",
    border: '1px solid #111',
    gradientTop: 'linear-gradient(to bottom, #333 0%, #222 100%)',
    gradientBottom: 'linear-gradient(to bottom, #222 0%, #333 100%)',
  },
  cyberpunk: {
    bg: '#050505',
    text: '#00ffea',
    radius: '0px',
    shadow: '0 0 15px rgba(0, 255, 234, 0.4)',
    font: "'Courier New', 'Courier', monospace",
    border: '1px solid #00ffea',
    gradientTop: 'linear-gradient(180deg, rgba(0,255,234,0.1) 0%, rgba(0,0,0,0) 100%)',
    gradientBottom: 'none',
    specialEffect: 'crt',
  },
  mechanical: {
    bg: '#d4d4d4',
    text: '#222',
    radius: '3px',
    shadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.3)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: '1px solid #999',
    gradientTop: 'linear-gradient(to bottom, #f0f0f0 0%, #d4d4d4 100%)',
    gradientBottom: 'linear-gradient(to bottom, #d4d4d4 0%, #b0b0b0 100%)',
  },
  'e-ink': {
    bg: '#f4f4f4',
    text: '#111',
    radius: '1px',
    shadow: 'none',
    font: "'Georgia', 'Times New Roman', serif",
    border: '2px solid #111',
    gradientTop: 'none',
    gradientBottom: 'none',
    specialEffect: 'vignette',
  },
  'blue-glass': {
    bg: 'rgba(0, 60, 255, 0.8)',
    text: '#fff',
    radius: '8px',
    shadow: '0 4px 15px rgba(0, 60, 255, 0.4)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: '1px solid rgba(255,255,255,0.3)',
    gradientTop: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
    gradientBottom: 'linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
  },
  rainbow: {
    bg: '#1a1a1a',
    text: '#fff',
    radius: '6px',
    shadow: '0 4px 12px rgba(0,0,0,0.5)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: 'none',
    gradientTop: 'linear-gradient(180deg, #ff0000 0%, #ff7f00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
    gradientBottom: 'linear-gradient(0deg, #ff0000 0%, #ff7f00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
    specialEffect: 'rainbow',
  },
  newspaper: {
    bg: '#f5f5dc',
    text: '#1a1a1a',
    radius: '2px',
    shadow: '0 2px 4px rgba(0,0,0,0.2)',
    font: "'Times New Roman', 'Times', serif",
    border: '1px solid #ccc',
    gradientTop: 'none',
    gradientBottom: 'none',
    specialEffect: 'halftone',
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.1)',
    text: '#fff',
    radius: '12px',
    shadow: '0 8px 32px rgba(0,0,0,0.3)',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: '1px solid rgba(255,255,255,0.2)',
    gradientTop: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
    gradientBottom: 'linear-gradient(0deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
    specialEffect: 'glass',
  },
  matrix: {
    bg: '#020b02',
    text: '#00ff41',
    radius: '0px',
    shadow: '0 0 10px rgba(0, 255, 65, 0.35)',
    font: "'Courier New', 'Courier', monospace",
    border: '1px solid rgba(0, 255, 65, 0.4)',
    specialEffect: 'matrix',
  },
};

// Drum sequences for flip animation
const DRUM_CHARS = [
  ' ',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '.',
  ',',
  ':',
  '%',
  '°',
  '-',
  '/',
];

const DRUM_CHARS_NUMERIC = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', ':', '%', '°', '-', '/'];
const DRUM_CHARS_STRICT_NUMERIC = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const DRUM_CHARS_CLOCK = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Safe character escaping for React rendering
const escapeChar = (char: string): string => {
  if (char === ' ') { return ' '; }
  // Only allow safe characters - numbers, letters, and specific symbols
  const safeChars = /^[0-9A-Za-z.,:%°\-\/]$/;
  if (safeChars.test(char)) {
    return char;
  }
  return ' '; // Fallback to space for unsafe characters
};

export const FlipDigit: React.FC<FlipDigitProps> = ({ char, config, colorOverrides, skipAnimation = false }) => {
  const [displayChar, setDisplayChar] = useState<string>(char);
  const [bottomChar, setBottomChar] = useState<string>(char);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevCharRef = useRef<string>(char);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationActiveRef = useRef<boolean>(false);

  const theme = useMemo(() => {
    const themeName = config.theme || 'classic';
    return themes[themeName] || themes['classic'];
  }, [config.theme]);

  const finalBg = colorOverrides?.overrideTile || theme.bg;
  const finalText = colorOverrides?.overrideText || theme.text;

  // Animate through drum sequence when target char changes
  useEffect(() => {
    const safeTargetChar = escapeChar(char);
    const currentChar = prevCharRef.current;

    if (skipAnimation || currentChar === safeTargetChar) {
      // Use setTimeout to avoid synchronous setState in effect (linter fix)
      setTimeout(() => {
        setDisplayChar(safeTargetChar);
        setBottomChar(safeTargetChar);
        prevCharRef.current = safeTargetChar;
      }, 0);
      return;
    }

    // Cancel any ongoing animation
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationActiveRef.current = true;

    // Choose optimized drum if both chars are numeric
    let activeDrum = DRUM_CHARS;
    
    // Special optimization for Clock mode (0-9 only loop) OR if forceNumeric is ON
    const forceNumeric = config.forceNumeric;
    
    if (config.mode === 'clock' && DRUM_CHARS_CLOCK.includes(currentChar) && DRUM_CHARS_CLOCK.includes(safeTargetChar)) {
      activeDrum = DRUM_CHARS_CLOCK;
    } else if (forceNumeric) {
      // STRICT numeric (0-9 and dot only) as requested
      activeDrum = DRUM_CHARS_STRICT_NUMERIC;
    } else if (DRUM_CHARS_NUMERIC.includes(currentChar) && DRUM_CHARS_NUMERIC.includes(safeTargetChar)) {
      activeDrum = DRUM_CHARS_NUMERIC;
    }

    let startIndex = activeDrum.indexOf(currentChar);
    let endIndex = activeDrum.indexOf(safeTargetChar);

    // Fallback to full drum if not found
    if (startIndex === -1 || endIndex === -1) {
      activeDrum = DRUM_CHARS;
      startIndex = activeDrum.indexOf(currentChar);
      endIndex = activeDrum.indexOf(safeTargetChar);
    }

    if (startIndex === -1) { startIndex = 0; }
    if (endIndex === -1) { endIndex = 0; }

    let distance = endIndex - startIndex;
    if (distance < 0) { distance += activeDrum.length; }

    const isFullDrum = activeDrum === DRUM_CHARS;
    const stepsTotal = distance;

    if (!activeDrum.includes(safeTargetChar)) {
      // Use setTimeout to avoid synchronous setState in effect (linter fix)
      setTimeout(() => {
        setDisplayChar(safeTargetChar);
        setBottomChar(safeTargetChar);
        prevCharRef.current = safeTargetChar;
        animationActiveRef.current = false;
      }, 0);
      return;
    }

    const normalSpeed = config.speed !== undefined ? config.speed : 0.49;
    const spinSpeed = config.spinSpeed !== undefined ? config.spinSpeed : 0.12;

    // Use a ref to track current animation state
    const animStateRef = { currentChar, stepsTaken: 0 };

    const animate = () => {
      if (!animationActiveRef.current) { return; }

      const currentIdx = activeDrum.indexOf(animStateRef.currentChar);
      if (currentIdx === -1 || animStateRef.currentChar === safeTargetChar) {
        setDisplayChar(safeTargetChar);
        setBottomChar(safeTargetChar);
        prevCharRef.current = safeTargetChar;
        setIsFlipping(false);
        animationActiveRef.current = false;
        return;
      }

      // Dynamic speed calculation for full drum (easing)
      let currentSpeed = spinSpeed;
      if (isFullDrum && stepsTotal > 9) {
        const progress = animStateRef.stepsTaken / stepsTotal;
        const easeMultiplier = 1.0 - 0.8 * Math.sin(progress * Math.PI);
        currentSpeed = Math.max(0.02, spinSpeed * easeMultiplier);
      }

      // Force normal speed for single step
      if (stepsTotal === 1) {
        currentSpeed = normalSpeed;
      }

      const nextIdx = (currentIdx + 1) % activeDrum.length;
      const nextChar = activeDrum[nextIdx];
      const charBeforeFlip = animStateRef.currentChar;

      setIsFlipping(true);
      setBottomChar(charBeforeFlip); // Bottom & FlapFront show old char
      setDisplayChar(nextChar);      // Top & FlapBack show new char
      
      animStateRef.currentChar = nextChar;
      animStateRef.stepsTaken++;

      animationTimeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
        // After flip completes, catch up bottomChar
        // (will be overwritten by next step anyway, but good for safety)
        
        if (nextChar !== safeTargetChar && animStateRef.stepsTaken < 60) {
          animate();
        } else {
          setDisplayChar(safeTargetChar);
          setBottomChar(safeTargetChar);
          prevCharRef.current = safeTargetChar;
          animationActiveRef.current = false;
        }
      }, currentSpeed * 1000);
    };

    animate();

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationActiveRef.current = false;
    };
  }, [char, skipAnimation, config.speed, config.spinSpeed, config.mode, config.forceNumeric]);

  // Generate styles using Emotion
  const styles = useMemo(() => {
    const cardWidth = config.cardSize * 0.7;
    const fontSize = config.cardSize * 0.85;

    const flipDownFront = keyframes`
      0% { transform: rotateX(0deg); }
      100% { transform: rotateX(-180deg); }
    `;

    const flipDownBack = keyframes`
      0% { transform: rotateX(180deg); }
      100% { transform: rotateX(0deg); }
    `;

    const matrixFall = keyframes`
      0% { transform: translateY(-5%); opacity: 0.75; }
      50% { opacity: 0.95; }
      100% { transform: translateY(40%); opacity: 0.7; }
    `;

    const matrixPulse = keyframes`
      0% { opacity: 0.35; }
      50% { opacity: 0.1; }
      100% { opacity: 0.35; }
    `;

    return {
      flipUnit: css({
        position: 'relative',
        width: `${cardWidth}px`,
        height: `${config.cardSize}px`,
        backgroundColor: finalBg,
        color: finalText,
        borderRadius: theme.radius,
        fontWeight: 'bold',
        fontSize: `${fontSize}px`,
        lineHeight: `${config.cardSize}px`,
        textAlign: 'center',
        boxShadow: theme.shadow,
        border: theme.border,
        fontFamily: theme.font,
        transformStyle: 'preserve-3d',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        ...(theme.specialEffect === 'glass' && {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }),
        ...(theme.specialEffect === 'bloom' && {
          textShadow: `0 0 10px ${finalText}, 0 0 20px ${finalText}`,
        }),
        ...(theme.specialEffect === 'crt' && {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '" "',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 6px 100%',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 'inherit',
          },
        }),
        ...(theme.specialEffect === 'vignette' && {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%)',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 'inherit',
          },
        }),
        ...(theme.specialEffect === 'matrix' && {
          position: 'relative',
          overflow: 'hidden',
          textShadow: '0 0 6px rgba(0, 255, 65, 0.9)',
          borderColor: 'rgba(0, 255, 65, 0.4)',
          '&::before': {
            content:
              '"ｱｲｳｴｵｶｷｸｹｺﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ01LpxZ#$%={}<>?!/\\+-"',
            position: 'absolute',
            top: '-180%',
            left: 0,
            right: 0,
            height: '480%',
            fontFamily: "'Courier New', monospace",
            fontSize: '12px',
            lineHeight: 1.35,
            color: 'rgba(0, 255, 65, 0.35)',
            textShadow: '0 0 6px rgba(0, 255, 65, 0.85)',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            letterSpacing: '6px',
            animation: `${matrixFall} 4.5s linear infinite`,
            pointerEvents: 'none',
            zIndex: 10,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 255, 65, 0.18), rgba(2, 11, 2, 0))',
            mixBlendMode: 'screen',
            opacity: 0.5,
            animation: `${matrixPulse} 3s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 11,
          },
        }),
        ...(theme.specialEffect === 'halftone' && {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.12) 0.7px, transparent 0.7px), radial-gradient(circle, rgba(0,0,0,0.12) 0.7px, transparent 0.7px)',
            backgroundSize: '4px 4px, 4px 4px',
            backgroundPosition: '0 0, 2px 2px',
            pointerEvents: 'none',
            zIndex: 0,
            borderRadius: 'inherit',
          },
        }),
      }),
      top: css({
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '50%',
        top: 0,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        background: theme.gradientTop || finalBg,
        backgroundImage: theme.gradientTop,
        borderRadius: `${theme.radius} ${theme.radius} 0 0`,
        borderBottom: '1px solid rgba(0,0,0,0.3)',
        zIndex: 1,
        '&::before': {
          content: `"${escapeChar(displayChar)}"`,
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '200%',
          top: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(0,0,0,0.15)',
        },
      }),
      bottom: css({
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '50%',
        bottom: 0,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        background: theme.gradientBottom || finalBg,
        backgroundImage: theme.gradientBottom,
        borderRadius: `0 0 ${theme.radius} ${theme.radius}`,
        zIndex: 0,
        '&::before': {
          content: `"${escapeChar(bottomChar)}"`,
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '200%',
          top: '-100%',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.05)',
        },
      }),
      flap: css({
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '50%',
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
      }),
      flapFront: css({
        top: 0,
        transformOrigin: 'bottom',
        background: theme.gradientTop || finalBg,
        backgroundImage: theme.gradientTop,
        borderRadius: `${theme.radius} ${theme.radius} 0 0`,
        borderBottom: '1px solid rgba(0,0,0,0.3)',
        zIndex: 2,
        '&::before': {
          content: `"${escapeChar(bottomChar)}"`,
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '200%',
          top: 0,
        },
      }),
      flapBack: css({
        top: '50%',
        transformOrigin: 'top',
        transform: 'rotateX(180deg)',
        background: theme.gradientBottom || finalBg,
        backgroundImage: theme.gradientBottom,
        borderRadius: `0 0 ${theme.radius} ${theme.radius}`,
        zIndex: 3,
        '&::before': {
          content: `"${escapeChar(displayChar)}"`,
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '200%',
          top: '-100%',
        },
      }),
      flipping: css({
        '& .flap-front': {
          animation: `${flipDownFront} var(--flip-duration) ease-in forwards`,
        },
        '& .flap-back': {
          animation: `${flipDownBack} var(--flip-duration) ease-out forwards`,
        },
      }),
    };
  }, [config.cardSize, finalBg, finalText, theme, displayChar, bottomChar]);

  return (
    <>
      <div
        className={cx(styles.flipUnit, isFlipping && styles.flipping)}
        style={{ '--flip-duration': `${config.speed || 0.49}s` } as React.CSSProperties}
      >
        <div className={styles.top} />
        <div className={styles.bottom} />
        <div className={cx(styles.flap, styles.flapFront, 'flap-front')} />
        <div className={cx(styles.flap, styles.flapBack, 'flap-back')} />
      </div>
    </>
  );
};
