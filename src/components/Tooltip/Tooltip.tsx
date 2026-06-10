import clsx from 'clsx';
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useExpandable } from '../../hooks/useExpandable';

import './Tooltip.scss';

interface TooltipProps {
  children: React.ReactNode;
  target: React.ReactNode;
  label: string;
  isFocusable?: boolean;
}

const TOOLTIP_GAP_PX = 12;
const SCREEN_GAP_PX = 10;

const Tooltip = ({ children, target, isFocusable = true, label }: TooltipProps) => {
  const { isExpanded, setIsExpanded, ref: targetRef } = useExpandable<HTMLDivElement>(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowLeft: 0, side: 'top' });
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    if (!isExpanded || !targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const targetCenterX = targetRect.left + window.scrollX + targetRect.width / 2;
    const targetTopY = targetRect.top + window.scrollY;
    const targetBottomY = targetRect.bottom + window.scrollY;

    const hasSpaceAbove = targetRect.top - tooltipRect.height > 30;
    const placementSide = hasSpaceAbove ? 'top' : 'bottom';

    const verticalPosition =
      placementSide === 'top'
        ? targetTopY - tooltipRect.height - TOOLTIP_GAP_PX
        : targetBottomY + TOOLTIP_GAP_PX;

    const idealLeft = targetCenterX - tooltipRect.width / 2;

    const minAllowedLeft = SCREEN_GAP_PX;
    const maxAllowedLeft = window.innerWidth - tooltipRect.width - SCREEN_GAP_PX;

    const finalLeft = Math.max(minAllowedLeft, Math.min(idealLeft, maxAllowedLeft));

    const arrowPositionX = targetCenterX - finalLeft;

    setCoords({
      top: verticalPosition,
      left: finalLeft,
      side: placementSide,
      arrowLeft: arrowPositionX,
    });
  }, [isExpanded, targetRef]);

  useLayoutEffect(() => {
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition]);

  const handleOpen = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setIsExpanded(true), 300);
  };

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsExpanded(false);
  };

  return (
    <div
      ref={targetRef}
      role="button"
      className="tooltip-container"
      tabIndex={isFocusable ? 0 : -1}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
      aria-label={label}
      aria-haspopup="true"
      aria-expanded={isExpanded}
      aria-describedby={isExpanded ? tooltipId : undefined}
    >
      {target}

      {isExpanded &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            className="tooltip"
            style={{
              top: coords.top,
              left: coords.left,
            }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            <div
              className="tooltip__bridge"
              style={{
                height: `${TOOLTIP_GAP_PX + 4}px`,
                [coords.side === 'top' ? 'bottom' : 'top']: `-${TOOLTIP_GAP_PX}px`,
              }}
            />
            <div className="tooltip__content" role="tooltip">
              {children}
            </div>
            <div
              className={clsx('tooltip__arrow', `tooltip__arrow--side-${coords.side}`)}
              style={{ left: coords.arrowLeft }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Tooltip;
