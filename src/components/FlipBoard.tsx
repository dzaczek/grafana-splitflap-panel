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
            if (options.mode === 'clock' && options.clock12h && amPm) {
                 // Even if 'none' (in text), we render it separately now so we need to account for it.
                 // Previously 'none' was part of value string length calculation automatically.
                 // Now formattedValueStr (clockStr) does NOT contain AM/PM.
                 
                 const amPmSize = (options.amPmFontSize || 18);
                 const amPmGap = options.amPmGap !== undefined ? options.amPmGap : 12;
                 
                 const charWidth = amPmSize * 0.7; // approx width factor
                 let estimatedWidth = 0;
                 if (options.amPmOrientation === 'vertical') {
                      estimatedWidth = charWidth; 
                 } else {
                      estimatedWidth = charWidth * amPm.length; 
                 }
                 availWidth -= (estimatedWidth + amPmGap);
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
            const maxCardWidth = Math.max(0, availWidth - totalGapWidth) / realDigitCount;
            
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
        const fontSize = options.amPmFontSize || 18;
        
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
    
    return { text: components.join('   '), amPm: finalAmPm };
}

// main panel component
interface Props extends PanelProps<FlipOptions> {}

export const FlipBoard: React.FC<Props> = ({ options, data, width, height }) => {
    
    // Inject fonts for Aviation styles
    const fontImport = useMemo(() => {
        if (options.theme && options.theme.startsWith('aviation-')) {
             return (
                 <style>
                     {`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Share+Tech+Mono&display=swap');`}
                 </style>
             );
        }
        return null;
    }, [options.theme]);

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
        if (options.showTimezone && options.clockTimezone) {
            // Try to get a readable timezone name
            try {
                const timeZone = options.clockTimezone || undefined;
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZoneName: 'short',
                    timeZone: timeZone
                });
                const parts = formatter.formatToParts(currentTime);
                const tzPart = parts.find(p => p.type === 'timeZoneName');
                timezoneDisplay = tzPart ? tzPart.value : options.clockTimezone;
            } catch (e) {
                // Fallback to timezone string or find label from TIMEZONES
                timezoneDisplay = options.clockTimezone;
            }
        } else if (options.showTimezone && !options.clockTimezone) {
            // Browser local timezone
            try {
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZoneName: 'short'
                });
                const parts = formatter.formatToParts(currentTime);
                const tzPart = parts.find(p => p.type === 'timeZoneName');
                timezoneDisplay = tzPart ? tzPart.value : 'Local';
            } catch (e) {
                timezoneDisplay = 'Local';
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
                {fontImport}
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

    const count = seriesList.length;
    const isVertical = options.layoutDirection !== 'horizontal'; 

    // calculate item dimensions
    // use floor to avoid fractional pixels that break rendering
    const itemWidth = isVertical ? width : Math.floor(width / count);
    const itemHeight = isVertical ? Math.floor(height / count) : height;

    return (
        <div style={{
            width,
            height,
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            overflow: 'hidden'
        }}>
            {fontImport}
            {seriesList.map((series, i) => {
                // find appropriate field to display
                // prefer number, then string, but avoid 'time' fields unless nothing else exists
                const field = series.fields.find(f => f.type === 'number') 
                           || series.fields.find(f => f.type === 'string')
                           || series.fields.find(f => f.type !== 'time') 
                           || series.fields[0];
                           
                // reduce values based on selected aggregation
                const rawValue = reduceValues(field.values, options.valueAggregation);
                
                const displayName = getFieldDisplayName(field, series, data.series);
                
                // calculate base value
                let baseValue = (rawValue !== null && rawValue !== undefined) ? rawValue : "---";
                
                // format number if needed before combining with string
                let displayBaseValue = baseValue;
                if (typeof baseValue === 'number') {
                    const decimals = options.rounding !== undefined ? options.rounding : 1;
                    displayBaseValue = baseValue.toFixed(decimals);
                }

                // determine what to display based on options
                let valueToSend = baseValue;
                const displayMode = options.displayContent || 'value';

                if (displayMode === 'value') {
                    // pass raw number to let engine handle animation logic better if possible,
                    // though for combined strings we must pass string
                    valueToSend = baseValue; 
                } else if (displayMode === 'name') {
                    valueToSend = displayName;
                } else if (displayMode === 'name_value') {
                    // add extra spaces to visually separate text ending with digit from the value
                    valueToSend = `${displayName}   ${displayBaseValue}`;
                } else if (displayMode === 'value_name') {
                    valueToSend = `${displayBaseValue}   ${displayName}`;
                }

                const unitToSend = options.customUnit || field.config.unit || '';

                const displayValue = field.display ? field.display(baseValue) : { color: undefined };
                let itemBg = 'transparent';
                if (options.thresholdTarget === 'panel' && displayValue.color) {
                    itemBg = displayValue.color;
                }

                // separator lines
                const borderColor = 'rgba(255, 255, 255, 0.1)';
                const borderStyle: React.CSSProperties = {
                    width: itemWidth, 
                    height: itemHeight, 
                    background: itemBg,
                    position: 'relative',
                    // flex center to center content in grid cell
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        key={i} 
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
