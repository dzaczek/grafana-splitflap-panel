import { PanelPlugin, PanelOptionsEditorBuilder } from '@grafana/data';
import { FlipOptions } from './types';
import { FlipBoard } from './components/FlipBoard';
import moment from 'moment-timezone';

const TIMEZONES = [
  { value: '', label: 'Browser Local' },
  { value: 'UTC', label: 'UTC' },
  ...moment.tz.names().map(t => ({ value: t, label: t }))
];

export const plugin = new PanelPlugin<FlipOptions>(FlipBoard)
  .useFieldConfig()
  .setPanelOptions((builder: PanelOptionsEditorBuilder<FlipOptions>) => {
  return builder
    .addRadio({
        path: 'mode',
        name: 'Mode',
        defaultValue: 'data',
        settings: {
            options: [
                { value: 'data', label: 'Data Series', icon: 'chart-line' },
                { value: 'clock', label: 'Clock', icon: 'clock' },
            ]
        }
    })
    
    // CLOCK OPTIONS
    .addBooleanSwitch({
        path: 'clock12h',
        name: '12-Hour Format',
        defaultValue: false,
        showIf: c => c.mode === 'clock'
    })
    
    // AM/PM Options (only if clock12h is true)
    .addSelect({
        path: 'amPmPos',
        name: 'AM/PM Position',
        defaultValue: 'none',
        settings: {
            options: [
                { value: 'none', label: 'In Text (Default)' },
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
            ]
        },
        showIf: c => c.mode === 'clock' && c.clock12h
    })
    .addSelect({
        path: 'amPmOrientation',
        name: 'AM/PM Orientation',
        defaultValue: 'horizontal',
        settings: {
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
            ]
        },
        showIf: c => c.mode === 'clock' && c.clock12h
    })
    .addSliderInput({
        path: 'amPmFontSize',
        name: 'AM/PM Font Size',
        defaultValue: 18,
        settings: { min: 8, max: 100 },
        showIf: c => c.mode === 'clock' && c.clock12h
    })
    .addSliderInput({
        path: 'amPmGap',
        name: 'AM/PM Gap',
        defaultValue: 12,
        settings: { min: 0, max: 50 },
        showIf: c => c.mode === 'clock' && c.clock12h
    })

    .addBooleanSwitch({
        path: 'clockShowSeconds',
        name: 'Show Seconds',
        defaultValue: true,
        showIf: c => c.mode === 'clock'
    })
    .addSelect({
        path: 'clockTimezone',
        name: 'Timezone',
        defaultValue: '',
        settings: {
            options: TIMEZONES
        },
        description: 'Select timezone',
        showIf: c => c.mode === 'clock'
    })
    .addSelect({
        path: 'clockSeparator',
        name: 'Time Separator',
        defaultValue: 'colon',
        settings: {
            options: [
                { value: 'colon', label: 'Colon (:)' },
                { value: 'dot', label: 'Dot (.)' },
                { value: 'dash', label: 'Dash (-)' },
                { value: 'space', label: 'Space ( )' },
                { value: 'none', label: 'None' },
            ]
        },
        showIf: c => c.mode === 'clock'
    })
    .addSelect({
        path: 'clockDateFormat',
        name: 'Date Format',
        defaultValue: '',
        settings: {
            options: [
                { value: '', label: 'None' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
            ]
        },
        showIf: c => c.mode === 'clock'
    })
    .addBooleanSwitch({
        path: 'clockDayOfWeek',
        name: 'Show Day of Week (Short)',
        defaultValue: false,
        showIf: c => c.mode === 'clock'
    })
    .addBooleanSwitch({
        path: 'showTimezone',
        name: 'Show Timezone',
        defaultValue: false,
        showIf: c => c.mode === 'clock'
    })
    .addSelect({
        path: 'timezoneDisplayMode',
        name: 'Timezone Display',
        defaultValue: 'standard',
        settings: {
            options: [
                { value: 'standard', label: 'Standard (e.g. EST, CET)' },
                { value: 'region', label: 'Region (e.g. New_York, Warsaw)' },
                { value: 'custom', label: 'Custom Name' },
            ]
        },
        showIf: c => c.mode === 'clock' && c.showTimezone
    })
    .addTextInput({
        path: 'timezoneCustomName',
        name: 'Custom Name',
        defaultValue: '',
        showIf: c => c.mode === 'clock' && c.showTimezone && c.timezoneDisplayMode === 'custom'
    })
    .addSelect({
        path: 'timezonePos',
        name: 'Timezone Position',
        defaultValue: 'bottom',
        settings: {
            options: [
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' },
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
            ]
        },
        showIf: c => c.mode === 'clock'
    })
    .addSelect({
        path: 'timezoneAlign',
        name: 'Timezone Alignment',
        defaultValue: 'center',
        settings: {
            options: [
                { value: 'start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'end', label: 'End' },
            ]
        },
        showIf: c => c.mode === 'clock'
    })
    .addSliderInput({
        path: 'timezoneFontSize',
        name: 'Timezone Font Size',
        defaultValue: 18,
        settings: { min: 8, max: 100 },
        showIf: c => c.mode === 'clock'
    })

    // DATA OPTIONS (Hidden in Clock Mode)
    .addRadio({
        path: 'displayMode',
        name: 'Display Mode',
        defaultValue: 'default',
        settings: {
            options: [
                { value: 'default', label: 'Default' },
                { value: 'board', label: 'Board (Solari)' },
            ]
        },
        showIf: c => c.mode !== 'clock'
    })
    .addSelect({
        path: 'textAlign',
        name: 'Text Alignment',
        description: 'Align flip characters within the display',
        defaultValue: 'center',
        settings: {
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
            ]
        },
        showIf: c => c.mode !== 'clock'
    })

    // BOARD OPTIONS
    .addBooleanSwitch({
        path: 'boardShowHeader',
        name: 'Show Board Header',
        defaultValue: true,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addTextInput({
        path: 'boardTitle',
        name: 'Board Title',
        defaultValue: 'DEPARTURES',
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardShowHeader
    })
    .addSliderInput({
        path: 'boardHeaderFontSize',
        name: 'Header Font Size',
        defaultValue: 18,
        settings: { min: 10, max: 48 },
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardShowHeader
    })
    .addBooleanSwitch({
        path: 'boardSplitToColumns',
        name: 'Split to Columns',
        description: 'Split each data series into separate columns on the board',
        defaultValue: false,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addBooleanSwitch({
        path: 'boardAutoColumnNames',
        name: 'Auto Column Names',
        description: 'Automatically use field names as column headers',
        defaultValue: true,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardSplitToColumns
    })
    .addTextInput({
        path: 'boardColumnNames',
        name: 'Column Names',
        description: 'Comma-separated column header names (e.g. "Flight,Destination,Time,Status"). Overrides auto names.',
        defaultValue: '',
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardSplitToColumns && !c.boardAutoColumnNames
    })
    .addSliderInput({
        path: 'boardColumnHeaderFontSize',
        name: 'Column Header Font Size',
        defaultValue: 11,
        settings: { min: 8, max: 24 },
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardSplitToColumns
    })
    .addSelect({
        path: 'boardColumnAlign',
        name: 'Column Alignment',
        defaultValue: 'left',
        settings: {
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
            ]
        },
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardSplitToColumns
    })
    .addBooleanSwitch({
        path: 'boardShowRowNumbers',
        name: 'Show Row Numbers',
        description: 'Display row index on the left side',
        defaultValue: false,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addBooleanSwitch({
        path: 'boardRowSeparator',
        name: 'Row Separators',
        defaultValue: true,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addBooleanSwitch({
        path: 'boardTrueWall',
        name: 'True Wall Display',
        description: 'Realistic recessed cells with depth shadows — like a real Solari board where flip mechanisms sit inside wall cavities',
        defaultValue: false,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addBooleanSwitch({
        path: 'boardCompact',
        name: 'Compact Mode',
        description: 'Reduce padding for denser display',
        defaultValue: false,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addBooleanSwitch({
        path: 'boardScrollable',
        name: 'Scrollable Rows',
        description: 'Enable scrolling when rows overflow the panel height',
        defaultValue: false,
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addSliderInput({
        path: 'boardFrameWidth',
        name: 'Frame Width',
        defaultValue: 8,
        settings: { min: 0, max: 24 },
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addColorPicker({
        path: 'boardFrameColor',
        name: 'Frame Color',
        defaultValue: '#1a1a1a',
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board'
    })
    .addColorPicker({
        path: 'boardHeaderBg',
        name: 'Header Background',
        defaultValue: '#2a2a2a',
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardShowHeader
    })
    .addColorPicker({
        path: 'boardHeaderTextColor',
        name: 'Header Text Color',
        defaultValue: '#f7d100',
        showIf: c => c.mode !== 'clock' && c.displayMode === 'board' && c.boardShowHeader
    })

    // DEFAULT MODE OPTIONS
    .addSelect({
        path: 'layoutDirection',
        name: 'Layout',
        defaultValue: 'horizontal',
        settings: {
            options: [
                { value: 'horizontal', label: 'Horizontal (Side by Side)', icon: 'arrow-right' },
                { value: 'vertical', label: 'Vertical (List)', icon: 'arrow-down' },
            ]
        },
        showIf: c => c.mode !== 'clock' && c.displayMode !== 'board'
    })
    .addSelect({
        path: 'displayContent',
        name: 'Main Content',
        description: 'What to display inside the flip cards',
        defaultValue: 'value',
        settings: {
            options: [
                { value: 'value', label: 'Value Only' },
                { value: 'name', label: 'Name Only' },
                { value: 'name_value', label: 'Name + Value' },
                { value: 'value_name', label: 'Value + Name' },
            ]
        },
        showIf: c => c.mode !== 'clock'
    })
    .addSelect({
        path: 'valueAggregation',
        name: 'Value Aggregation',
        description: 'How to reduce multiple values in a series to a single number',
        defaultValue: 'last',
        settings: {
            options: [
                { value: 'last', label: 'Last (Default)' },
                { value: 'lastNotNull', label: 'Last (Not Null)' },
                { value: 'first', label: 'First' },
                { value: 'firstNotNull', label: 'First (Not Null)' },
                { value: 'min', label: 'Min' },
                { value: 'max', label: 'Max' },
                { value: 'mean', label: 'Mean (Average)' },
                { value: 'sum', label: 'Sum' },
                { value: 'count', label: 'Count' },
            ]
        },
        showIf: c => c.mode !== 'clock'
    })
    .addBooleanSwitch({
        path: 'showSeparators',
        name: 'Show Separators',
        description: 'Show lines separating data series',
        defaultValue: false,
        showIf: c => c.mode !== 'clock' && c.displayMode !== 'board'
    })

    .addSelect({
      path: 'theme',
      name: 'Theme',
      defaultValue: 'classic',
      settings: {
        options: [
          { value: 'classic', label: 'Classic (Flat)' },
          { value: 'classic-3d', label: 'Classic 3D' },
          { value: 'aviation-departure', label: 'Aviation: Departure (Yel/Blk)' },
          { value: 'aviation-cockpit', label: 'Aviation: Cockpit (Cyan/Gray)' },
          { value: 'aviation-tarmac', label: 'Aviation: Tarmac (Org/Gry)' },
          { value: 'swiss-sbb-black', label: 'Swiss SBB: Black' },
          { value: 'swiss-sbb-white', label: 'Swiss SBB: White' },
          { value: 'swiss-sbb-blue', label: 'Swiss SBB: Blue (Red Border)' },
          { value: 'airport', label: 'Retro Airport (Gold/Dark)' },
          { value: 'mechanical', label: 'Mechanical (White/Metal)' },
          { value: 'cyberpunk', label: 'Cyberpunk (Cyan/Black)' },
          { value: 'matrix', label: 'Matrix (Digital Rain)' },
          { value: 'rainbow', label: 'Rainbow (Colorful)' },
          { value: 'newspaper', label: 'Newspaper (Halftone)' },
          { value: 'glass', label: 'Glass (Frosted)' },
          { value: 'blue-glass', label: 'Blue Glass' },
          { value: 'e-ink', label: 'E-Ink (Paper)' },
          { value: 'ios-light', label: 'iOS Light' },
          { value: 'ios-dark', label: 'iOS Dark' },
          { value: 'neon', label: 'Neon' },
          { value: 'wood', label: 'Wood' },
          { value: 'red-3d', label: 'Red 3D' },
        ],
      },
    })
    
    .addBooleanSwitch({ path: 'showName', name: 'Show Name', defaultValue: true, showIf: c => c.mode !== 'clock' })
    .addSelect({ path: 'namePos', name: 'Name Pos', defaultValue: 'top', settings: { options: [{value:'top',label:'Top'},{value:'bottom',label:'Bottom'},{value:'left',label:'Left'},{value:'right',label:'Right'}]}, showIf: c => c.mode !== 'clock' && c.showName })
    .addSelect({ path: 'nameAlign', name: 'Name Align', defaultValue: 'center', settings: { options: [{value:'start',label:'Start'},{value:'center',label:'Center'},{value:'end',label:'End'}]}, showIf: c => c.mode !== 'clock' && c.showName })
    .addSliderInput({ path: 'nameFontSize', name: 'Name Size', defaultValue: 18, settings: { min: 8, max: 100 }, showIf: c => c.mode !== 'clock' && c.showName })
    
    .addBooleanSwitch({ path: 'showUnit', name: 'Show Unit', defaultValue: true, showIf: c => c.mode !== 'clock' })
    .addTextInput({ path: 'customUnit', name: 'Custom Unit', defaultValue: '', showIf: c => c.mode !== 'clock' && c.showUnit })
    .addSelect({ path: 'unitPos', name: 'Unit Pos', defaultValue: 'right', settings: { options: [{value:'top',label:'Top'},{value:'bottom',label:'Bottom'},{value:'left',label:'Left'},{value:'right',label:'Right'}]}, showIf: c => c.mode !== 'clock' && c.showUnit })
    .addBooleanSwitch({ path: 'unitRotation', name: 'Rotate Unit', defaultValue: false, showIf: c => c.mode !== 'clock' && c.showUnit })
    .addSliderInput({ path: 'unitFontSize', name: 'Unit Size', defaultValue: 24, settings: { min: 8, max: 100 }, showIf: c => c.mode !== 'clock' && c.showUnit })

    .addSelect({ path: 'thresholdTarget', name: 'Threshold Target', defaultValue: 'none', settings: { options: [{value:'none',label:'None'},{value:'text',label:'Text'},{value:'tile',label:'Tile'},{value:'panel',label:'Panel'}]}, showIf: c => c.mode !== 'clock' })
    
    .addNumberInput({ 
        path: 'digitCount', 
        name: 'Min Characters', 
        description: 'Minimum number of characters to display. If the value is shorter, it will be padded with spaces.',
        defaultValue: 6 
    })
    .addSliderInput({ 
        path: 'rounding', 
        name: 'Decimal Places', 
        description: 'Number of decimal places to show for numeric values.',
        defaultValue: 1, 
        settings: { min: 0, max: 5 }, 
        showIf: c => c.mode !== 'clock' 
    })
    .addBooleanSwitch({ 
        path: 'forceNumeric', 
        name: 'Force Numeric (0-9)', 
        description: 'Use optimized flip sequence (0-9 and dot only). Recommended for counters to make them flip faster.',
        defaultValue: false,
        showIf: c => c.mode !== 'clock'
    })
    .addBooleanSwitch({ path: 'autoSize', name: 'Auto Fit', defaultValue: true })
    .addNumberInput({ path: 'cardSize', name: 'Size (px)', defaultValue: 50, showIf: c => !c.autoSize })
    .addSliderInput({ 
        path: 'gap', 
        name: 'Gap', 
        description: 'Space between individual characters (in pixels).',
        defaultValue: 4, 
        settings: { min: 0, max: 20 } 
    })
    .addSliderInput({ 
        path: 'speed', 
        name: 'Anim Speed', 
        description: 'General animation speed multiplier. Higher values mean slower flips.',
        defaultValue: 0.6, 
        settings: { min: 0.1, max: 2.0, step: 0.1 } 
    })
    .addSliderInput({ 
        path: 'spinSpeed', 
        name: 'Spin Speed', 
        description: 'Speed for fast spinning sequences (e.g. when value changes significantly). Lower values mean faster spin.',
        defaultValue: 0.08, 
        settings: { min: 0.05, max: 0.5, step: 0.01 } 
    });
});
