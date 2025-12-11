import { PanelPlugin, PanelOptionsEditorBuilder } from '@grafana/data';
import { FlipOptions } from './types';
import { FlipBoard } from './components/FlipBoard';

export const plugin = new PanelPlugin<FlipOptions>(FlipBoard)
  .useFieldConfig()
  .setPanelOptions((builder: PanelOptionsEditorBuilder<FlipOptions>) => {
  return builder
    .addRadio({
        path: 'layoutDirection',
        name: 'Layout',
        defaultValue: 'horizontal',
        settings: {
            options: [
                { value: 'horizontal', label: 'Horizontal (Side by Side)', icon: 'arrow-right' },
                { value: 'vertical', label: 'Vertical (List)', icon: 'arrow-down' },
            ]
        }
    })
    .addRadio({
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
        }
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
        }
    })
    .addBooleanSwitch({
        path: 'showSeparators',
        name: 'Show Separators',
        description: 'Show lines separating data series',
        defaultValue: false
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
    // ... Reszta opcji BEZ ZMIAN (digitCount, showName, showUnit, thresholds itd.) ...
    .addBooleanSwitch({ path: 'showName', name: 'Show Name', defaultValue: true })
    .addRadio({ path: 'namePos', name: 'Name Pos', defaultValue: 'top', settings: { options: [{value:'top',label:'Top'},{value:'bottom',label:'Bottom'},{value:'left',label:'Left'},{value:'right',label:'Right'}]}, showIf: c => c.showName })
    .addRadio({ path: 'nameAlign', name: 'Name Align', defaultValue: 'center', settings: { options: [{value:'start',label:'Start'},{value:'center',label:'Center'},{value:'end',label:'End'}]}, showIf: c => c.showName })
    .addSliderInput({ path: 'nameFontSize', name: 'Name Size', defaultValue: 18, settings: { min: 8, max: 100 }, showIf: c => c.showName })
    
    .addBooleanSwitch({ path: 'showUnit', name: 'Show Unit', defaultValue: true })
    .addTextInput({ path: 'customUnit', name: 'Custom Unit', defaultValue: '', showIf: c => c.showUnit })
    .addRadio({ path: 'unitPos', name: 'Unit Pos', defaultValue: 'right', settings: { options: [{value:'top',label:'Top'},{value:'bottom',label:'Bottom'},{value:'left',label:'Left'},{value:'right',label:'Right'}]}, showIf: c => c.showUnit })
    .addBooleanSwitch({ path: 'unitRotation', name: 'Rotate Unit', defaultValue: false, showIf: c => c.showUnit })
    .addSliderInput({ path: 'unitFontSize', name: 'Unit Size', defaultValue: 24, settings: { min: 8, max: 100 }, showIf: c => c.showUnit })

    .addRadio({ path: 'thresholdTarget', name: 'Threshold Target', defaultValue: 'none', settings: { options: [{value:'none',label:'None'},{value:'text',label:'Text'},{value:'tile',label:'Tile'},{value:'panel',label:'Panel'}]} })
    
    .addNumberInput({ path: 'digitCount', name: 'Digits', defaultValue: 6 })
    .addSliderInput({ path: 'rounding', name: 'Rounding', defaultValue: 1, settings: { min: 0, max: 5 } })
    .addBooleanSwitch({ path: 'autoSize', name: 'Auto Fit', defaultValue: true })
    .addNumberInput({ path: 'cardSize', name: 'Size (px)', defaultValue: 50, showIf: c => !c.autoSize })
    .addSliderInput({ path: 'gap', name: 'Gap', defaultValue: 4, settings: { min: 0, max: 20 } })
    .addSliderInput({ path: 'speed', name: 'Speed', defaultValue: 0.6, settings: { min: 0.1, max: 2.0, step: 0.1 } })
    .addSliderInput({ path: 'spinSpeed', name: 'Fast Speed', defaultValue: 0.12, settings: { min: 0.05, max: 0.5, step: 0.01 } });
});
