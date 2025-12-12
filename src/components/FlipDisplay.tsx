import React, { useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/css';
import { FlipOptions } from '../types';
import { FlipDigit } from './FlipDigit';

interface FlipDisplayProps {
  value: any;
  config: FlipOptions;
  colorOverrides?: { overrideText?: string; overrideTile?: string };
}

export const FlipDisplay: React.FC<FlipDisplayProps> = ({ value, config, colorOverrides }) => {
  // Format value to display string using useMemo instead of useState + useEffect
  const targetString = useMemo(() => {
    let formatted = '';
    if (typeof value === 'number') {
      const decimals = config.rounding !== undefined ? config.rounding : 1;
      formatted = value.toFixed(decimals);
    } else if (value !== undefined && value !== null) {
      formatted = String(value);
    }

    const targetLen = Math.max(formatted.length, config.digitCount || 4);
    return formatted.padStart(targetLen, ' ');
  }, [value, config.rounding, config.digitCount]);

  const isInitialized = true; // Always initialized since we're using useMemo

  const targetLen = useMemo(() => {
    return Math.max(targetString.length, config.digitCount || 4);
  }, [targetString.length, config.digitCount]);

  const containerStyle = css({
    display: 'flex',
    justifyContent: 'center',
    gap: `${config.gap || 4}px`,
    perspective: '1000px',
    transformStyle: 'preserve-3d',
  });

  if (!isInitialized) {
    return <div className={containerStyle} />;
  }

  const paddedString = targetString.padStart(targetLen, ' ');

  return (
    <div className={containerStyle}>
      {Array.from({ length: targetLen }, (_, i) => {
        const char = paddedString[i] || ' ';
        return (
          <FlipDigit
            key={i}
            char={char}
            config={config}
            colorOverrides={colorOverrides}
            skipAnimation={!isInitialized}
          />
        );
      })}
    </div>
  );
};
