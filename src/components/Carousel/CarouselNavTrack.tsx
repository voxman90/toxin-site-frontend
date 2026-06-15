import clsx from 'clsx';
import type { Transition } from 'motion/react';
import { motion } from 'motion/react';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface CarouselNavTrackProps {
  itemCount: number;
  activeIndex: number;
  onNavClick: React.MouseEventHandler<HTMLDivElement>;
  transition: Transition;
}

const ITEM_SIZE = 0.5;
const GAP_SIZE = 0.25;
const MAX_VISIBLE = 5;

const CarouselNavTrack = memo(
  ({ itemCount, activeIndex, onNavClick, transition }: CarouselNavTrackProps) => {
    const { t } = useTranslation('components', { keyPrefix: 'carousel' });

    let windowStart = Math.max(0, activeIndex - Math.floor(MAX_VISIBLE / 2));

    if (windowStart + MAX_VISIBLE > itemCount) {
      windowStart = Math.max(0, itemCount - MAX_VISIBLE);
    }

    const trackOffset = itemCount > MAX_VISIBLE ? -(windowStart * (ITEM_SIZE + GAP_SIZE)) : 0;

    const navStyle = useMemo(
      () =>
        ({
          '--carousel-nav-item-size': `${ITEM_SIZE}rem`,
          '--carousel-nav-gap': `${GAP_SIZE}rem`,
          '--carousel-nav-visible-count': Math.min(itemCount, MAX_VISIBLE),
        }) as React.CSSProperties,
      [itemCount],
    );

    const ariaLabel = t('navPanelStatus', { current: activeIndex + 1, total: itemCount });

    return (
      <div
        className="carousel__nav"
        style={navStyle}
        onClick={onNavClick}
        role="img"
        aria-label={ariaLabel}
      >
        <motion.div
          className="carousel__nav-track"
          animate={{ x: `${trackOffset}rem` }}
          transition={transition}
        >
          {Array.from({ length: itemCount }, (_, i) => {
            const isActive = i === activeIndex;

            let scale = 1;
            if (itemCount > MAX_VISIBLE) {
              if (i < windowStart || i >= windowStart + MAX_VISIBLE) {
                scale = 0;
              } else if (i === windowStart && windowStart > 0) {
                scale = 0.5;
              } else if (
                i === windowStart + MAX_VISIBLE - 1 &&
                windowStart + MAX_VISIBLE < itemCount
              ) {
                scale = 0.5;
              }
            }

            return (
              <motion.div
                key={i}
                className={clsx('carousel__nav-item', {
                  'carousel__nav-item--active': isActive,
                })}
                data-id={i}
                aria-hidden="true"
                animate={{ scale }}
                transition={transition}
              />
            );
          })}
        </motion.div>
      </div>
    );
  },
);

export default CarouselNavTrack;
