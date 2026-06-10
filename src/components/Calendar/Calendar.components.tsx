import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { mod } from '../../utils/utils';
import Carousel from '../Carousel';
import CarouselItem from '../Carousel/CarouselItem';

import {
  CALENDAR_ANIMATION_CONFIG,
  CAROUSEL_ITEMS_COUNT,
  CAROUSEL_ITEMS_INDECES,
} from './Calendar.constants';
import { MonthTableHeader, SheetTable } from './Calendar.tables';
import type { CalendarSheetProps, SheetFormat, Shift, TraceProps } from './Calendar.types';

const CalendarTrace = ({ children, i, traceIndexes, previewIndexes, sheetFormat }: TraceProps) => {
  const { from: sFrom, to: sTo, today } = traceIndexes;
  const pFrom = previewIndexes?.from ?? null;
  const pTo = previewIndexes?.to ?? null;

  const isStable = sFrom !== null && sTo !== null && sFrom <= i && i <= sTo;
  const isPreview = pFrom !== null && pTo !== null && pFrom <= i && i <= pTo;
  const isToday = i === today;
  const isEndpoint = i === sFrom || i === sTo || i === pFrom || i === pTo;

  return (
    <div className={clsx('calendar__trace', `calendar__trace--${sheetFormat}`)}>
      {isStable && (
        <div
          className={clsx('calendar__trace-layer', 'calendar__trace-layer--selected', {
            'calendar__trace-layer--from': i === sFrom,
            'calendar__trace-layer--to': i === sTo,
          })}
        />
      )}

      {isPreview && (
        <div
          className={clsx('calendar__trace-layer', 'calendar__trace-layer--preview', {
            'calendar__trace-layer--from': i === pFrom,
            'calendar__trace-layer--to': i === pTo,
          })}
        />
      )}

      {isToday && <div className="calendar__trace-today" />}

      {isEndpoint && (
        <div
          className={clsx('calendar__trace-endpoint', {
            'calendar__trace-endpoint--preview':
              (i === pFrom || i === pTo) && !(i === sFrom || i === sTo),
          })}
        />
      )}

      <div
        className={clsx('calendar__cell', {
          'calendar__cell--today': isToday,
          'calendar__cell--endpoint': isEndpoint,
          'calendar__cell--selected': isStable || isPreview,
        })}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
};

const CalendarSheet = ({
  state,
  trace,
  previewTrace,
  focusedDate,
  focusedTarget,
  onRegister,
  carouselRef,
  carouselDates,
  handleSlidingEnd,
  handleZoomingEnd,
  handleCellClick,
  handleCellHover,
  handleGridKeyDown,
}: CalendarSheetProps) => {
  const {
    activeSheetIndex,
    sheetFormat,
    isZooming,
    isSliding,
    isExitingSheetRendered,
    targetSheetFormat,
    exitingSheetDate,
    enteringSheetDate,
  } = state;

  const isMoving = isZooming || isSliding;

  return (
    <div className="calendar__sheet-container" aria-busy={isMoving}>
      {!isZooming && sheetFormat === 'month' && (
        <table className="calendar__fixed-header" role="presentation">
          <thead>
            <MonthTableHeader />
          </thead>
        </table>
      )}

      <div style={isZooming ? { display: 'none' } : { height: '100%' }} aria-hidden={isMoving}>
        <Carousel ref={carouselRef} activeItemIndex={1} onAnimationEnd={handleSlidingEnd}>
          {CAROUSEL_ITEMS_INDECES.map((_, i) => {
            const shift = (mod(i - activeSheetIndex + 1, CAROUSEL_ITEMS_COUNT) - 1) as Shift;
            const isActive = shift === 0;

            return (
              <CarouselItem key={i} aria-hidden={!isActive}>
                <SheetTable
                  format={sheetFormat}
                  trace={trace}
                  previewTrace={previewTrace}
                  date={carouselDates[shift + 1]}
                  focusedDate={focusedDate}
                  focusedTarget={focusedTarget}
                  onRegister={isActive ? onRegister : undefined}
                  handleCellClick={handleCellClick(sheetFormat)}
                  handleCellHover={handleCellHover}
                  handleGridKeyDown={handleGridKeyDown}
                />
              </CarouselItem>
            );
          })}
        </Carousel>
      </div>

      {isZooming && (
        <div aria-hidden="true" inert>
          <AnimatePresence mode="wait">
            {isExitingSheetRendered && (
              <motion.div
                key="exiting"
                initial={{ scale: 1, opacity: 1 }}
                exit={{
                  scale: targetSheetFormat === 'year' ? 0.75 : 1.25,
                  opacity: 0,
                }}
                transition={{ duration: CALENDAR_ANIMATION_CONFIG.MOTION_DURATION_S }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <SheetTable
                  format={sheetFormat}
                  trace={trace}
                  previewTrace={previewTrace}
                  date={exitingSheetDate as Date}
                  focusedDate={focusedDate}
                  focusedTarget={focusedTarget}
                />
              </motion.div>
            )}
            {!isExitingSheetRendered && (
              <motion.div
                key="entering"
                initial={{
                  scale: targetSheetFormat === 'year' ? 1.25 : 0.75,
                  opacity: 0,
                }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: CALENDAR_ANIMATION_CONFIG.MOTION_DURATION_S }}
                onAnimationComplete={handleZoomingEnd}
                style={{ position: 'absolute', width: '100%' }}
                aria-hidden="true"
              >
                <SheetTable
                  format={targetSheetFormat as SheetFormat}
                  trace={trace}
                  previewTrace={previewTrace}
                  date={enteringSheetDate as Date}
                  focusedDate={null}
                  focusedTarget={focusedTarget}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export { CalendarSheet, CalendarTrace };
