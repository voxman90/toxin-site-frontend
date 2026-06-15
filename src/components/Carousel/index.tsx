import clsx from 'clsx';
import type { Transition } from 'motion/react';
import { motion } from 'motion/react';
import React, { memo, useCallback, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '../Icon/Icon';

import './Carousel.scss';
import CarouselItem from './CarouselItem';
import CarouselNavTrack from './CarouselNavTrack';
import { useCarousel } from './useCarousel';

export type Direction = 'left' | 'right';

export interface CarouselRef {
  prev: () => void;
  next: () => void;
  jumpTo: (to: number) => void;
  getElement: () => HTMLDivElement | null;
}

type CarouselChildren = Array<
  React.ReactElement<React.ComponentProps<typeof CarouselItem>, typeof CarouselItem>
>;

interface CarouselProps {
  children: CarouselChildren;
  ref?: React.Ref<CarouselRef>;
  transition?: Transition;
  activeItemIndex?: number;
  onAnimationEnd?: (activeItemIndex?: number) => void;
  hasControlButtons?: boolean;
  hasNavPanel?: boolean;
  isFocusable?: boolean;
}

const DEFAULT_TRANSITION = {
  duration: 0.4,
  ease: 'easeInOut',
} as const;

const NOOP = () => {};

const STATIC_VARIANT = {
  initial: { transform: 'translateX(0%)' },
  animate: { transform: 'translateX(0%)' },
};

const FROM_VARIANT = {
  initial: { transform: 'translateX(0%)' },
  animate: (direction: Direction) => ({
    transform: `translateX(${direction === 'right' ? '-100%' : '100%'})`,
  }),
};

const TO_VARIANT = {
  initial: (direction: Direction) => ({
    transform: `translateX(${direction === 'right' ? '100%' : '-100%'})`,
  }),
  animate: { transform: 'translateX(0%)' },
};

const isNavItem = (elem: unknown): elem is HTMLElement & { dataset: { id: string } } =>
  elem instanceof HTMLElement && elem.dataset.id !== undefined;

const Carousel = memo(
  ({
    children,
    ref,
    activeItemIndex: initialIndex = 0,
    hasNavPanel = false,
    hasControlButtons = false,
    isFocusable = false,
    onAnimationEnd = NOOP,
    transition = DEFAULT_TRANSITION,
  }: CarouselProps) => {
    const { t } = useTranslation('components', { keyPrefix: 'carousel' });

    const itemCount = React.Children.count(children);

    const { state, move, jumpTo, finalizeSliding } = useCarousel({
      itemCount,
      initialIndex,
      transitionDuration: transition.duration || DEFAULT_TRANSITION.duration,
      onAnimationEnd,
    });

    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        next: () => move('right'),
        prev: () => move('left'),
        jumpTo,
        getElement: () => containerRef.current,
      }),
      [move, jumpTo],
    );

    const canSlide = itemCount > 1;
    const showControls = hasControlButtons && canSlide;
    const showNav = hasNavPanel && canSlide;

    const handleAnimationEnd = useCallback(() => {
      if (state.slidingTo !== null) {
        const target = state.slidingTo;
        queueMicrotask(() => finalizeSliding(target));
      }
    }, [finalizeSliding, state.slidingTo]);

    const handleNavClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      if (state.isSliding || !isNavItem(e.target)) return;

      const slidingTo = parseInt(e.target.dataset.id, 10);

      jumpTo(slidingTo);
    };

    if (itemCount === 0) return null;

    return (
      <div className="carousel">
        <div ref={containerRef} className="carousel__container">
          {React.Children.map(children, (child, i) => {
            const isFrom = i === state.slidingFrom;
            const isTo = i === state.slidingTo;
            const isActive = i === state.activeItemIndex && !state.isSliding;

            if (!isFrom && !isTo && !isActive) return null;

            const variants = isFrom ? FROM_VARIANT : isTo ? TO_VARIANT : STATIC_VARIANT;

            return (
              <motion.div
                key={i}
                custom={state.slidingDirection}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="initial"
                transition={transition}
                onAnimationComplete={isTo ? handleAnimationEnd : undefined}
              >
                {React.cloneElement(child, {
                  isSliding: isFrom || isTo,
                  isActive: isActive || isTo,
                })}
              </motion.div>
            );
          })}
        </div>

        {showControls && (
          <div className="carousel__controls">
            <button
              type="button"
              className={clsx('carousel__button', 'carousel__button--prev')}
              tabIndex={isFocusable ? 0 : -1}
              onClick={() => move('left')}
              aria-disabled={state.isSliding}
              aria-label={t('movePrev')}
            >
              <Icon name="expand_more" />
            </button>
            <button
              type="button"
              className={clsx('carousel__button', 'carousel__button--next')}
              tabIndex={isFocusable ? 0 : -1}
              onClick={() => move('right')}
              aria-disabled={state.isSliding}
              aria-label={t('moveNext')}
            >
              <Icon name="expand_more" />
            </button>
            <div className={clsx('carousel__shadow', 'carousel__shadow--left')} />
            <div className={clsx('carousel__shadow', 'carousel__shadow--right')} />
          </div>
        )}

        {showNav && (
          <CarouselNavTrack
            itemCount={itemCount}
            activeIndex={state.slidingTo !== null ? state.slidingTo : state.activeItemIndex}
            onNavClick={handleNavClick}
            transition={transition}
          />
        )}
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';

export default Carousel;
