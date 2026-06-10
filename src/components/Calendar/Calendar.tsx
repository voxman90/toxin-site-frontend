import clsx from 'clsx';
import { memo, useImperativeHandle } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useExpandable } from '../../hooks/useExpandable';
import ButtonText from '../Button/ButtonText';
import Icon from '../Icon/Icon';

import { CalendarSheet } from './Calendar.components';
import { I18N } from './Calendar.constants';
import { CalendarOutputRange, CalendarOutputSeparate } from './Calendar.outputs';
import './Calendar.scss';
import type { CalendarProps } from './Calendar.types';
import { getSheetTitle } from './Calendar.utils';
import { FocusContext } from './FocusContext';
import { useCalendar } from './useCalendar';

const Calendar = <T extends FieldValues>({ ref, ...props }: CalendarProps<T>) => {
  const { outputFormat, isExpanded: initialIsExpanded = false } = props;

  const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });
  const { ref: expandableRef, isExpanded, setIsExpanded } = useExpandable(initialIsExpanded);
  const {
    carouselDates,
    bodyRef,
    carouselRef,
    focusApi,
    focusController,
    focusedDate,
    focusedTarget,
    registerGrid,
    state,
    trace,
    previewTrace,
    errorFrom,
    errorTo,
    isDirty,
    isInvalidFrom,
    isInvalidTo,
    handleOutputClick,
    handleSlidingEnd,
    handleZoomingEnd,
    handleNext,
    handlePrev,
    handleZoom,
    handleCellHover,
    handleCellClick,
    handleApplyKeyDown,
    handleClearKeyDown,
    handleGridKeyDown,
    handleNextKeyDown,
    handleClear,
    handleApply,
    handleFocusTrap,
  } = useCalendar({ ...props, isExpanded, setIsExpanded });

  const draftOutput = { from: trace.from, to: trace.to };

  const sheetTitle = getSheetTitle(state.activeSheetDate, state.sheetFormat, t);

  useImperativeHandle(ref, () => focusApi, [focusApi]);

  return (
    <FocusContext.Provider value={focusController}>
      <section className="calendar" ref={outputFormat === 'hidden' ? null : expandableRef}>
        <div className="calendar__head">
          {outputFormat === 'range' && (
            <CalendarOutputRange
              output={draftOutput}
              focusedTarget={focusedTarget}
              label={props.label}
              isInvalidFrom={isInvalidFrom}
              isInvalidTo={isInvalidTo}
              errorFrom={errorFrom?.message}
              errorTo={errorTo?.message}
              isExpanded={isExpanded}
              handleOutputClick={handleOutputClick}
            />
          )}
          {outputFormat === 'separate' && (
            <CalendarOutputSeparate
              output={draftOutput}
              focusedTarget={focusedTarget}
              isExpanded={isExpanded}
              isInvalidFrom={isInvalidFrom}
              isInvalidTo={isInvalidTo}
              errorFrom={errorFrom?.message}
              errorTo={errorTo?.message}
              labelFrom={props.labelFrom}
              labelTo={props.labelTo}
              handleOutputClick={handleOutputClick}
            />
          )}
        </div>
        <div
          ref={bodyRef}
          className={clsx('calendar__body', { 'calendar__body--expanded': isExpanded })}
          onKeyDown={handleFocusTrap}
          role="dialog"
          aria-modal="true"
          aria-label={t('description')}
        >
          <div className="calendar__content-wrapper">
            <div className="calendar__controls">
              <button
                type="button"
                ref={(node) => focusController.registerStatic('btn-prev', node)}
                className="calendar__btn-prev"
                onClick={handlePrev}
                aria-label={t('prev')}
              >
                <Icon name="arrow_back" />
              </button>
              <button
                type="button"
                ref={(node) => focusController.registerStatic('btn-title', node)}
                className={clsx('calendar__title', {
                  'calendar__title--month': state.sheetFormat === 'month',
                })}
                onClick={handleZoom}
                aria-live="polite"
                aria-atomic="true"
                aria-label={`${sheetTitle}, ${t('zoomOutHint')}`}
              >
                {sheetTitle}
              </button>
              <button
                type="button"
                ref={(node) => focusController.registerStatic('btn-next', node)}
                className="calendar__btn-next"
                onClick={handleNext}
                onKeyDown={handleNextKeyDown}
                aria-label={t('next')}
              >
                <Icon name="arrow_forward" />
              </button>
            </div>

            <div className="calendar__content">
              <CalendarSheet
                state={state}
                trace={trace}
                previewTrace={previewTrace}
                carouselRef={carouselRef}
                carouselDates={carouselDates}
                focusedDate={focusedDate}
                focusedTarget={focusedTarget}
                onRegister={registerGrid}
                handleSlidingEnd={handleSlidingEnd}
                handleZoomingEnd={handleZoomingEnd}
                handleCellClick={handleCellClick}
                handleCellHover={handleCellHover}
                handleGridKeyDown={handleGridKeyDown}
              />
            </div>

            <div className="calendar__buttons">
              <ButtonText
                ref={(node) => focusController.registerStatic('btn-clear', node)}
                onClick={handleClear}
                onKeyDown={handleClearKeyDown}
                disabled={!isDirty}
              >
                {t('clear')}
              </ButtonText>
              <ButtonText
                ref={(node) => focusController.registerStatic('btn-apply', node)}
                onClick={handleApply}
                onKeyDown={handleApplyKeyDown}
              >
                {t('apply')}
              </ButtonText>
            </div>
          </div>
        </div>
      </section>
    </FocusContext.Provider>
  );
};

const MemoizedCalendar = memo(Calendar) as unknown as typeof Calendar;

export default MemoizedCalendar;
