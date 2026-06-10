import { useCallback, useRef, useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import type { Orientation } from './RangeSlider';
import RangeSliderView from './RangeSliderView';
import type { Ends, IRange, RangeState } from './range';
import { useFormRangeAdapter } from './useFormRangeAdapter';

export interface RangeSliderPresenterProps<T extends FieldValues, RModel extends IRange> {
  range: RModel;
  nameFrom: Path<T>;
  nameTo: Path<T>;
  control: Control<T>;
  orientation?: Orientation;
  config?: Partial<RangeState>;
  onMouseDown?: (end: Ends | 'range') => void;
  onKeyDown?: (e: React.KeyboardEvent, end: Ends | 'range') => void;
  onKeyUp?: (e: React.KeyboardEvent, end: Ends | 'range') => void;
  disabled?: boolean;
  isRangeDraggable?: boolean;
}

const RangeSliderPresenter = <T extends FieldValues, RModel extends IRange>({
  range,
  nameFrom,
  nameTo,
  control,
  orientation = 'horizontal',
  onMouseDown,
  onKeyDown,
  onKeyUp,
  disabled = false,
  isRangeDraggable = false,
}: RangeSliderPresenterProps<T, RModel>) => {
  const [moving, setMoving] = useState({ from: false, to: false, range: false });
  const [dragOffsets, setDragOffsets] = useState({ startFrom: 0, startMouse: 0 });
  const rectRef = useRef<HTMLDivElement>(null);

  const sliderState = useFormRangeAdapter<T, RModel>({
    range,
    control,
    nameFrom,
    nameTo,
  });

  const { min, max, from: fromValue, to: toValue } = sliderState;

  const getPercent = useCallback(
    (e: React.MouseEvent | MouseEvent): number => {
      const rect = rectRef.current?.getBoundingClientRect();
      if (!rect) return 0;

      const isHorizontal = orientation === 'horizontal';
      const clientCoord = isHorizontal ? e.clientX : e.clientY;
      const rectPos = isHorizontal ? rect.left : rect.top;
      const rectSize = isHorizontal ? rect.width : rect.height;

      const rawPercent = ((clientCoord - rectPos) * 100) / (rectSize || 1);

      return isHorizontal ? rawPercent : 100 - rawPercent;
    },
    [rectRef, orientation],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled) return;

      if (moving.range) {
        const delta = getPercent(e) - dragOffsets.startMouse;
        range.setRange(range.getValue(dragOffsets.startFrom + delta));
      } else if (moving.from) {
        range.setFrom(range.getValue(getPercent(e)));
      } else if (moving.to) {
        range.setTo(range.getValue(getPercent(e)));
      }
    },
    [moving, dragOffsets, range, getPercent, disabled],
  );

  const handleMouseUp = useCallback(() => {
    setMoving({ from: false, to: false, range: false });
  }, []);

  const handleTargetMouseDown: React.MouseEventHandler = useCallback(
    (e) => {
      if (disabled) return;

      const clickPercent = getPercent(e);
      const clickValue = range.getValue(clickPercent);
      let targetEnd = range.getClosestEnd(clickValue);

      if (targetEnd === 'from' && sliderState.isFromFixed) {
        targetEnd = 'to';
      }

      if (targetEnd === 'to' && sliderState.isToFixed) {
        targetEnd = 'from';
      }

      if (targetEnd === 'from' && !sliderState.isFromFixed) {
        setMoving((m) => ({ ...m, from: true }));
        range.setFrom(clickValue);
      } else if (targetEnd === 'to' && !sliderState.isToFixed) {
        setMoving((m) => ({ ...m, to: true }));
        range.setTo(clickValue);
      }
    },
    [range, disabled, sliderState.isFromFixed, sliderState.isToFixed, getPercent],
  );

  const handleRangeMouseDown: React.MouseEventHandler = useCallback(
    (e) => {
      if (disabled) return;

      onMouseDown?.('range');

      if (isRangeDraggable && !sliderState.isRangeFixed) {
        setDragOffsets({
          startFrom: range.getPercent(sliderState.from),
          startMouse: getPercent(e),
        });
        setMoving((m) => ({ ...m, range: true }));
      } else {
        handleTargetMouseDown(e);
      }
    },
    [
      range,
      isRangeDraggable,
      disabled,
      sliderState.from,
      sliderState.isRangeFixed,
      handleTargetMouseDown,
      getPercent,
    ],
  );

  const handleFromMouseDown = useCallback(() => {
    if (!disabled && !sliderState.isFromFixed) {
      onMouseDown?.('from');
      setMoving((m) => ({ ...m, from: true }));
    }
  }, [disabled, sliderState.isFromFixed]);

  const handleToMouseDown = useCallback(() => {
    if (!disabled && !sliderState.isToFixed) {
      onMouseDown?.('to');
      setMoving((m) => ({ ...m, to: true }));
    }
  }, [disabled, sliderState.isToFixed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, end: Ends | 'range') => {
      if (
        disabled ||
        (end === 'from' && sliderState.isFromFixed) ||
        (end === 'to' && sliderState.isToFixed) ||
        (end === 'range' && (sliderState.isToFixed || sliderState.isFromFixed))
      ) {
        return;
      }

      onKeyDown?.(e, end);

      const step = sliderState.step;
      const bigStep = step * 10;
      const current = end === 'to' ? sliderState.to : sliderState.from;
      let nextValue = current;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          nextValue += step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          nextValue -= step;
          break;
        case 'PageUp':
          nextValue += bigStep;
          break;
        case 'PageDown':
          nextValue -= bigStep;
          break;
        case 'End':
          nextValue = sliderState.max;
          break;
        case 'Home':
          nextValue = sliderState.min;
          break;
        default:
          return;
      }

      e.preventDefault();

      if (end === 'from') {
        range.setFrom(nextValue);
      } else if (end === 'to') {
        range.setTo(nextValue);
      } else {
        range.setRange(nextValue);
      }
    },
    [disabled, range, sliderState, onKeyDown],
  );

  return (
    <RangeSliderView
      min={min}
      max={max}
      fromValue={fromValue}
      toValue={toValue}
      rectRef={rectRef}
      fromPercent={range.getPercent(sliderState.from)}
      toPercent={range.getPercent(sliderState.to)}
      rangePercent={range.getPercent(sliderState.to) - range.getPercent(sliderState.from)}
      handleToMouseDown={handleToMouseDown}
      handleFromMouseDown={handleFromMouseDown}
      handleRangeMouseDown={handleRangeMouseDown}
      handleTargetMouseDown={handleTargetMouseDown}
      handleMouseUp={handleMouseUp}
      handleMouseMove={handleMouseMove}
      handleKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
      isFromMoving={moving.from}
      isToMoving={moving.to}
      isRangeMoving={moving.range}
      isFromFixed={sliderState.isFromFixed}
      isToFixed={sliderState.isToFixed}
      isRangeFixed={sliderState.isRangeFixed}
      isRangeDraggable={isRangeDraggable}
      disabled={disabled}
      orientation={orientation}
    />
  );
};

export default RangeSliderPresenter;
