import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { IRangeMappedToArray } from './rangeMappedToArray';
import RangeMappedToArray from './rangeMappedToArray';

describe('RangeMappedToArray model', () => {
  let range: IRangeMappedToArray<number>;

  beforeEach(() => {
    range = new RangeMappedToArray([0, 1, 2]);
  });

  describe('initialization and validation', () => {
    it('should initialize with an array of values', () => {
      // @ts-expect-error 'case of call with no args'
      expect(() => new RangeMappedToArray()).toThrow();
      expect(() => new RangeMappedToArray([])).toThrow();
    });

    it('should initialize with an array with at least one value', () => {
      expect(() => new RangeMappedToArray([1])).not.toThrow();
    });

    it('should throw an error if "max" index is out of array bounds', () => {
      expect(() => range.setMax(-5)).toThrow();
      expect(() => range.setMax(10)).toThrow();
    });

    it('should throw an error if "min" index is out of array bounds', () => {
      expect(() => range.setMin(-5)).toThrow();
      expect(() => range.setMin(10)).toThrow();
    });

    it('should throw an error if "min" or "max" values are not integers', () => {
      expect(() => range.setMin(0.1)).toThrow();
      expect(() => range.setMax(2.9)).toThrow();
    });

    it('should throw an error if "step" values are not integers', () => {
      expect(() => range.setStep(1.1)).toThrow();
    });

    it('should throw an error if new displayed values are an empty array', () => {
      expect(() => range.setDisplayedValues([])).toThrow();
    });

    it('should accept valid new displayed values', () => {
      expect(() => range.setDisplayedValues([1, 2])).not.toThrow();
      expect(() => range.setDisplayedValues([5, 6, 7, 8, 9])).not.toThrow();
    });
  });

  describe('mapping logic', () => {
    it('should update displayed values array via "setDisplayedValues"', () => {
      range.setDisplayedValues([7, 8, 9]);

      expect(range.getDisplayedValues()).toEqual([7, 8, 9]);
    });

    it('should return the correct displayed value by index via "getDisplayedValue"', () => {
      range.setDisplayedValues([1, 20, 300]);

      expect(range.getDisplayedValue(0)).toBe(1);
      expect(range.getDisplayedValue(1)).toBe(20);
      expect(range.getDisplayedValue(2)).toBe(300);
    });

    it('should return both current "from" and "to" displayed values', () => {
      range.setDisplayedValues([1, 20, 300, 4000, 50000]);
      range.setState({ from: 1, to: 3 });

      expect(range.getCurrentDisplayedValues()).toEqual({
        from: 20,
        to: 4000,
      });
    });
  });

  describe('constraints and rounding', () => {
    it('should force "from" value to be an integer via Math.round', () => {
      range.setFrom(1.1);

      expect(range.getState().from).toBe(1);
    });

    it('should force "to" value to be an integer via Math.round', () => {
      range.setTo(2.1);

      expect(range.getState().to).toBe(2);
    });

    it('should allow setting a custom integer "step"', () => {
      range.setDisplayedValues([1, 2, 3, 4, 5, 6, 7, 8]);
      range.setStep(2);
      range.setState({ from: 0, to: 7 });

      range.setFrom(3);

      expect(range.getState().from).toBe(4);

      range.setTo(5);

      expect(range.getState().to).toBe(6);
    });
  });

  describe('inherited behavior', () => {
    it('should still respect "min" and "max" boundaries for indices', () => {
      range.setDisplayedValues([1, 2, 3, 4]);

      range.setFrom(-5);
      range.setTo(10);

      const state = range.getState();
      expect(state.from).toBe(0);
      expect(state.to).toBe(3);
    });

    it('should notify subscribers when index-based state changes', () => {
      const mockSubscriber = vi.fn();

      range.subscribe(mockSubscriber);
      range.setFrom(2);

      expect(mockSubscriber).toHaveBeenCalledWith(range.getState());

      vi.clearAllMocks();
    });
  });
});
