import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { CarouselRef } from '../Carousel';

import { CALENDAR_ANIMATION_CONFIG } from './Calendar.constants';
import type {
  CalendarProps,
  CalendarState,
  Output,
  SheetFormat,
  Shift,
  Trace,
} from './Calendar.types';
import {
  compareDates,
  compareMonths,
  getBestFocusDate,
  getFirstDateOfMonth,
  getInitialCalendarState,
  getInitialTraceState,
  getSheetDate,
  getSheetIndex,
  getToday,
  toDate,
  toString,
} from './Calendar.utils';
import useFocusManager from './useFocusManager';
import useKeyboardNavigation from './useKeyboardNavigation';

type UseCalendarParams<T extends FieldValues> = {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
} & Pick<CalendarProps<T>, 'sheetFormat' | 'nameTo' | 'nameFrom' | 'control'>;

export const useCalendar = <T extends FieldValues>({
  nameFrom,
  nameTo,
  control,
  isExpanded,
  setIsExpanded,
  sheetFormat: initialSheetFormat = 'month',
}: UseCalendarParams<T>) => {
  const {
    field: fieldFrom,
    fieldState: { error: errorFrom, invalid: isInvalidFrom },
  } = useController({ name: nameFrom, control });
  const {
    field: fieldTo,
    fieldState: { error: errorTo, invalid: isInvalidTo },
  } = useController({ name: nameTo, control });

  const currentOutput: Output = useMemo(
    () => ({
      from: toDate(fieldFrom.value),
      to: toDate(fieldTo.value),
    }),
    [fieldFrom.value, fieldTo.value],
  );

  const [trace, setTrace] = useState<Trace>(getInitialTraceState(currentOutput));
  const [state, setState] = useState<CalendarState>({
    ...getInitialCalendarState(currentOutput.from),
    sheetFormat: initialSheetFormat,
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<CarouselRef>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExpanded = useRef(isExpanded);
  const lastOpeningWasKeyboard = useRef(false);

  const isDirty = useMemo(
    () => !!(trace.to || trace.from || currentOutput.to || currentOutput.from),
    [currentOutput, trace.to, trace.from],
  );

  const carouselDates = useMemo(() => {
    return ([-1, 0, 1] as const).map((shift) =>
      getSheetDate(state.activeSheetDate, shift, state.sheetFormat),
    );
  }, [state.activeSheetDate, state.sheetFormat]);

  const previewTrace = useMemo(() => {
    const { from, to } = trace;

    if (!hoveredDate) {
      return { from: null, to: null };
    }

    if (!from || (from && to)) {
      return { from: hoveredDate, to: hoveredDate };
    }

    const isBefore = compareDates(hoveredDate, from) < 0;
    return {
      from: isBefore ? hoveredDate : from,
      to: isBefore ? from : hoveredDate,
    };
  }, [trace, hoveredDate]);

  const shiftSheet = useCallback(
    (shift: Shift) => {
      if (isAnimated || shift === 0) return;

      setIsAnimated(true);

      setState((state) => ({
        ...state,
        isSliding: true,
        slidingToDate: getSheetDate(state.activeSheetDate, shift, state.sheetFormat),
        slidingToIndex: getSheetIndex(state.activeSheetIndex, shift),
      }));

      if (shift === 1) {
        carouselRef.current?.next();
      } else {
        carouselRef.current?.prev();
      }
    },
    [isAnimated],
  );

  const handleCellHover = useCallback((date: Date | null) => {
    if (!date || compareDates(date, getToday()) < 0) {
      return setHoveredDate(null);
    }

    setHoveredDate(date);
  }, []);

  const {
    focusApi,
    focusedDate,
    focusedTarget,
    controller: focusController,
  } = useFocusManager({
    isSliding: state.isSliding,
    isZooming: state.isZooming,
    initialDate: currentOutput.from ?? getToday(),
  });

  const {
    handleGridKeyDown,
    handleNextKeyDown,
    handleApplyKeyDown,
    handleClearKeyDown,
    handleFocusTrap,
  } = useKeyboardNavigation({
    activeSheetDate: state.activeSheetDate,
    sheetFormat: state.sheetFormat,
    isSliding: state.isSliding,
    isZooming: state.isZooming,
    isDirty,
    focusedDate,
    shiftSheet,
    onHover: handleCellHover,
    focusController,
  });

  useEffect(() => {
    const isOpening = isExpanded && !lastExpanded.current;
    const isClosing = !isExpanded && lastExpanded.current;

    if (isOpening) {
      const target = getBestFocusDate(state.activeSheetDate, trace, state.sheetFormat);

      focusController.send('EXPANDED', {
        initialDate: target,
        show: lastOpeningWasKeyboard.current,
      });

      if (lastOpeningWasKeyboard.current) {
        setHoveredDate(target);
      }

      lastOpeningWasKeyboard.current = false;
    } else if (isClosing) {
      focusController.send('COLLAPSED');
      setHoveredDate(null);
    }

    lastExpanded.current = isExpanded;
  }, [isExpanded, focusController, state.activeSheetDate, state.sheetFormat, trace.from]);

  useEffect(() => {
    fieldFrom.ref(focusApi.from);
    fieldTo.ref(focusApi.to);
  }, [fieldFrom.ref, fieldTo.ref, focusApi]);

  useEffect(() => {
    if (!isExpanded) {
      const from = toDate(fieldFrom.value);
      const to = toDate(fieldTo.value);
      setTrace((trace) => ({ ...trace, from, to }));

      setState((state) => ({
        ...state,
        activeSheetDate: from ?? to ?? getToday(),
        sheetFormat: 'month',
      }));
    }
  }, [fieldFrom.value, fieldTo.value, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;

    const scheduleUpdate = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      return setTimeout(() => {
        setTrace((prev) => {
          const today = getToday();
          const { from, to } = prev;

          const isFromExpired = from && compareDates(from, today) < 0;
          const isToExpires = to && compareDates(to, today) < 0;

          return {
            ...prev,
            today,
            from: isFromExpired ? null : from,
            to: isToExpires ? null : to,
          };
        });

        scheduleUpdate();
      }, msUntilMidnight + 1000);
    };

    const timer = scheduleUpdate();

    return () => clearTimeout(timer);
  }, [isExpanded]);

  const pickRange = useCallback(
    (date: Date) => {
      setTrace((prev) => {
        const { from, to } = prev;

        if (((from && !to) || (!from && to)) && date) {
          const setEnd = from || to;
          const isBefore = compareDates(date, setEnd as Date) < 0;

          return {
            ...prev,
            from: isBefore ? date : setEnd,
            to: isBefore ? setEnd : date,
          };
        }

        return { ...prev, from: date, to: null };
      });
    },
    [trace.from, trace.to],
  );

  const handleOutputClick: MouseEventHandler = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();

      const isKeyboard = e.detail === 0 && e.type === 'click';
      lastOpeningWasKeyboard.current = isKeyboard;

      setIsExpanded(!isExpanded);
    },
    [isExpanded, setIsExpanded],
  );

  const handleZoomingEnd = useCallback(() => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
    }

    setIsAnimated(false);

    setState((state) => ({
      ...state,
      isZooming: false,
      isExitingSheetRendered: false,
      exitingSheetDate: null,
      enteringSheetDate: null,
      targetSheetFormat: null,
      sheetFormat: state.targetSheetFormat ?? state.sheetFormat,
    }));
  }, []);

  const runSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
    }

    safetyTimerRef.current = setTimeout(() => {
      if (isAnimated) {
        handleZoomingEnd();
      }
    }, CALENDAR_ANIMATION_CONFIG.TOTAL_TIMEOUT_MS);
  }, [isAnimated, handleZoomingEnd]);

  const handleYearCellClick = useCallback(
    (date: Date, e: React.KeyboardEvent | React.MouseEvent) => {
      if (isAnimated) return;

      const diff = Math.sign(date.getFullYear() - state.activeSheetDate.getFullYear());
      if (diff) {
        return shiftSheet(diff as Shift);
      }

      const isKeyboard = e.detail === 0 && e.type === 'keydown';

      setIsAnimated(true);
      runSafetyTimer();

      const target = getBestFocusDate(date, trace, 'month');
      focusController.send('NAVIGATE', { nextDate: target, needsShift: true, show: isKeyboard });

      setState((state) => ({
        ...state,
        activeSheetDate: date,
        isZooming: true,
        isExitingSheetRendered: true,
        enteringSheetDate: date,
        exitingSheetDate: state.activeSheetDate,
        targetSheetFormat: 'month',
      }));

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isKeyboard) {
            setHoveredDate(target);
          }

          setState((state) => ({
            ...state,
            isExitingSheetRendered: false,
          }));
        });
      });
    },
    [isAnimated, state.activeSheetDate, runSafetyTimer, focusController],
  );

  const handleMonthCellClick = useCallback(
    (date: Date, e: React.MouseEvent | React.KeyboardEvent) => {
      const diff = compareMonths(date, state.activeSheetDate);
      const { from, to, today } = trace;

      if (diff !== 0) {
        focusController.send('NAVIGATE', { nextDate: date, needsShift: true });
        shiftSheet(diff);
      } else if (compareDates(date, today) >= 0) {
        focusController.send('NAVIGATE', { nextDate: date });
        pickRange(date);

        const isKeyboard = e.detail === 0 && e.type === 'keydown';
        const isRangeWouldComplete = (to && !from) || (from && !to);
        if (isKeyboard && isRangeWouldComplete) {
          requestAnimationFrame(() => {
            focusController.send('RANGE_PICKED');
          });
        }
      }
    },
    [state.activeSheetDate, shiftSheet, pickRange, focusController, trace],
  );

  const handleSlidingEnd = useCallback(() => {
    setIsAnimated(false);

    setState((state) => ({
      ...state,
      isSliding: false,
      slidingToDate: null,
      slidingToIndex: null,
      activeSheetIndex: state.slidingToIndex ?? state.activeSheetIndex,
      activeSheetDate: state.slidingToDate ?? state.activeSheetDate,
    }));
  }, []);

  const handleZoom = useCallback(
    (e: React.KeyboardEvent | React.MouseEvent) => {
      if (isAnimated) return;

      setIsAnimated(true);
      runSafetyTimer();

      const { activeSheetDate } = state;
      const targetSheetFormat = state.sheetFormat === 'year' ? 'month' : 'year';

      setState((state) => ({
        ...state,
        isZooming: true,
        isExitingSheetRendered: true,
        exitingSheetDate: activeSheetDate,
        enteringSheetDate: getFirstDateOfMonth(activeSheetDate),
        targetSheetFormat,
      }));

      const isKeyboard = e.detail === 0 && e.type === 'keydown';

      const target = getBestFocusDate(activeSheetDate, trace, targetSheetFormat);
      focusController.send('NAVIGATE', {
        nextDate: target,
        needsShift: true,
        show: isKeyboard,
      });

      requestAnimationFrame(() => {
        if (isKeyboard) {
          setHoveredDate(target);
        }

        requestAnimationFrame(() => {
          setState((state) => ({
            ...state,
            isExitingSheetRendered: false,
          }));
        });
      });
    },
    [isAnimated, state.sheetFormat, runSafetyTimer, focusController],
  );

  const handleCellClick = useCallback(
    (sheetFormat: SheetFormat) => {
      return sheetFormat === 'month' ? handleMonthCellClick : handleYearCellClick;
    },
    [handleMonthCellClick, handleYearCellClick],
  );

  const handlePrev = useCallback(() => {
    const prevDate = carouselDates[0];
    const targetDate = getBestFocusDate(prevDate, trace, state.sheetFormat);
    focusController.send('SET_FOCUSED_DATE', { nextDate: targetDate });
    shiftSheet(-1);
  }, [carouselDates, trace, state.sheetFormat, shiftSheet]);

  const handleNext = useCallback(() => {
    const nextDate = carouselDates[2];
    const targetDate = getBestFocusDate(nextDate, trace, state.sheetFormat);
    focusController.send('SET_FOCUSED_DATE', { nextDate: targetDate });
    shiftSheet(1);
  }, [state.sheetFormat, state.activeSheetDate, shiftSheet]);

  const handleClear = useCallback(() => {
    if (isAnimated) return;

    const { today } = trace;

    setState((state) => ({
      ...getInitialCalendarState(today),
      activeSheetIndex: state.activeSheetIndex,
    }));

    setTrace(() => ({ ...getInitialTraceState(), today }));

    focusController.send('CLEARED');
  }, [isAnimated, fieldFrom, fieldTo, focusController, trace.today]);

  const handleApply = useCallback(() => {
    if (isAnimated) return;

    fieldFrom.onChange(toString(trace.from));
    fieldTo.onChange(toString(trace.to));

    setIsExpanded(false);
  }, [isAnimated, trace.from, trace.to, fieldFrom, fieldTo, setIsExpanded]);

  const registerGrid = useCallback(
    (node: HTMLElement | null) => {
      focusController.registerGrid(node);
    },
    [focusController],
  );

  return {
    carouselDates,
    registerGrid,
    focusApi,
    focusController,
    focusedTarget,
    state,
    trace,
    previewTrace,
    focusedDate,
    errorFrom,
    errorTo,
    bodyRef,
    carouselRef,
    isDirty,
    isInvalidFrom,
    isInvalidTo,
    shiftSheet,
    handleOutputClick,
    handleSlidingEnd,
    handleZoomingEnd,
    handleZoom,
    handleCellHover,
    handleCellClick,
    handleGridKeyDown,
    handleNextKeyDown,
    handleApplyKeyDown,
    handleClearKeyDown,
    handleFocusTrap,
    handleNext,
    handlePrev,
    handleClear,
    handleApply,
  };
};
