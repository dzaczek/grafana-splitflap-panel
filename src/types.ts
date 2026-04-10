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

  // UKŁAD
  layoutDirection: 'vertical' | 'horizontal';
  showSeparators: boolean;
  displayContent: 'value' | 'name' | 'name_value' | 'value_name';
  valueAggregation: 'last' | 'lastNotNull' | 'first' | 'firstNotNull' | 'min' | 'max' | 'mean' | 'sum' | 'count';

  // Nowa opcja
  forceNumeric: boolean;

  // Alignment (for default and board views)
  textAlign: 'left' | 'center' | 'right';

  // Board mode (Solari display)
  displayMode: 'default' | 'board';
  boardTitle: string;
  boardShowHeader: boolean;
  boardColumnNames: string;
  boardSplitToColumns: boolean;
  boardFrameColor: string;
  boardHeaderBg: string;
  boardHeaderTextColor: string;
  boardRowSeparator: boolean;
  boardColumnAlign: 'left' | 'center' | 'right';
  boardHeaderFontSize: number;
  boardColumnHeaderFontSize: number;
  boardFrameWidth: number;
  boardShowRowNumbers: boolean;
  boardCompact: boolean;
  boardAutoColumnNames: boolean;
  boardScrollable: boolean;
  boardTrueWall: boolean;
}
