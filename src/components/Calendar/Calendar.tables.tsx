import { clsx } from 'clsx';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarTrace } from './Calendar.components';
import {
  GRID,
  I18N,
  MONTH_DAYS_INDECES,
  MONTH_ROW_INDECES,
  NOOP,
  YEAR_COL_INDECES,
  YEAR_ROW_INDECES,
} from './Calendar.constants';
import type {
  DayIndex,
  MonthIndex,
  MonthSheet,
  MonthTableProps,
  SheetTableProps,
  YearSheet,
  YearTableProps,
} from './Calendar.types';
import {
  compareDates,
  getMonthSheet,
  getMonthSheetIndexForDate,
  getTraceIndexesForSheet,
  getYearSheet,
  getYearSheetIndexForDate,
  isSameMonthAndYear,
} from './Calendar.utils';

const YearTable = memo(
  ({
    trace,
    sheet,
    focusedDate,
    focusedTarget,
    onRegister,
    handleCellClick = NOOP,
    handleGridKeyDown = NOOP,
  }: YearTableProps) => {
    const { months, lastMonthIndex, firstMonthIndex, year } = sheet;
    const traceIndexes = useMemo(
      () => getTraceIndexesForSheet(trace, sheet, getYearSheetIndexForDate),
      [trace, sheet],
    );
    const { from, to } = traceIndexes;

    return (
      <table
        ref={onRegister}
        className={clsx('calendar__table', 'calendar__table--year')}
        onKeyDown={(e) => handleGridKeyDown?.(e, handleCellClick)}
        role="grid"
        aria-label={`${year.getFullYear()}`}
      >
        <tbody>
          {YEAR_ROW_INDECES.map((_, rowIndex) => (
            <tr key={rowIndex} role="row">
              {YEAR_COL_INDECES.map((_, monthIndex) => {
                const i = GRID.YEAR_COLS * rowIndex + monthIndex;
                const { date, name } = months[i];
                const isCurrent = firstMonthIndex <= i && i <= lastMonthIndex;
                const isSelected = from !== null && to !== null && from <= i && i <= to;
                const isFocusable = focusedDate && isSameMonthAndYear(date, focusedDate);
                const shouldShowRing = isFocusable && focusedTarget === 'grid';

                return (
                  <td
                    key={i}
                    className={clsx('calendar__td', {
                      'calendar__td--current': isCurrent,
                      'calendar__td--focused': shouldShowRing,
                    })}
                    data-index={i}
                    data-date={date.getTime()}
                    onClick={(e) => handleCellClick(date, e)}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={`${name} ${date.getFullYear()}`}
                    tabIndex={isFocusable ? 0 : -1}
                  >
                    <CalendarTrace i={i} traceIndexes={traceIndexes} sheetFormat="year">
                      {name.slice(0, 3)}
                    </CalendarTrace>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);

const MonthTableHeader = memo(() => {
  const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });

  return (
    <tr className="calendar__month-table-header-tr">
      {MONTH_DAYS_INDECES.map((_, i) => (
        <th key={i}>{t(`day${i as DayIndex}`)}</th>
      ))}
    </tr>
  );
});

const MonthTable = memo(
  ({
    sheet,
    trace,
    previewTrace,
    focusedDate,
    focusedTarget,
    onRegister,
    handleCellClick = NOOP,
    handleCellHover = NOOP,
    handleGridKeyDown = NOOP,
  }: MonthTableProps) => {
    const { dates, firstDayIndex, lastDayIndex, month } = sheet;
    const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });

    const traceIndexes = useMemo(
      () => getTraceIndexesForSheet(trace, sheet, getMonthSheetIndexForDate),
      [trace, sheet],
    );
    const previewIndexes = useMemo(
      () =>
        getTraceIndexesForSheet(
          { ...previewTrace, today: trace.today },
          sheet,
          getMonthSheetIndexForDate,
        ),
      [trace, previewTrace, sheet],
    );

    const { from, to } = traceIndexes;
    const tableMonthName = t(`month${month.getMonth() as MonthIndex}`);
    const tableYear = month.getFullYear();

    return (
      <table
        ref={onRegister}
        className={clsx('calendar__table', 'calendar__table--month')}
        onMouseLeave={() => handleCellHover(null)}
        onKeyDown={(e) => handleGridKeyDown(e, handleCellClick)}
        role="grid"
        aria-label={`${tableMonthName} ${tableYear}`}
      >
        <thead>
          <MonthTableHeader />
        </thead>
        <tbody>
          {MONTH_ROW_INDECES.map((_, rowIndex) => (
            <tr key={rowIndex} role="row">
              {MONTH_DAYS_INDECES.map((_, dayIndex) => {
                const i = GRID.MONTH_DAYS * rowIndex + dayIndex;
                const date = dates[i];
                const isCurrMonth = firstDayIndex <= i && i <= lastDayIndex;
                const isSelected = from !== null && to !== null && from <= i && i <= to;
                const isFocusable = focusedDate && compareDates(date, focusedDate) === 0;
                const shouldShowRing = isFocusable && focusedTarget === 'grid';
                const day = date.getDate();
                const monthName = t(`month${date.getMonth() as MonthIndex}`);
                const year = date.getFullYear();

                return (
                  <td
                    key={i}
                    className={clsx('calendar__td', {
                      'calendar__td--current': isCurrMonth,
                      'calendar__td--focused': shouldShowRing,
                    })}
                    data-index={i}
                    data-date={date.getTime()}
                    onMouseEnter={() => isCurrMonth && handleCellHover(date)}
                    onClick={(e) => handleCellClick(date, e)}
                    tabIndex={isFocusable ? 0 : -1}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={`${day} ${monthName} ${year}`}
                  >
                    <CalendarTrace
                      i={i}
                      traceIndexes={traceIndexes}
                      previewIndexes={previewIndexes}
                      sheetFormat="month"
                    >
                      {day}
                    </CalendarTrace>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);

const SheetTable = memo(
  ({
    format,
    trace,
    previewTrace,
    date,
    focusedDate,
    focusedTarget,
    onRegister,
    handleCellClick,
    handleCellHover,
    handleGridKeyDown,
  }: SheetTableProps) => {
    const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });
    const sheet = useMemo(() => {
      return format === 'month' ? getMonthSheet(date) : getYearSheet(date, t);
    }, [format, date, t]);

    switch (format) {
      case 'month': {
        return (
          <MonthTable
            sheet={sheet as MonthSheet}
            trace={trace}
            previewTrace={previewTrace}
            focusedDate={focusedDate}
            focusedTarget={focusedTarget}
            onRegister={onRegister}
            handleCellClick={handleCellClick}
            handleCellHover={handleCellHover}
            handleGridKeyDown={handleGridKeyDown}
          />
        );
      }
      case 'year': {
        return (
          <YearTable
            sheet={sheet as YearSheet}
            trace={trace}
            focusedDate={focusedDate}
            focusedTarget={focusedTarget}
            onRegister={onRegister}
            handleCellClick={handleCellClick}
            handleGridKeyDown={handleGridKeyDown}
          />
        );
      }
    }
  },
);

export { MonthTableHeader, SheetTable };
