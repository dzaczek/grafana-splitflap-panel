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
  const [targetString, setTargetString] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Format value to display string
  useEffect(() => {
    let formatted = '';
    if (typeof value === 'number') {
      const decimals = config.rounding !== undefined ? config.rounding : 1;
      formatted = value.toFixed(decimals);
    } else if (value !== undefined && value !== null) {
      formatted = String(value);
    }

    const targetLen = Math.max(formatted.length, config.digitCount || 4);
    const padded = formatted.padStart(targetLen, ' ');
    setTargetString(padded);
    setIsInitialized(true);
  }, [value, config.rounding, config.digitCount]);

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
