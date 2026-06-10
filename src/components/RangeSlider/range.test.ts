import { beforeEach, describe, expect, it, vi } from 'vitest';

import Range from './range';
import type { RangeState } from './range';

export const DEFAULT_STATE = {
  min: 0,
  max: 1,
  from: 0,
  to: 0,
  step: 1,
  isFromFixed: false,
  isToFixed: false,
  isRangeFixed: false,
};

export const DIRTY_STATE = {
  min: 50,
  from: 75,
  to: 125,
  max: 150,
  step: 5,
  isFromFixed: true,
  isRangeFixed: true,
  isToFixed: true,
};

export const createRangeStateMock = (overrides: Partial<RangeState> = {}): RangeState => ({
  ...DEFAULT_STATE,
  ...overrides,
});

describe('Range model', () => {
  let range: Range;

  beforeEach(() => {
    range = new Range();
    range.setState(createRangeStateMock());

    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('state', () => {
    it('should initialize with default state', () => {
      expect(range.getState()).toEqual(DEFAULT_STATE);
    });

    it('should set the state', () => {
      range.setState(DIRTY_STATE);

      expect(range.getState()).toEqual(DIRTY_STATE);
    });

    it('should return deep clone via getState', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      const state = range.getState();
      state.from = 9999;

      expect(range.getState().from).toEqual(75);
    });
  });

  describe('state validation', () => {
    const STATE_INVALID_MESSAGE = 'State is not valid';

    it('should throw an error when "max" < "min"', () => {
      const invalidState = createRangeStateMock({
        min: 200,
        from: 200,
        to: 210,
        max: 100,
      });

      expect(() => Range.isStateValid(invalidState)).toThrow(STATE_INVALID_MESSAGE);
      expect(() => range.setState(invalidState)).toThrow(STATE_INVALID_MESSAGE);
    });

    it('should throw an error when "from" out of range', () => {
      const invalidState = createRangeStateMock({
        min: 100,
        from: 10,
        to: 150,
        max: 200,
      });

      expect(() => Range.isStateValid(invalidState)).toThrow(STATE_INVALID_MESSAGE);
      expect(() => range.setState(invalidState)).toThrow(STATE_INVALID_MESSAGE);
    });

    it('should throw an error when "to" out of range', () => {
      const invalidState = createRangeStateMock({
        min: 100,
        from: 150,
        to: 210,
        max: 200,
      });

      expect(() => Range.isStateValid(invalidState)).toThrow(STATE_INVALID_MESSAGE);
      expect(() => range.setState(invalidState)).toThrow(STATE_INVALID_MESSAGE);
    });

    it('should throw an error when "from" > "to"', () => {
      const invalidState = createRangeStateMock({
        min: 100,
        from: 150,
        to: 140,
        max: 200,
      });

      expect(() => Range.isStateValid(invalidState)).toThrow(STATE_INVALID_MESSAGE);
      expect(() => range.setState(invalidState)).toThrow(STATE_INVALID_MESSAGE);
    });

    it.each([-10, 0])('should throw an error when "step" <= 0 [%s]', (step) => {
      const invalidState = createRangeStateMock({
        min: 100,
        from: 140,
        to: 180,
        max: 200,
        step,
      });

      expect(() => Range.isStateValid(invalidState)).toThrow(STATE_INVALID_MESSAGE);
      expect(() => range.setState(invalidState)).toThrow(STATE_INVALID_MESSAGE);
    });

    it('should NOT throw an error when "min" === "max"', () => {
      const invalidState = createRangeStateMock({
        min: 100,
        from: 100,
        to: 100,
        max: 100,
      });

      expect(() => Range.isStateValid(invalidState)).not.toThrow();
      expect(() => range.setState(invalidState)).not.toThrow();
    });
  });

  describe('setters and getters', () => {
    it('should set "min"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setMin(0);

      expect(range.getState().min).toBe(0);
    });

    it('should set "max"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setMax(200);

      expect(range.getState().max).toBe(200);
    });

    it('should set "from"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setFrom(70);

      expect(range.getState().from).toBe(70);
    });

    it('should set "to"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setTo(100);

      expect(range.getState().to).toBe(100);
    });

    it('should get range ("to" - "from")', () => {
      range.setState({ min: 500, from: 750, to: 1250, max: 1500, step: 5 });

      expect(range.getRange()).toBe(500);
    });

    it('should get range ("to" - "from") percent', () => {
      range.setState({ min: 500, from: 750, to: 1250, max: 1500, step: 5 });

      expect(range.getRangePercent()).toBe(50);
    });

    it('should get length ("max" - "min")', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getLength()).toBe(100);
    });
  });

  describe('value constraints', () => {
    it('should clamp "from" value to "min" if provided value is lower', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setFrom(30);

      expect(range.getState().from).toBe(50);
    });

    it('should clamp "to" value to "max" if provided value is higher', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setTo(200);

      expect(range.getState().to).toBe(150);
    });

    it('should prevent "from" from exceeding current "to" value', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setFrom(130);

      expect(range.getState().from).toBe(125);
    });

    it('should prevent "to" from falling below current "from" value', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setTo(60);

      expect(range.getState().to).toBe(75);
    });
  });

  describe('stepping and snapping', () => {
    it('should snap values to the nearest multiple of "step"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setFrom(77.5);
      expect(range.getState().from).toBe(80);

      range.setFrom(72.5);
      expect(range.getState().from).toBe(75);

      range.setFrom(72.49);
      expect(range.getState().from).toBe(70);

      range.setTo(122.49);
      expect(range.getState().to).toBe(120);
    });

    it('should maintain step snapping even at the "max" boundary', () => {
      range.setState({ min: 0, max: 99, from: 0, to: 0, step: 5 });

      range.setTo(100);

      expect(range.getState().to).toBe(99);
    });
  });

  describe('range movement', () => {
    it('should shift both "from" and "to" by the same offset while maintaining distance', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setRange(85);

      const state = range.getState();
      expect(state.from).toBe(85);
      expect(state.to).toBe(135);
      expect(range.getRange()).toBe(50);
    });

    it('should prevent the entire range from moving beyond "min" or "max"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      range.setRange(0);

      expect(range.getState().from).toBe(50);
      expect(range.getRange()).toBe(50);

      range.setRange(150);

      expect(range.getState().from).toBe(100);
      expect(range.getRange()).toBe(50);
    });
  });

  describe('fixed state behavior', () => {
    it('should ignore "setFrom" calls when "isFromFixed" is enabled', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });
      range.setState({ isFromFixed: true });

      range.setFrom(90);

      expect(range.getState().from).toBe(75);
    });

    it('should ignore "setRange" calls when "isFromFixed" is enabled', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });
      range.setState({ isFromFixed: true });

      range.setRange(90);

      expect(range.getState().from).toBe(75);
    });

    it('should ignore "setTo" calls when "isToFixed" is enabled', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });
      range.setState({ isToFixed: true });

      range.setTo(100);

      expect(range.getState().to).toBe(125);
    });

    it('should ignore "setRange" calls when "isToFixed" is enabled', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });
      range.setState({ isToFixed: true });

      range.setRange(100);

      expect(range.getState().to).toBe(125);
    });

    it('should prevent range changing when "isRangeFixed" is enabled', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });
      range.setState({ isRangeFixed: true });

      range.setFrom(95);

      const state = range.getState();
      expect(state.from).toBe(95);
      expect(state.to).toBe(145);
    });
  });

  describe('value to percent mapping', () => {
    it('should return 0 percent when value is at or below "min"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getPercent(50)).toBe(0);
      expect(range.getPercent(25)).toBe(0);
    });

    it('should return 100 percent when value is at or above "max"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getPercent(150)).toBe(100);
      expect(range.getPercent(175)).toBe(100);
    });

    it('should return percentage within range for values', () => {
      range.setState({ min: 0, from: 0, to: 0, max: 100, step: 1 });

      expect(range.getPercent(150)).toBe(100);
      expect(range.getPercent(100)).toBe(100);
      expect(range.getPercent(50)).toBe(50);
      expect(range.getPercent(0)).toBe(0);
      expect(range.getPercent(-50)).toBe(0);
    });

    it('should return value within range from percentage', () => {
      range.setState({ min: 50, from: 50, to: 50, max: 150, step: 2 });

      expect(range.getValue(150)).toBe(150);
      expect(range.getValue(100)).toBe(150);
      expect(range.getValue(50)).toBe(100);
      expect(range.getValue(0)).toBe(50);
      expect(range.getValue(-50)).toBe(50);
    });
  });

  describe('getClosestEnd', () => {
    it('should return "from" when value <= "from"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getClosestEnd(75)).toBe('from');
      expect(range.getClosestEnd(0)).toBe('from');
    });

    it('should return "to" when value >= "to"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getClosestEnd(175)).toBe('to');
      expect(range.getClosestEnd(125)).toBe('to');
    });

    it('should return nearest end when value in between "from" and "to"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getClosestEnd(99)).toBe('from');
      expect(range.getClosestEnd(101)).toBe('to');
    });

    it('should default to "to" when value exactly in the middle between "from" and "to"', () => {
      range.setState({ min: 50, from: 75, to: 125, max: 150, step: 5 });

      expect(range.getClosestEnd(100)).toBe('to');
    });
  });

  describe('subscription and notification', () => {
    it('should execute subscriber callbacks immediately after state updates', () => {
      const mockSubscriber = vi.fn();

      range.subscribe(mockSubscriber);
      range.setState({ isFromFixed: true });

      expect(mockSubscriber).toHaveBeenCalledOnce();
    });

    it('should provide the complete state payload to the subscriber', () => {
      const mockSubscriber = vi.fn();

      range.subscribe(mockSubscriber);
      range.setState(DIRTY_STATE);

      expect(mockSubscriber).toHaveBeenCalledWith(DIRTY_STATE);
    });

    it('should stop notifying when a subscriber unsubscribes', () => {
      const mockSubscriber = vi.fn();

      range.subscribe(mockSubscriber);
      range.unsubscribe(mockSubscriber);
      range.setState({ isFromFixed: true });

      expect(mockSubscriber).not.toHaveBeenCalled();
    });
  });
});
