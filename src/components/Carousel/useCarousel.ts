import { useCallback, useRef, useState } from 'react';

import { mod as modulo } from '../../utils/utils';

import type { Direction } from './index';

export interface CarouselState {
  activeItemIndex: number;
  isSliding: boolean;
  slidingFrom: number | null;
  slidingTo: number | null;
  slidingDirection: Direction;
}

export interface UseCarouselParams {
  itemCount: number;
  initialIndex: number;
  transitionDuration: number;
  onAnimationEnd: (index: number) => void;
}

const DEFAULT_STATE: CarouselState = {
  activeItemIndex: 0,
  isSliding: false,
  slidingFrom: null,
  slidingTo: null,
  slidingDirection: 'right',
};

export const getSlidingDirection = (from: number, to: number, itemCount: number): Direction => {
  if (to < from) {
    return getSlidingDirection(to, from, itemCount) === 'right' ? 'left' : 'right';
  }

  const distanceBetween = to - from;
  const distanceAround = from + (itemCount - to);

  return distanceBetween <= distanceAround ? 'right' : 'left';
};

export const useCarousel = ({
  itemCount,
  initialIndex,
  transitionDuration,
  onAnimationEnd,
}: UseCarouselParams) => {
  const [state, setState] = useState<CarouselState>({
    ...DEFAULT_STATE,
    activeItemIndex: itemCount > 0 ? modulo(initialIndex, itemCount) : 0,
  });

  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalizeSliding = useCallback(
    (targetIndex: number) => {
      setState({ ...DEFAULT_STATE, activeItemIndex: targetIndex });

      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }

      onAnimationEnd(targetIndex);
    },
    [onAnimationEnd],
  );

  const slide = useCallback(
    (from: number, to: number, direction: Direction) => {
      if (itemCount <= 1 || from === to) return;

      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
      }

      setState((prev) => ({
        ...prev,
        isSliding: true,
        slidingFrom: from,
        slidingTo: to,
        slidingDirection: direction,
      }));

      const safetyMarginMs = 200;
      const durationMs = transitionDuration * 1000 + safetyMarginMs;
      safetyTimerRef.current = setTimeout(() => {
        setState((current) => {
          if (current.isSliding && current.slidingTo === to) {
            queueMicrotask(() => finalizeSliding(to));
          }

          return current;
        });
      }, durationMs);
    },
    [itemCount, transitionDuration, finalizeSliding],
  );

  const move = useCallback(
    (direction: Direction) => {
      const from = state.activeItemIndex;
      const shift = direction === 'right' ? 1 : -1;
      const to = itemCount > 1 ? modulo(from + shift, itemCount) : from;

      if (!state.isSliding) {
        slide(from, to, direction);
      }
    },
    [state.activeItemIndex, state.isSliding, itemCount, slide],
  );

  const jumpTo = useCallback(
    (to: number) => {
      if (0 <= to && to < itemCount) {
        const from = state.activeItemIndex;
        const direction = getSlidingDirection(from, to, itemCount);

        if (!state.isSliding) {
          slide(from, to, direction);
        }
      }
    },
    [state.activeItemIndex, state.isSliding, itemCount, slide],
  );

  return { state, move, jumpTo, finalizeSliding };
};
