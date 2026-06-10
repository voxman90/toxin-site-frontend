import clsx from 'clsx';
import React, { memo, useEffect } from 'react';

import type { Orientation } from './RangeSlider';
import './RangeSlider.scss';
import type { Ends } from './range';

interface RangeSliderViewProps {
  rectRef: React.RefObject<HTMLDivElement | null>;
  min: number;
  max: number;
  fromValue: number;
  toValue: number;
  fromPercent: number;
  toPercent: number;
  rangePercent: number;
  isFromMoving: boolean;
  isToMoving: boolean;
  isRangeMoving: boolean;
  isFromFixed: boolean;
  isToFixed: boolean;
  isRangeFixed: boolean;
  handleToMouseDown: React.MouseEventHandler<HTMLDivElement>;
  handleFromMouseDown: React.MouseEventHandler<HTMLDivElement>;
  handleRangeMouseDown: React.MouseEventHandler<HTMLDivElement>;
  handleTargetMouseDown: React.MouseEventHandler<HTMLDivElement>;
  handleMouseUp: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent, end: Ends | 'range') => void;
  onKeyUp?: (e: React.KeyboardEvent, end: Ends | 'range') => void;
  orientation?: Orientation;
  disabled?: boolean;
  isRangeDraggable?: boolean;
}

const getHandleStyle = (percent: number, orientation: Orientation) => {
  const isVert = orientation === 'vertical';
  const position = isVert ? 'top' : 'left';

  return {
    [position]: isVert ? `${100 - percent}%` : `${percent}%`,
    transform: isVert ? 'translateY(-50%)' : 'translateX(-50%)',
  };
};

const getRangeStyle = (percentFrom: number, sizePercent: number, orientation: Orientation) => {
  const isVert = orientation === 'vertical';
  const position = isVert ? 'bottom' : 'left';
  const dimension = isVert ? 'height' : 'width';

  return {
    [position]: isVert ? `${percentFrom}%` : `${percentFrom}%`,
    [dimension]: `${sizePercent}%`,
  };
};

const RangeSliderView = memo(
  ({
    min,
    max,
    fromValue,
    toValue,
    rectRef,
    fromPercent,
    toPercent,
    rangePercent,
    isFromFixed,
    isToFixed,
    isRangeFixed,
    isFromMoving,
    isToMoving,
    isRangeMoving,
    handleToMouseDown,
    handleFromMouseDown,
    handleRangeMouseDown,
    handleTargetMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleKeyDown,
    onKeyUp,
    orientation = 'horizontal',
    disabled = false,
    isRangeDraggable = false,
  }: RangeSliderViewProps) => {
    useEffect(() => {
      const isActive = isFromMoving || isToMoving || isRangeMoving;

      if (isActive && !disabled) {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [isFromMoving, isToMoving, isRangeMoving, handleMouseMove, handleMouseUp, disabled]);

    const isVert = orientation === 'vertical';

    const classes = {
      root: clsx('range-slider', {
        'range-slider--vertical': isVert,
        'range-slider--disabled': disabled,
      }),
      handleFrom: clsx('range-slider__handle', {
        'range-slider__handle--fixed': isFromFixed,
        'range-slider__handle--active': isFromMoving,
      }),
      handleTo: clsx('range-slider__handle', {
        'range-slider__handle--fixed': isToFixed,
        'range-slider__handle--active': isToMoving,
      }),
      range: clsx('range-slider__range', {
        'range-slider__range--fixed': isRangeFixed,
        'range-slider__range--active': isRangeMoving,
        'range-slider__range--draggable': isRangeDraggable,
      }),
    };

    return (
      <div className={classes.root}>
        <div className="range-slider__controls">
          <div className="range-slider__track">
            <div
              className={classes.handleFrom}
              style={getHandleStyle(fromPercent, orientation)}
              onMouseDown={handleFromMouseDown}
              onKeyDown={(e) => handleKeyDown(e, 'from')}
              onKeyUp={(e) => onKeyUp?.(e, 'from')}
              data-from
              role="slider"
              tabIndex={disabled || isFromFixed ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={toValue}
              aria-valuenow={fromValue}
              aria-readonly={isFromFixed}
              aria-disabled={disabled}
              aria-label="from"
            />
            <div
              className={classes.range}
              style={getRangeStyle(fromPercent, rangePercent, orientation)}
              tabIndex={disabled || !isRangeDraggable ? -1 : 0}
              onKeyDown={(e) => handleKeyDown(e, 'range')}
              onKeyUp={(e) => onKeyUp?.(e, 'range')}
              onMouseDown={handleRangeMouseDown}
              data-testid="range"
            />
            <div
              className={classes.handleTo}
              style={getHandleStyle(toPercent, orientation)}
              onMouseDown={handleToMouseDown}
              onKeyDown={(e) => handleKeyDown(e, 'to')}
              onKeyUp={(e) => onKeyUp?.(e, 'to')}
              data-to
              role="slider"
              tabIndex={disabled || isToFixed ? -1 : 0}
              aria-valuemin={fromValue}
              aria-valuemax={max}
              aria-valuenow={toValue}
              aria-readonly={isToFixed}
              aria-disabled={disabled}
              aria-label="to"
            />
          </div>
        </div>
        <div
          className="range-slider__target"
          onMouseDown={handleTargetMouseDown}
          data-testid="target"
        >
          <div className="range-slider__bar" ref={rectRef} />
        </div>
      </div>
    );
  },
);

export default RangeSliderView;
