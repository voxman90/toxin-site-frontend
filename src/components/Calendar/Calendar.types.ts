import type { AnimationDefinition } from 'motion/react';
import type { MouseEventHandler, PropsWithChildren } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import type { CarouselRef } from '../Carousel';

import type { FocusTarget } from './FocusController';

export type SheetFormat = 'month' | 'year';
export type PickMode = 'from' | 'to';
export type Shift = -1 | 0 | 1;
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type NavStep = 'step' | 'row';

export interface Output {
  from: Date | null;
  to: Date | null;
}

export interface Trace {
  from: Date | null;
  to: Date | null;
  today: Date;
}

export interface PreviewTrace {
  from: Date | null;
  to: Date | null;
}

export interface MonthSheet {
  dates: Date[];
  month: Date;
  firstDayIndex: number;
  lastDayIndex: number;
}

export interface YearSheet {
  months: {
    name: string;
    date: Date;
  }[];
  year: Date;
  firstMonthIndex: number;
  lastMonthIndex: number;
}

export interface CalendarState {
  activeSheetDate: Date;
  activeSheetIndex: number;
  isSliding: boolean;
  slidingToDate: Date | null;
  slidingToIndex: number | null;
  sheetFormat: SheetFormat;
  isZooming: boolean;
  isExitingSheetRendered: boolean;
  exitingSheetDate: Date | null;
  enteringSheetDate: Date | null;
  targetSheetFormat: SheetFormat | null;
}

export interface FocusRenderProps {
  onRegister?: (node: HTMLElement | null) => void;
  focusedDate: Date | null;
  focusedTarget: FocusTarget | null;
}

export type HandleCellClick = (date: Date, e: React.KeyboardEvent | React.MouseEvent) => void;

export type HandleGridKeyDown = (
  e: React.KeyboardEvent,
  onSelect: HandleCellClick,
  onHover?: (d: Date | null) => void,
) => void;

export interface GridHandlers {
  handleGridKeyDown?: HandleGridKeyDown;
  handleCellClick?: HandleCellClick;
  handleCellHover?: (date: Date | null) => void;
}

export interface MonthTableProps extends FocusRenderProps, GridHandlers {
  trace: Trace;
  previewTrace: PreviewTrace;
  sheet: MonthSheet;
}

export interface YearTableProps extends FocusRenderProps, Omit<GridHandlers, 'handleCellHover'> {
  trace: Trace;
  sheet: YearSheet;
}

export interface SheetTableProps extends FocusRenderProps, GridHandlers {
  format: SheetFormat;
  trace: Trace;
  previewTrace: PreviewTrace;
  date: Date;
}

export interface CalendarSheetProps
  extends FocusRenderProps, Omit<GridHandlers, 'handleCellClick'> {
  carouselRef: React.RefObject<CarouselRef | null>;
  carouselDates: Date[];
  trace: Trace;
  previewTrace: PreviewTrace;
  state: CalendarState;
  handleSlidingEnd: () => void;
  handleZoomingEnd: (_: AnimationDefinition) => void;
  handleCellClick: (format: SheetFormat) => HandleCellClick;
}

interface TraceIndexes {
  to: number | null;
  from: number | null;
  today: number | null;
}

export type TraceProps = PropsWithChildren<{
  i: number;
  traceIndexes: TraceIndexes;
  previewIndexes?: TraceIndexes;
  sheetFormat: SheetFormat;
}>;

export interface OutputHidden {
  outputFormat: 'hidden';
  label?: undefined;
}

export interface OutputSeparate {
  outputFormat: 'separate';
  labelFrom?: string;
  labelTo?: string;
}

export interface OutputRange {
  outputFormat: 'range';
  label?: string;
}

export interface CalendarRef {
  from: {
    focus: () => void;
  };
  to: {
    focus: () => void;
  };
}

export interface CalendarOutputBaseProps {
  output: Output;
  focusedTarget: FocusTarget | null;
  isExpanded: boolean;
  isInvalidFrom?: boolean;
  isInvalidTo?: boolean;
  errorFrom?: string;
  errorTo?: string;
  handleOutputClick: MouseEventHandler;
}

export interface CalendarOutputRangeProps extends CalendarOutputBaseProps {
  label?: string;
}

export interface CalendarOutputSeparateProps extends CalendarOutputBaseProps {
  labelFrom?: string;
  labelTo?: string;
}

export type CalendarProps<T extends FieldValues> = {
  ref?: React.Ref<CalendarRef>;
  nameFrom: Path<T>;
  nameTo: Path<T>;
  control: Control<T>;
  sheetFormat?: SheetFormat;
  isExpanded?: boolean;
} & (OutputHidden | OutputSeparate | OutputRange);
