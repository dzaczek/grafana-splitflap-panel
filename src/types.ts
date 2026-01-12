export interface FlipOptions {
  mode: 'data' | 'clock';

  // Clock specific
  clock12h: boolean;
  clockTimezone: string;
  clockShowSeconds: boolean;
  clockSeparator: string;
  clockDateFormat: string;
  clockDayOfWeek: boolean;
  showTimezone: boolean;
  timezonePos: 'top' | 'bottom' | 'left' | 'right';
  timezoneAlign: 'start' | 'center' | 'end';
  timezoneFontSize: number;
  timezoneDisplayMode: 'standard' | 'region' | 'custom';
  timezoneCustomName: string;

  // AM/PM (Clock 12h)
  amPmFontSize: number;
  amPmPos: 'left' | 'right' | 'none';
  amPmGap: number;
  amPmOrientation: 'horizontal' | 'vertical';

  theme: string;
  digitCount: number;
  autoSize: boolean;
  cardSize: number;
  gap: number;
  rounding: number;
  speed: number;
  spinSpeed: number;
  thresholdTarget: 'none' | 'text' | 'tile' | 'panel';

  // Jednostki
  showUnit: boolean;
  unitPos: 'top' | 'bottom' | 'left' | 'right' | 'none'; 
  unitAlign: 'start' | 'center' | 'end'; 
  unitRotation: boolean; 
  customUnit: string; 
  unitFontSize: number;

  // Nazwy
  showName: boolean;
  namePos: 'top' | 'bottom' | 'left' | 'right';
  nameAlign: 'start' | 'center' | 'end';
  nameFontSize: number;
  
  // UKŁAD (Kluczowe dla Twojego problemu)
  layoutDirection: 'vertical' | 'horizontal';
  showSeparators: boolean;
  displayContent: 'value' | 'name' | 'name_value' | 'value_name';
  valueAggregation: 'last' | 'lastNotNull' | 'first' | 'firstNotNull' | 'min' | 'max' | 'mean' | 'sum' | 'count';
  
  // Nowa opcja
  forceNumeric: boolean;
}
