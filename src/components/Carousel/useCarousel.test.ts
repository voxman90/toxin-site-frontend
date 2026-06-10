// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCarousel } from './useCarousel';
import type { CarouselState, UseCarouselParams } from './useCarousel';

const createCarouselStateMock = (overrides: Partial<CarouselState> = {}): CarouselState => ({
  activeItemIndex: 0,
  isSliding: false,
  slidingFrom: null,
  slidingTo: null,
  slidingDirection: 'right',
  ...overrides,
});

const createUseCarouselArgs = (overrides: Partial<UseCarouselParams> = {}): UseCarouselParams => ({
  itemCount: 0,
  initialIndex: 0,
  transitionDuration: 0.3,
  onAnimationEnd: () => {},
  ...overrides,
});

describe('useCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should set the initial active index correctly', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 4,
          }),
        ),
      );

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          activeItemIndex: 4,
        }),
      );
    });

    it('should handle initialIndex larger than itemCount using modulo', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 12,
          }),
        ),
      );

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          activeItemIndex: 2,
        }),
      );
    });

    it('should set default state when itemCount is 0', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 0,
          }),
        ),
      );

      expect(result.current.state).toEqual(createCarouselStateMock());
    });
  });

  describe('direction logic (getSlidingDirection)', () => {
    it('should return "right" for forward step', () => {
      const { result } = renderHook(() => useCarousel(createUseCarouselArgs({ itemCount: 2 })));

      act(() => result.current.move('right'));

      expect(result.current.state.slidingDirection).toBe('right');
    });

    it('should return "left" for backward step', () => {
      const { result } = renderHook(() => useCarousel(createUseCarouselArgs({ itemCount: 2 })));

      act(() => result.current.move('left'));

      expect(result.current.state.slidingDirection).toBe('left');
    });

    it('should return "right" when jumping from last to first (looping forward)', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            initialIndex: 2,
            itemCount: 3,
          }),
        ),
      );

      act(() => result.current.jumpTo(0));

      expect(result.current.state.slidingDirection).toBe('right');
    });

    it('should return "left" when jumping from first to last (looping backward)', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            initialIndex: 0,
            itemCount: 3,
          }),
        ),
      );

      act(() => result.current.jumpTo(2));

      expect(result.current.state.slidingDirection).toBe('left');
    });

    it('should find the shortest path when jumping over multiple slides', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            initialIndex: 0,
            itemCount: 10,
          }),
        ),
      );

      act(() => result.current.jumpTo(6));

      expect(result.current.state.slidingDirection).toBe('left');
    });
  });

  describe('navigation (move)', () => {
    it('should change state correctly when moving "right"', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 1,
          }),
        ),
      );

      act(() => result.current.move('right'));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          isSliding: true,
          activeItemIndex: 1,
          slidingFrom: 1,
          slidingTo: 2,
          slidingDirection: 'right',
        }),
      );
    });

    it('should change state correctly when moving "left"', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 4,
          }),
        ),
      );

      act(() => {
        result.current.move('left');
      });

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          isSliding: true,
          activeItemIndex: 4,
          slidingFrom: 4,
          slidingTo: 3,
          slidingDirection: 'left',
        }),
      );
    });

    it('should loop to the beginning when moving "right" from the last slide', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 4,
          }),
        ),
      );

      act(() => result.current.move('right'));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          isSliding: true,
          activeItemIndex: 4,
          slidingFrom: 4,
          slidingTo: 0,
          slidingDirection: 'right',
        }),
      );
    });

    it('should loop to the end when moving "left" from the first slide', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 0,
          }),
        ),
      );

      act(() => result.current.move('left'));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          isSliding: true,
          activeItemIndex: 0,
          slidingFrom: 0,
          slidingTo: 4,
          slidingDirection: 'left',
        }),
      );
    });

    it('should block navigation if isSliding is true', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 1,
          }),
        ),
      );

      act(() => result.current.move('right'));
      act(() => result.current.move('left'));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          isSliding: true,
          activeItemIndex: 1,
          slidingFrom: 1,
          slidingTo: 2,
          slidingDirection: 'right',
        }),
      );
    });

    it('should block navigation if itemCount is 1', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 1,
            initialIndex: 0,
          }),
        ),
      );

      act(() => result.current.move('left'));

      expect(result.current.state).toEqual(createCarouselStateMock());
    });
  });

  describe('direct jumps (jumpTo)', () => {
    it('should set correct target index and direction on jump', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 10,
            initialIndex: 8,
          }),
        ),
      );

      act(() => result.current.jumpTo(4));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          isSliding: true,
          activeItemIndex: 8,
          slidingFrom: 8,
          slidingTo: 4,
          slidingDirection: 'left',
        }),
      );
    });

    it('should do nothing if jumping to the currently active index', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 4,
          }),
        ),
      );

      act(() => result.current.jumpTo(4));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          activeItemIndex: 4,
          slidingDirection: 'right',
        }),
      );
    });

    it.each([-1, 5])(
      'should do nothing if jumping to the out of range index [%s]',
      (targetIndex) => {
        const { result } = renderHook(() =>
          useCarousel(
            createUseCarouselArgs({
              itemCount: 5,
              initialIndex: 0,
            }),
          ),
        );

        act(() => result.current.jumpTo(targetIndex));

        expect(result.current.state).toEqual(createCarouselStateMock());
      },
    );
  });

  describe('finalizing animation', () => {
    it('should reset sliding state and update activeItemIndex on finalizeSliding', () => {
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 1,
          }),
        ),
      );

      act(() => result.current.jumpTo(3));
      act(() => result.current.finalizeSliding(3));

      expect(result.current.state).toEqual(
        createCarouselStateMock({
          activeItemIndex: 3,
        }),
      );
    });

    it('should trigger the onAnimationEnd callback with the correct index', () => {
      const onEnd = vi.fn();
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 1,
            onAnimationEnd: onEnd,
          }),
        ),
      );

      act(() => result.current.jumpTo(3));

      expect(onEnd).toHaveBeenCalledTimes(0);

      act(() => result.current.finalizeSliding(3));

      expect(onEnd).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledWith(3);
    });

    it('should clear safety timers after finalization', async () => {
      vi.useFakeTimers();

      const onEnd = vi.fn();
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 1,
            onAnimationEnd: onEnd,
          }),
        ),
      );

      const timerCount = vi.getTimerCount();

      act(() => result.current.jumpTo(3));

      expect(vi.getTimerCount()).toBe(timerCount + 1);

      act(() => result.current.finalizeSliding(3));

      expect(onEnd).toHaveBeenCalledOnce();
      expect(vi.getTimerCount()).toBe(timerCount);

      act(() => vi.advanceTimersByTime(1000));

      await Promise.resolve();

      expect(onEnd).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });
  });

  describe('safety mechanisms', () => {
    it('should finalize sliding after the safety timeout and microtask queue used', async () => {
      vi.useFakeTimers();

      const onEnd = vi.fn();
      const { result } = renderHook(() =>
        useCarousel(
          createUseCarouselArgs({
            itemCount: 5,
            initialIndex: 1,
            onAnimationEnd: onEnd,
          }),
        ),
      );

      act(() => result.current.jumpTo(3));
      act(() => vi.advanceTimersByTime(1000));

      expect(onEnd).not.toHaveBeenCalled();

      await act(async () => {
        Promise.resolve();
      });

      expect(onEnd).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });
  });
});
