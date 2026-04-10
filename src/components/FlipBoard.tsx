import React, { useMemo, useState, useEffect } from 'react';
import { PanelProps, getFieldDisplayName } from '@grafana/data';
import { FlipOptions } from '../types';
import { FlipDisplay } from './FlipDisplay';

// single flip item component
interface ItemProps {
    width: number;
    height: number;
    options: FlipOptions;
    value: any;
    unit: string;
    name: string;
    timezone?: string;
    thresholdColor?: string;
    amPm?: string;
}

const FlipItem: React.FC<ItemProps> = ({ width, height, options, value, unit, name, timezone, thresholdColor, amPm }) => {
    // format value same way as engine does
    // need displayed text length not raw number
    const formattedValueStr = useMemo(() => {
        if (typeof value === 'number') {
            const decimals = options.rounding !== undefined ? options.rounding : 1;
            return value.toFixed(decimals);
        } else if (value !== null && value !== undefined) {
            return String(value);
        } else {
            return "---";
        }
    }, [value, options.rounding]);

    // auto fit scaling
    const finalSize = useMemo(() => {
        if (width <= 0 || height <= 0) { return options.cardSize; }

        let calculatedSize = options.cardSize;

        if (options.autoSize) {
            // safety padding inside container
            const PADDING = 16; 
            // gap between name, flip, unit elements
            const LAYOUT_GAP = 12;

            let availWidth = width - PADDING;
            let availHeight = height - PADDING;

            // subtract space for unit
            if (options.showUnit && unit) {
                const unitSize = (options.unitFontSize || 24);
                // left/right takes width
                if (options.unitPos === 'left' || options.unitPos === 'right') {
                    availWidth -= (unitSize + LAYOUT_GAP); 
                } 
                // top/bottom takes height
                else {
                    availHeight -= (unitSize + LAYOUT_GAP);
                }
            }

            // subtract space for name
            if (options.showName && name) {
                const nameSize = (options.nameFontSize || 18);
                if (options.namePos === 'left' || options.namePos === 'right') {
                    availWidth -= (nameSize + LAYOUT_GAP);
                } else {
                    availHeight -= (nameSize + LAYOUT_GAP);
                }
            }

            // subtract space for timezone
            if (options.showTimezone && timezone) {
                const timezoneSize = (options.timezoneFontSize || 18);
                if (options.timezonePos === 'left' || options.timezonePos === 'right') {
                    availWidth -= (timezoneSize + LAYOUT_GAP);
                } else {
                    availHeight -= (timezoneSize + LAYOUT_GAP);
                }
            }

            // subtract space for AM/PM
            let amPmEquivalentChars = 0;
            
            if (options.mode === 'clock' && options.clock12h && amPm) {
                 const amPmGap = options.amPmGap !== undefined ? options.amPmGap : 12;
                 availWidth -= amPmGap;

                 const amPmCharCount = (options.amPmOrientation === 'vertical') ? 1 : amPm.length;
                 const baseAmPmSize = (options.amPmFontSize || 18);
                 const baseCardSize = (options.cardSize || 50);
                 
                 // ratio of AM/PM size to Clock size
                 const ratio = baseAmPmSize / baseCardSize;
                 amPmEquivalentChars = amPmCharCount * ratio;
                 
                 // internal gaps for AM/PM (2px hardcoded in renderAmPm)
                 const amPmInternalGaps = Math.max(0, amPmCharCount - 1) * 2;
                 availWidth -= amPmInternalGaps;
            }

            // calculate card size
            // how many cards we need
            const realDigitCount = Math.max(options.digitCount, formattedValueStr.length);
            const gapBetweenCards = (options.gap !== undefined ? options.gap : 2);
            
            // card aspect ratio
            const CARD_ASPECT_RATIO = 0.70; 

            // total width taken by gaps
            const totalGapWidth = Math.max(0, (realDigitCount - 1) * gapBetweenCards);
            
            // max width per card
            // Effective count includes the fractional equivalent of AM/PM cards
            const effectiveDigitCount = realDigitCount + amPmEquivalentChars;
            const maxCardWidth = Math.max(0, availWidth - totalGapWidth) / effectiveDigitCount;
            
            // convert to height since cardSize is height
            const sizeBasedOnWidth = maxCardWidth / CARD_ASPECT_RATIO;
            
            // check height constraint
            const sizeBasedOnHeight = Math.max(0, availHeight);

            // pick smaller dimension to fit both axes
            calculatedSize = Math.floor(Math.min(sizeBasedOnWidth, sizeBasedOnHeight));
            
            // absolute minimum so it doesn't disappear
            if (calculatedSize < 10) { calculatedSize = 10; }
        }

        return calculatedSize;
    }, [options, width, height, formattedValueStr.length, name, unit, timezone, amPm]);

    // color overrides for thresholds
    const colorOverrides = useMemo(() => {
        const overrides: { overrideText?: string; overrideTile?: string } = {};
        if (options.thresholdTarget === 'text' && thresholdColor) { 
            overrides.overrideText = thresholdColor; 
        }
        if (options.thresholdTarget === 'tile' && thresholdColor) { 
            overrides.overrideTile = thresholdColor; 
        }
        return overrides;
    }, [options.thresholdTarget, thresholdColor]);

    // config with calculated size
    const displayConfig = useMemo(() => ({
        ...options,
        cardSize: finalSize,
    }), [options, finalSize]);

    // styling
    const commonTextStyle: React.CSSProperties = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        opacity: 0.8,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        color: (options.thresholdTarget === 'text' && thresholdColor) ? thresholdColor : 'inherit',
    };

    const unitElement = options.showUnit && unit ? (
        <div style={{
            ...commonTextStyle,
            fontSize: `${options.unitFontSize || 24}px`,
            transform: options.unitRotation ? 'rotate(-90deg)' : 'none',
        }}>{unit}</div>
    ) : null;

    const nameElement = options.showName && name ? (
        <div style={{
            ...commonTextStyle,
            fontSize: `${options.nameFontSize || 18}px`,
            // Marginesy nie są potrzebne tutaj, bo używamy gap w kontenerze flex
        }}>{name}</div>
    ) : null;

    const timezoneElement = options.showTimezone && timezone ? (
        <div style={{
            ...commonTextStyle,
            fontSize: `${options.timezoneFontSize || 18}px`,
        }}>{timezone}</div>
    ) : null;

    // AM/PM rendering
    const renderAmPm = () => {
        if (!options.mode || options.mode !== 'clock' || !amPm) { return null; }
        
        const isVertical = options.amPmOrientation === 'vertical';
        
        let fontSize = options.amPmFontSize || 18;
        
        // If autoSize is enabled, scale AM/PM proportionally to the calculated finalSize
        // maintaining the ratio defined by (amPmFontSize / cardSize)
        if (options.autoSize) {
             const baseCardSize = options.cardSize || 50;
             const ratio = (options.amPmFontSize || 18) / baseCardSize;
             fontSize = finalSize * ratio;
        }
        
        // Custom config for AM/PM digits
        const amPmConfig = {
            ...displayConfig,
            cardSize: fontSize,
        };

        const chars = Array.from(amPm);

        return (
            <div style={{
                display: 'flex',
                flexDirection: isVertical ? 'column' : 'row',
                gap: '2px',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {chars.map((char, i) => (
                    <FlipDisplay
                        key={i}
                        value={char}
                        config={{ ...amPmConfig, digitCount: 1 }}
                        colorOverrides={colorOverrides}
                    />
                ))}
            </div>
        );
    };

    const flipWrapperStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${options.amPmGap !== undefined ? options.amPmGap : 12}px`
    };

    const flipContent = (
         <div style={flipWrapperStyle}>
             {/* If pos is Left or None (defaulting to right of text if truly mixed, but here treating 'none' as 'after' for now if stripped?) 
                 Actually 'none' meant "In Text". If we stripped it, we must decide where to put it. 
                 Let's assume 'none' puts it at the END (like "12:00 PM"), effectively same as 'right' but maybe different gap logic?
                 The user asked to manage it "in text" mode too.
                 So if amPmPos is 'none', we treat it as "attached to right" but we render it as FlipDisplay to allow customization.
             */}
             {options.amPmPos === 'left' && renderAmPm()}
             
             <FlipDisplay 
                value={value}
                config={displayConfig}
                colorOverrides={colorOverrides}
            />
             
             {(options.amPmPos === 'right' || options.amPmPos === 'none') && renderAmPm()}
         </div>
    );

    // container for flip and unit
    const coreContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: (options.unitPos === 'left' || options.unitPos === 'right') ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px' // layout gap accounted in calculations
    };

    if (options.unitAlign === 'start') { coreContainerStyle.alignItems = 'flex-start'; }
    if (options.unitAlign === 'end') { coreContainerStyle.alignItems = 'flex-end'; }

    const coreContent = (
        <div style={coreContainerStyle}>
            {(options.unitPos === 'top' || options.unitPos === 'left') && unitElement}
            {flipContent}
            {(options.unitPos === 'bottom' || options.unitPos === 'right') && unitElement}
        </div>
    );

    // main container for name/timezone and core
    // For clock mode, prioritize timezone if shown, otherwise use name logic
    const useTimezoneForLayout = options.mode === 'clock' && options.showTimezone && timezone;
    const useNameForLayout = options.showName && name && !useTimezoneForLayout;
    
    const mainDirection = (useNameForLayout && (options.namePos === 'left' || options.namePos === 'right')) ||
                          (useTimezoneForLayout && (options.timezonePos === 'left' || options.timezonePos === 'right'))
                          ? 'row' : 'column';
    
    const wrapperStyle: React.CSSProperties = {
        // width: '100%', // REMOVED to prevent pushing content to edges when aligning items
        // height: '100%', // REMOVED to allow shrink-wrap and center alignment in parent
        display: 'flex',
        flexDirection: mainDirection,
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px' // layout gap accounted in calculations
    };

    // Alignment - use name alignment if name is shown, otherwise timezone alignment
    if (useNameForLayout) {
        if (options.nameAlign === 'start') { wrapperStyle.alignItems = 'flex-start'; }
        if (options.nameAlign === 'end') { wrapperStyle.alignItems = 'flex-end'; }
    } else if (useTimezoneForLayout) {
        if (options.timezoneAlign === 'start') { wrapperStyle.alignItems = 'flex-start'; }
        if (options.timezoneAlign === 'end') { wrapperStyle.alignItems = 'flex-end'; }
    }

    // Render order: top/left elements, core, bottom/right elements
    const renderTopLeft = () => {
        const elements = [];
        if (options.showName && name && (options.namePos === 'top' || options.namePos === 'left')) {
            elements.push(nameElement);
        }
        if (options.showTimezone && timezone && (options.timezonePos === 'top' || options.timezonePos === 'left')) {
            elements.push(timezoneElement);
        }
        return elements.length > 0 ? elements : null;
    };

    const renderBottomRight = () => {
        const elements = [];
        if (options.showName && name && (options.namePos === 'bottom' || options.namePos === 'right')) {
            elements.push(nameElement);
        }
        if (options.showTimezone && timezone && (options.timezonePos === 'bottom' || options.timezonePos === 'right')) {
            elements.push(timezoneElement);
        }
        return elements.length > 0 ? elements : null;
    };

    return (
        <div style={wrapperStyle}>
             {renderTopLeft()}
             {coreContent}
             {renderBottomRight()}
        </div>
    );
};


    // helper to reduce values
    function reduceValues(values: any, aggregation: string): any {
        if (!values || values.length === 0) { return null; }
        
        // convert vector to array
    const arr = Array.from(values);
    const validNumbers = arr.filter((v: any) => typeof v === 'number' && !isNaN(v)) as number[];

    switch (aggregation) {
        case 'first': return arr[0];
        case 'firstNotNull': return arr.find((v: any) => v !== null && v !== undefined);
        case 'lastNotNull': 
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] !== null && arr[i] !== undefined) { return arr[i]; }
            }
            return null;
        case 'min': return validNumbers.length ? Math.min(...validNumbers) : null;
        case 'max': return validNumbers.length ? Math.max(...validNumbers) : null;
        case 'sum': return validNumbers.reduce((a, b) => a + b, 0);
        case 'mean': return validNumbers.length ? validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length : null;
        case 'count': return arr.length;
        case 'last':
        default: return arr[arr.length - 1];
    }
}

function getClockString(options: FlipOptions, date: Date): { text: string, amPm: string } {
    const { clock12h, clockTimezone, clockShowSeconds, clockSeparator, clockDateFormat, clockDayOfWeek } = options;

    const timeZone = clockTimezone || undefined; // undefined uses browser default

    // Time Parts
    const timeParts = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: clockShowSeconds ? '2-digit' : undefined,
        hour12: clock12h,
        timeZone
    }).formatToParts(date);
    
    let hour = '', minute = '', second = '', dayPeriod = '';
    
    timeParts.forEach(p => {
        if (p.type === 'hour') { hour = p.value; }
        if (p.type === 'minute') { minute = p.value; }
        if (p.type === 'second') { second = p.value; }
        if (p.type === 'dayPeriod') { dayPeriod = p.value; }
    });
    
    // Ensure 2 digits for hour if 24h
    if (!clock12h && hour.length < 2) { hour = '0' + hour; }
    if (clock12h && hour.length < 2) { hour = ' ' + hour; } 

    // Separator mapping
    const sepMap: Record<string, string> = {
        'colon': ':',
        'dot': '.',
        'dash': '-',
        'space': ' ',
        'none': ''
    };
    const sep = sepMap[clockSeparator || 'colon'] || ':';
    
    let timeStr = `${hour}${sep}${minute}`;
    if (clockShowSeconds) {
        timeStr += `${sep}${second}`;
    }
    
    let finalAmPm = '';
    if (clock12h && dayPeriod) {
        // ALWAYS separate AM/PM to allow custom FlipDisplay rendering even for "In Text" mode (which we treat as 'none' pos, appended visually)
        finalAmPm = dayPeriod;
    }

    // Date
    let dateStr = '';
    if (clockDateFormat) {
         const dateParts = new Intl.DateTimeFormat('en-US', {
             year: 'numeric',
             month: '2-digit',
             day: '2-digit',
             timeZone
         }).formatToParts(date);
         
         let Y = '', M = '', D = '';
         dateParts.forEach(p => {
             if (p.type === 'year') { Y = p.value; }
             if (p.type === 'month') { M = p.value; }
             if (p.type === 'day') { D = p.value; }
         });
         
         switch (clockDateFormat) {
             case 'DD/MM/YYYY': dateStr = `${D}/${M}/${Y}`; break;
             case 'MM/DD/YYYY': dateStr = `${M}/${D}/${Y}`; break;
             case 'YYYY-MM-DD': dateStr = `${Y}-${M}-${D}`; break;
             case 'DD.MM.YYYY': dateStr = `${D}.${M}.${Y}`; break;
         }
    }
    
    // Day of Week
    let weekdayStr = '';
    if (clockDayOfWeek) {
        // Use browser locale for weekday name, or maybe Polish if requested?
        // Let's use user's browser locale (undefined)
        weekdayStr = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone }).format(date);
    }
    
    // Assemble final string: Date  Weekday  Time
    const components = [];
    if (dateStr) { components.push(dateStr); }
    if (weekdayStr) { components.push(weekdayStr); }
    components.push(timeStr);
    
    // Using 2 spaces instead of 3 for better spacing
    return { text: components.join('  '), amPm: finalAmPm };
}

// ======= SCREW DECORATION =======
const ScrewDot: React.FC<{ size?: number }> = ({ size = 7 }) => (
    <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), rgba(255,255,255,0.08) 40%, rgba(0,0,0,0.2) 100%)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 0.5px 0 rgba(255,255,255,0.1)',
    }} />
);

const ScrewRow: React.FC<{ position: 'top' | 'bottom' }> = ({ position }) => (
    <div style={{
        position: 'absolute',
        [position]: '3px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 14px',
        pointerEvents: 'none',
        zIndex: 10,
    }}>
        <ScrewDot />
        <ScrewDot />
    </div>
);

// ======= BOARD VIEW (Solari Display) =======
interface BoardViewProps {
    width: number;
    height: number;
    options: FlipOptions;
    data: any;
    seriesList: any[];
}

const BoardView: React.FC<BoardViewProps> = ({ width, height, options, data, seriesList }) => {
    const frameColor = options.boardFrameColor || '#1a1a1a';
    const headerBg = options.boardHeaderBg || '#2a2a2a';
    const headerTextColor = options.boardHeaderTextColor || '#f7d100';
    const showHeader = options.boardShowHeader !== false;
    const title = options.boardTitle || 'DEPARTURES';
    const splitToColumns = options.boardSplitToColumns || false;
    const autoColumnNames = options.boardAutoColumnNames !== false;
    const columnNamesRaw = options.boardColumnNames || '';
    const manualColumnNames = columnNamesRaw ? columnNamesRaw.split(',').map(s => s.trim()) : [];
    const columnAlign = options.boardColumnAlign || 'left';
    const rowSeparator = options.boardRowSeparator !== false;
    const compact = options.boardCompact || false;
    const scrollable = options.boardScrollable || false;
    const showRowNumbers = options.boardShowRowNumbers || false;
    const headerFontSize = options.boardHeaderFontSize || 18;
    const colHeaderFontSize = options.boardColumnHeaderFontSize || 11;

    const trueWall = options.boardTrueWall || false;

    const FRAME_WIDTH = options.boardFrameWidth !== undefined ? options.boardFrameWidth : 8;
    const HEADER_HEIGHT = showHeader ? Math.max(headerFontSize + (compact ? 12 : 26), 32) : 0;
    const ROW_NUMBER_WIDTH = showRowNumbers ? 32 : 0;

    const innerWidth = width - FRAME_WIDTH * 2;
    const innerHeight = height - FRAME_WIDTH * 2;

    // alignment mapping
    const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };

    // Prepare rows data
    const rows = useMemo(() => {
        return seriesList.map((series) => {
            if (splitToColumns) {
                const fields = series.fields.filter((f: any) => f.type !== 'time');
                return fields.map((field: any) => {
                    const rawValue = reduceValues(field.values, options.valueAggregation);
                    let val = (rawValue !== null && rawValue !== undefined) ? rawValue : '---';
                    if (typeof val === 'number') {
                        const decimals = options.rounding !== undefined ? options.rounding : 1;
                        val = val.toFixed(decimals);
                    }
                    const displayName = getFieldDisplayName(field, series, data.series);
                    const displayValue = field.display ? field.display(rawValue) : { color: undefined };
                    return { value: val, name: displayName, color: displayValue.color, field };
                });
            } else {
                const field = series.fields.find((f: any) => f.type === 'number')
                    || series.fields.find((f: any) => f.type === 'string')
                    || series.fields.find((f: any) => f.type !== 'time')
                    || series.fields[0];
                const rawValue = reduceValues(field.values, options.valueAggregation);
                let baseValue = (rawValue !== null && rawValue !== undefined) ? rawValue : '---';
                let displayBaseValue = baseValue;
                if (typeof baseValue === 'number') {
                    const decimals = options.rounding !== undefined ? options.rounding : 1;
                    displayBaseValue = baseValue.toFixed(decimals);
                }
                let valueToSend = baseValue;
                const contentMode = options.displayContent || 'value';
                const displayName = getFieldDisplayName(field, series, data.series);
                if (contentMode === 'name') {
                    valueToSend = displayName;
                } else if (contentMode === 'name_value') {
                    valueToSend = `${displayName}   ${displayBaseValue}`;
                } else if (contentMode === 'value_name') {
                    valueToSend = `${displayBaseValue}   ${displayName}`;
                }
                const displayValue = field.display ? field.display(baseValue) : { color: undefined };
                return [{ value: valueToSend, name: displayName, color: displayValue.color, field }];
            }
        });
    }, [seriesList, splitToColumns, options.valueAggregation, options.rounding, options.displayContent, data.series]);

    // Max columns across all rows
    const maxCols = Math.max(1, ...rows.map(r => r.length));

    // Resolve column names: auto from field names or manual
    const resolvedColumnNames = useMemo(() => {
        if (!splitToColumns) { return []; }
        if (!autoColumnNames && manualColumnNames.length > 0) {
            return manualColumnNames;
        }
        // Auto: derive from first row's field display names
        if (rows.length > 0 && rows[0].length > 0) {
            return rows[0].map(col => col.name);
        }
        return [];
    }, [splitToColumns, autoColumnNames, manualColumnNames, rows]);

    const hasColumnHeaders = splitToColumns && resolvedColumnNames.length > 0;
    const COLUMN_HEADER_HEIGHT = hasColumnHeaders ? Math.max(colHeaderFontSize + (compact ? 8 : 16), 22) : 0;

    const contentHeight = innerHeight - HEADER_HEIGHT - COLUMN_HEADER_HEIGHT;
    const rowCount = seriesList.length;
    const rowPadV = compact ? 1 : 4;
    const rowHeight = scrollable
        ? Math.max(compact ? 28 : 40, Math.floor(contentHeight / Math.max(rowCount, 1)))
        : rowCount > 0 ? Math.floor(contentHeight / rowCount) : contentHeight;

    return (
        <div style={{
            width,
            height,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: frameColor,
            borderRadius: FRAME_WIDTH > 0 ? '8px' : '0',
            border: FRAME_WIDTH > 0 ? `${FRAME_WIDTH}px solid ${frameColor}` : 'none',
            boxShadow: FRAME_WIDTH > 0
                ? 'inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.6)'
                : 'none',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}>
            {/* Metallic shine on frame */}
            {FRAME_WIDTH > 2 && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${FRAME_WIDTH}px`,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none',
                    zIndex: 5,
                    borderRadius: 'inherit',
                }} />
            )}

            {/* Screws */}
            {FRAME_WIDTH >= 6 && <ScrewRow position="top" />}
            {FRAME_WIDTH >= 6 && <ScrewRow position="bottom" />}

            {/* Title Header */}
            {showHeader && (
                <div style={{
                    height: `${HEADER_HEIGHT}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: headerBg,
                    borderBottom: `2px solid ${frameColor}`,
                    flexShrink: 0,
                }}>
                    <span style={{
                        color: headerTextColor,
                        fontSize: `${headerFontSize}px`,
                        fontWeight: 700,
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                    }}>{title}</span>
                </div>
            )}

            {/* Column Headers */}
            {hasColumnHeaders && (
                <div style={{
                    height: `${COLUMN_HEADER_HEIGHT}px`,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    background: trueWall ? frameColor : 'rgba(255,255,255,0.05)',
                    borderBottom: trueWall ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    flexShrink: 0,
                    padding: compact ? '0 4px' : '0 8px',
                    gap: trueWall ? (compact ? '2px' : '4px') : '0',
                }}>
                    {showRowNumbers && (
                        <div style={{ width: `${ROW_NUMBER_WIDTH}px`, flexShrink: 0 }} />
                    )}
                    {Array.from({ length: maxCols }, (_, ci) => {
                        const colHeaderWidth = trueWall
                            ? `${Math.floor((innerWidth - ROW_NUMBER_WIDTH - (compact ? 8 : 12)) / maxCols)}px`
                            : undefined;
                        return (
                            <div key={ci} style={{
                                ...(trueWall ? { width: colHeaderWidth, flexShrink: 0 } : { flex: 1 }),
                                textAlign: columnAlign,
                                color: trueWall ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.6)',
                                fontSize: `${colHeaderFontSize}px`,
                                fontWeight: 600,
                                fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                padding: '0 4px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                ...(trueWall ? { textShadow: '0 1px 2px rgba(0,0,0,0.5)' } : {}),
                            }}>
                                {resolvedColumnNames[ci] || ''}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rows */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: scrollable ? 'auto' : 'hidden',
                padding: trueWall ? (compact ? '2px' : '4px') : '0',
                gap: trueWall ? (compact ? '2px' : '4px') : '0',
            }}>
                {rows.map((cols, rowIdx) => {
                    // Panel-level threshold: use first column's color as row background
                    let rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)';
                    if (options.thresholdTarget === 'panel' && cols.length > 0 && cols[0].color) {
                        rowBg = cols[0].color;
                    }
                    const availRowWidth = innerWidth - ROW_NUMBER_WIDTH - (trueWall ? (compact ? 8 : 12) : 0);
                    const cellGap = trueWall ? (compact ? 2 : 4) : 0;
                    const cellInset = trueWall ? (compact ? 2 : 3) : 0;

                    return (
                        <div key={rowIdx} style={{
                            minHeight: `${rowHeight}px`,
                            height: scrollable ? `${rowHeight}px` : `${rowHeight}px`,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexShrink: scrollable ? 0 : 1,
                            borderBottom: (!trueWall && rowSeparator && rowIdx < rowCount - 1)
                                ? '1px solid rgba(255,255,255,0.08)'
                                : 'none',
                            background: trueWall ? 'transparent' : rowBg,
                            padding: compact ? '0 2px' : '0 4px',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            gap: `${cellGap}px`,
                        }}>
                            {/* Row number */}
                            {showRowNumbers && (
                                <div style={{
                                    width: `${ROW_NUMBER_WIDTH}px`,
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.3)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                }}>
                                    {rowIdx + 1}
                                </div>
                            )}

                            {splitToColumns ? (
                                Array.from({ length: maxCols }, (_, ci) => {
                                    const col = cols[ci];
                                    if (!col) {
                                        return <div key={ci} style={trueWall
                                            ? { width: `${Math.floor(availRowWidth / maxCols)}px`, flexShrink: 0 }
                                            : { flex: 1 }
                                        } />;
                                    }
                                    const colWidth = Math.floor(availRowWidth / maxCols);
                                    const cellHeight = rowHeight - rowPadV * 2 - (trueWall ? cellGap * 2 : 0);
                                    const trueWallOpts = trueWall ? { ...options, showName: false, showUnit: false, _trueWallDigit: true } : { ...options, showName: false, showUnit: false };
                                    return (
                                        <div key={ci} style={trueWall ? {
                                            width: `${colWidth}px`,
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: alignMap[columnAlign] || 'flex-start',
                                            overflow: 'hidden',
                                            background: '#0a0a0a',
                                            borderRadius: '3px',
                                            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), inset 0 -1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(0,0,0,0.6)',
                                            padding: `${cellInset}px`,
                                        } : {
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: alignMap[columnAlign] || 'flex-start',
                                            overflow: 'hidden',
                                            padding: compact ? '0 1px' : '0 2px',
                                        }}>
                                            <FlipItem
                                                width={colWidth - (compact ? 4 : 8) - cellInset * 2}
                                                height={cellHeight - cellInset * 2}
                                                options={trueWallOpts as any}
                                                value={col.value}
                                                unit={options.customUnit || col.field?.config?.unit || ''}
                                                name={col.name}
                                                thresholdColor={col.color}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={trueWall ? {
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: alignMap[options.textAlign || 'center'] || 'center',
                                    overflow: 'hidden',
                                    background: '#0a0a0a',
                                    borderRadius: '3px',
                                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), inset 0 -1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(0,0,0,0.6)',
                                    padding: `${cellInset}px`,
                                    height: `${rowHeight - rowPadV * 2 - (trueWall ? cellGap * 2 : 0)}px`,
                                } : {
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: alignMap[options.textAlign || 'center'] || 'center',
                                    overflow: 'hidden',
                                }}>
                                    <FlipItem
                                        width={availRowWidth - (compact ? 4 : 8) - cellInset * 2}
                                        height={rowHeight - rowPadV * 2 - (trueWall ? cellGap * 2 : 0) - cellInset * 2}
                                        options={trueWall ? { ...options, _trueWallDigit: true } as any : options}
                                        value={cols[0].value}
                                        unit={options.customUnit || cols[0].field?.config?.unit || ''}
                                        name={cols[0].name}
                                        thresholdColor={cols[0].color}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// main panel component
interface Props extends PanelProps<FlipOptions> {}

export const FlipBoard: React.FC<Props> = ({ options, data, width, height }) => {
    
    // Clock State
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (options.mode === 'clock') {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }
        return undefined;
    }, [options.mode]);

    if (options.mode === 'clock') {
        const { text: clockStr, amPm } = getClockString(options, currentTime);
        
        // Get timezone display name
        let timezoneDisplay = '';
        if (options.showTimezone) {
            const displayMode = options.timezoneDisplayMode || 'standard';
            const timeZone = options.clockTimezone || undefined; // undefined = local

            if (displayMode === 'custom') {
                 timezoneDisplay = options.timezoneCustomName || '';
            } else if (displayMode === 'region') {
                 let tzId = options.clockTimezone;
                 if (!tzId) {
                     // Try to resolve local timezone ID
                     try {
                         tzId = Intl.DateTimeFormat().resolvedOptions().timeZone;
                     } catch {
                         tzId = 'Local';
                     }
                 }
                 
                 if (tzId && tzId.includes('/')) {
                     const parts = tzId.split('/');
                     timezoneDisplay = parts[parts.length - 1].replace(/_/g, ' ');
                 } else {
                     timezoneDisplay = tzId || 'Local';
                 }
            } else {
                // Standard behavior (short code e.g. EST, CET, GMT+1)
                try {
                    const formatter = new Intl.DateTimeFormat('en-US', {
                        timeZoneName: 'short',
                        timeZone: timeZone
                    });
                    const parts = formatter.formatToParts(currentTime);
                    const tzPart = parts.find(p => p.type === 'timeZoneName');
                    timezoneDisplay = tzPart ? tzPart.value : (timeZone || 'Local');
                } catch (e) {
                    timezoneDisplay = timeZone || 'Local';
                }
            }
        }
        
        return (
             <div style={{
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <FlipItem 
                    width={width}
                    height={height}
                    options={options}
                    value={clockStr}
                    unit=""
                    name=""
                    timezone={timezoneDisplay}
                    amPm={amPm}
                />
             </div>
        );
    }

    const seriesList = data.series;
    if (!seriesList || seriesList.length === 0) {
        return <div style={{width, height, display:'flex', alignItems:'center', justifyContent:'center'}}>No Data</div>;
    }

    // ======= BOARD MODE (Solari) =======
    if (options.displayMode === 'board') {
        return (
            <BoardView
                width={width}
                height={height}
                options={options}
                data={data}
                seriesList={seriesList}
            />
        );
    }

    // ======= DEFAULT MODE =======
    const count = seriesList.length;
    const isVertical = options.layoutDirection !== 'horizontal';

    // calculate item dimensions
    const itemWidth = isVertical ? width : Math.floor(width / count);
    const itemHeight = isVertical ? Math.floor(height / count) : height;

    // alignment mapping for default mode
    const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
    const justifyAlign = alignMap[options.textAlign || 'center'] || 'center';

    return (
        <div style={{
            width,
            height,
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            overflow: 'hidden'
        }}>
            {seriesList.map((series, i) => {
                const field = series.fields.find(f => f.type === 'number')
                           || series.fields.find(f => f.type === 'string')
                           || series.fields.find(f => f.type !== 'time')
                           || series.fields[0];

                const rawValue = reduceValues(field.values, options.valueAggregation);
                const displayName = getFieldDisplayName(field, series, data.series);

                let baseValue = (rawValue !== null && rawValue !== undefined) ? rawValue : "---";

                let displayBaseValue = baseValue;
                if (typeof baseValue === 'number') {
                    const decimals = options.rounding !== undefined ? options.rounding : 1;
                    displayBaseValue = baseValue.toFixed(decimals);
                }

                let valueToSend = baseValue;
                const contentMode = options.displayContent || 'value';

                if (contentMode === 'value') {
                    valueToSend = baseValue;
                } else if (contentMode === 'name') {
                    valueToSend = displayName;
                } else if (contentMode === 'name_value') {
                    valueToSend = `${displayName}   ${displayBaseValue}`;
                } else if (contentMode === 'value_name') {
                    valueToSend = `${displayBaseValue}   ${displayName}`;
                }

                const unitToSend = options.customUnit || field.config.unit || '';
                const displayValue = field.display ? field.display(baseValue) : { color: undefined };
                let itemBg = 'transparent';
                if (options.thresholdTarget === 'panel' && displayValue.color) {
                    itemBg = displayValue.color;
                }

                const borderColor = 'rgba(255, 255, 255, 0.1)';
                const borderStyle: React.CSSProperties = {
                    width: itemWidth,
                    height: itemHeight,
                    background: itemBg,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: justifyAlign,
                    padding: '4px',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                };

                if (options.showSeparators) {
                    if (isVertical && i < count - 1) { borderStyle.borderBottom = `1px solid ${borderColor}`; }
                    if (!isVertical && i < count - 1) { borderStyle.borderRight = `1px solid ${borderColor}`; }
                }

                return (
                    <div
                        key={series.refId || i}
                        style={borderStyle}
                        role="meter"
                        aria-label={`${displayName}: ${valueToSend} ${unitToSend}`}
                        aria-valuenow={typeof valueToSend === 'number' ? valueToSend : undefined}
                    >
                        <FlipItem
                            width={itemWidth}
                            height={itemHeight}
                            options={options}
                            value={valueToSend}
                            unit={unitToSend}
                            name={displayName}
                            thresholdColor={displayValue.color}
                        />
                    </div>
                );
            })}
        </div>
    );
};
