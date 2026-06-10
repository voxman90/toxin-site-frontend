import type { TFunction } from 'i18next';

import { mod } from '../../utils/utils';

import {
  BOUNDS,
  CAROUSEL_ITEMS_COUNT,
  GRID,
  I18N,
  YEAR_SHEET_FIRST_MONTH_INDEX,
} from './Calendar.constants';
import type {
  CalendarState,
  MonthIndex,
  MonthSheet,
  Output,
  SheetFormat,
  Shift,
  Trace,
  YearSheet,
} from './Calendar.types';

export const toDate = (val: string | null | undefined): Date | null => (val ? new Date(val) : null);

export const toString = (val: Date | null): string | null => (val ? val.toISOString() : null);

export const getToday = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const isSameYear = (a: Date, b: Date) => a.getFullYear() === b.getFullYear();

export const isSameMonthAndYear = (a: Date, b: Date) =>
  a.getMonth() === b.getMonth() && isSameYear(a, b);

export const compareDates = (a: Date, b: Date): Shift => {
  return Math.sign(a.getTime() - b.getTime()) as Shift;
};

export const countDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDateOfMonth = (date: Date, shift: Shift = 0) => {
  return new Date(date.getFullYear(), date.getMonth() + shift, 1);
};

export const getMonth = (date: Date, shift: Shift = 0) => getFirstDateOfMonth(date, shift);

export const getYear = (date: Date, shift: Shift = 0) => {
  return new Date(date.getFullYear() + shift, 0, 1);
};

export const getSheetDate = (date: Date, shift: Shift, format: SheetFormat) => {
  return format === 'month' ? getMonth(date, shift) : getYear(date, shift);
};

export const getFirstDayOfMonthIndex = (month: Date) => {
  return (getFirstDateOfMonth(month, 0).getDay() + 6) % 7;
};

export const getSheetIndex = (currentIndex: number, shift: Shift) => {
  return mod(currentIndex + shift, CAROUSEL_ITEMS_COUNT);
};

export const compareMonths = (a: Date, b: Date): Shift => {
  const fullYearA = a.getFullYear();
  const fullYearB = b.getFullYear();
  const monthA = a.getMonth();
  const monthB = b.getMonth();

  if (fullYearA === fullYearB) {
    return Math.sign(monthA - monthB) as Shift;
  }

  return Math.sign(fullYearA - fullYearB) as Shift;
};

export const compareYears = (a: Date, b: Date): Shift => {
  return Math.sign(a.getFullYear() - b.getFullYear()) as Shift;
};

export const getInitialTraceState = (currentOutput?: Output): Trace => ({
  to: currentOutput?.to ?? null,
  from: currentOutput?.from ?? null,
  today: getToday(),
});

export const convertDateToDDMMYYYY = (date: Date | null, placeholder = '') => {
  if (!date) {
    return placeholder;
  }

  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);

  return `${day}.${month}.${date.getFullYear()}`;
};

export const convertDatesToDDMDDM = (
  { from, to }: Output,
  placeholder: string,
  t: TFunction<typeof I18N.NS, typeof I18N.PREFIX>,
) => {
  const getDDM = (date: Date | null) => {
    if (!date) {
      return placeholder;
    }

    const dateMonth = date.getMonth() as MonthIndex;
    const dateMonthName = t(`month${dateMonth}`).slice(0, 3);

    return `${date.getDate()} ${dateMonthName}`;
  };

  return `${getDDM(from)} – ${getDDM(to)}`;
};

export const getInitialCalendarState = (initialDate?: Date | null): CalendarState => ({
  sheetFormat: 'month',
  activeSheetIndex: 1,
  activeSheetDate: initialDate ?? getToday(),
  isSliding: false,
  slidingToIndex: null,
  slidingToDate: null,
  targetSheetFormat: null,
  isZooming: false,
  isExitingSheetRendered: false,
  exitingSheetDate: null,
  enteringSheetDate: null,
});

export const getYearSheet = (
  year: Date,
  t: TFunction<typeof I18N.NS, typeof I18N.PREFIX>,
): YearSheet => {
  const fullYear = year.getFullYear();

  const startDate = new Date(fullYear, -YEAR_SHEET_FIRST_MONTH_INDEX, 1);

  const months = Array.from({ length: GRID.YEAR_SHEET_SIZE }, (_, i) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const monthIndex = date.getMonth() as MonthIndex;

    return {
      name: t(`month${monthIndex}`),
      date,
    };
  });

  return {
    months,
    year,
    firstMonthIndex: YEAR_SHEET_FIRST_MONTH_INDEX,
    lastMonthIndex: YEAR_SHEET_FIRST_MONTH_INDEX + 11,
  };
};

export const getMonthSheet = (date: Date): MonthSheet => {
  const daysInMonth = countDaysInMonth(date);
  const firstDayIndex = getFirstDayOfMonthIndex(date);
  const lastDayIndex = firstDayIndex + daysInMonth - 1;

  const startDate = new Date(date.getFullYear(), date.getMonth(), -firstDayIndex + 1);

  const dates = Array.from({ length: GRID.MONTH_SHEET_SIZE }, (_, i) => {
    return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
  });

  return {
    dates,
    month: getFirstDateOfMonth(date),
    firstDayIndex,
    lastDayIndex,
  };
};

export const getSheetTitle = (
  date: Date,
  sheetFormat: SheetFormat,
  t: TFunction<typeof I18N.NS, typeof I18N.PREFIX>,
) => {
  const fullYear = date.getFullYear();

  switch (sheetFormat) {
    case 'month': {
      const monthIndex = date.getMonth() as MonthIndex;

      return `${t(`month${monthIndex}`)} ${fullYear}`;
    }
    case 'year': {
      return `${fullYear}`;
    }
  }
};

export const getTraceIndexesForSheet = <TSheet>(
  { from, to, today }: Omit<Trace, 'pickMode'>,
  sheet: TSheet,
  converter: (date: Date | null, sheet: TSheet) => number | null,
) => ({
  from: converter(from, sheet),
  to: converter(to, sheet),
  today: converter(today, sheet),
});

export const getYearSheetIndexForDate = (date: Date | null, sheet: YearSheet): number | null => {
  if (date === null) {
    return null;
  }

  const { months } = sheet;
  const firstDateOfSheet = months[0].date;
  const lastDateOfSheet = months[months.length - 1].date;

  if (compareMonths(date, firstDateOfSheet) === -1) {
    return BOUNDS.OUT_OF_RANGE_MIN;
  }

  if (compareMonths(date, lastDateOfSheet) === 1) {
    return BOUNDS.OUT_OF_RANGE_MAX;
  }

  return months.findIndex((month) => isSameMonthAndYear(month.date, date));
};

export const getMonthSheetIndexForDate = (
  date: Date | null,
  { dates }: MonthSheet,
): number | null => {
  if (date === null) {
    return null;
  }

  const firstDateOfSheet = dates[0];
  const lastDateOfSheet = dates[dates.length - 1];

  if (compareDates(date, firstDateOfSheet) < 0) {
    return BOUNDS.OUT_OF_RANGE_MIN;
  }

  if (compareDates(date, lastDateOfSheet) > 0) {
    return BOUNDS.OUT_OF_RANGE_MAX;
  }

  return dates.findIndex(
    (sheetDate) => isSameMonthAndYear(sheetDate, date) && sheetDate.getDate() === date.getDate(),
  );
};

export const getBestFocusDate = (baseDate: Date, trace: Trace, format: SheetFormat): Date => {
  if (format === 'year') {
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  }

  if (trace.from && isSameMonthAndYear(trace.from, baseDate)) {
    return trace.from;
  }

  if (trace.to && isSameMonthAndYear(trace.to, baseDate)) {
    return trace.to;
  }

  if (isSameMonthAndYear(trace.today, baseDate)) {
    return trace.today;
  }

  return baseDate;
};
