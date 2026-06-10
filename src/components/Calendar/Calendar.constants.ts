export const I18N = {
  NS: 'components',
  PREFIX: 'calendar',
} as const;

export const DAY_MS = 86400000;

const YEAR_ROWS = 5;
const YEAR_COLS = 4;
const MONTH_ROWS = 6;
const MONTH_DAYS = 7;

export const GRID = {
  YEAR_ROWS,
  YEAR_COLS,
  MONTH_ROWS,
  MONTH_DAYS,
  YEAR_SHEET_SIZE: YEAR_ROWS * YEAR_COLS,
  MONTH_SHEET_SIZE: MONTH_ROWS * MONTH_DAYS,
} as const;

export const YEAR_ROW_INDECES = Array.from({ length: GRID.YEAR_ROWS }, (_, i) => i);
export const YEAR_COL_INDECES = Array.from({ length: GRID.YEAR_COLS }, (_, i) => i);
export const MONTH_ROW_INDECES = Array.from({ length: GRID.MONTH_ROWS }, (_, i) => i);
export const MONTH_DAYS_INDECES = Array.from({ length: GRID.MONTH_DAYS }, (_, i) => i);

export const CAROUSEL_ITEMS_COUNT = 3;
export const CAROUSEL_ITEMS_INDECES = Array.from({ length: CAROUSEL_ITEMS_COUNT }, (_, i) => i);

export const BOUNDS = {
  OUT_OF_RANGE_MIN: Number.MIN_SAFE_INTEGER,
  OUT_OF_RANGE_MAX: Number.MAX_SAFE_INTEGER,
} as const;

export const YEAR_SHEET_FIRST_MONTH_INDEX = 4;

const DURATION_MS = 300;
const SAFETY_THRESHOLD_MS = 200;

export const CALENDAR_ANIMATION_CONFIG = {
  DURATION_MS,
  SAFETY_THRESHOLD_MS,
  TOTAL_TIMEOUT_MS: DURATION_MS + SAFETY_THRESHOLD_MS,
  MOTION_DURATION_S: DURATION_MS / 1000,
} as const;

export const NOOP = () => {};
