import clsx from 'clsx';
import { motion } from 'motion/react';
import type { Transition } from 'motion/react';
import React, { memo, useCallback, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '../Icon/Icon';

import './Carousel.scss';
import CarouselItem from './CarouselItem';
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

const STATIC_VARIANT = {
  initial: { transform: 'translateX(0%)' },
  animate: { transform: 'translateX(0%)' },
};

const DEFAULT_TRANSITION = {
  duration: 0.4,
  ease: 'easeInOut',
} as const;
const NOOP = () => {};

const getSlideFromPositions = (direction: Direction) => {
  const finalPos = direction === 'right' ? '-100%' : '100%';

  return {
    initial: { transform: 'translateX(0%)' },
    animate: { transform: `translateX(${finalPos})` },
  };
};

const getSlideToPositions = (slidingDirection: Direction) => {
  const initialPos = slidingDirection === 'right' ? '100%' : '-100%';

  return {
    initial: { transform: `translateX(${initialPos})` },
    animate: { transform: 'translateX(0%)' },
  };
};

const isNavItem = (elem: unknown): elem is HTMLButtonElement & { dataset: { id: string } } =>
  elem instanceof HTMLButtonElement && elem.dataset.id !== undefined;

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

            if (!isFrom && !isTo && !isActive) {
              return null;
            }

            let variants = { initial: {}, animate: {} };
            if (isFrom) {
              variants = getSlideFromPositions(state.slidingDirection);
            } else if (isTo) {
              variants = getSlideToPositions(state.slidingDirection);
            } else {
              variants = STATIC_VARIANT;
            }

            return (
              <motion.div
                key={i}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.initial}
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
          <div
            className="carousel__nav"
            onClick={handleNavClick}
            role="group"
            aria-label={t('navPanel')}
          >
            {React.Children.map(children, (_, i) => {
              const isActive = i === state.activeItemIndex;

              return (
                <button
                  key={i}
                  type="button"
                  tabIndex={isFocusable ? 0 : -1}
                  className={clsx('carousel__nav-item', {
                    'carousel__nav-item--active': isActive,
                  })}
                  data-id={i}
                  aria-disabled={state.isSliding}
                  aria-current={isActive ? 'true' : 'false'}
                  aria-label={`${t('jumpTo')} ${i + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

export default Carousel;
