import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatCurrency, handleKeyDown, mod, sleep } from './utils';

describe('mod(a, b)', () => {
  it('should handle positive numbers', () => {
    expect(mod(99, 99)).toBe(0);
    expect(mod(99, 98)).toBe(1);
    expect(mod(98, 99)).toBe(98);
  });

  it('should handle negative numbers', () => {
    expect(mod(-99, -99)).toBe(-0);
    expect(mod(-99, -98)).toBe(-1);
    expect(mod(-98, -99)).toBe(-98);
  });

  it('should handle numbers with different signs', () => {
    expect(mod(99, -99)).toBe(-0);
    expect(mod(99, -98)).toBe(-97);
    expect(mod(98, -99)).toBe(-1);
    expect(mod(-99, 99)).toBe(0);
    expect(mod(-99, 98)).toBe(97);
    expect(mod(-98, 99)).toBe(1);
  });

  it('should handle zero in the first operand', () => {
    expect(mod(0, 99)).toBe(0);
    expect(mod(0, -99)).toBe(-0);
  });

  it('should throw an error when dividing by zero', () => {
    expect(() => mod(99, 0)).toThrow();
    expect(() => mod(-99, 0)).toThrow();
    expect(() => mod(0, 0)).toThrow();
  });
});

describe('formatCurrency()', () => {
  it('should positive numbers', () => {
    expect(formatCurrency(1000000)).toBe('1 000 000 ₽');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('0 ₽');
  });

  it('should handle fractional numbers', () => {
    expect(formatCurrency(9999.99)).toBe('9 999.99 ₽');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-10000)).toBe('-10 000 ₽');
  });
});

describe('handleKeyDown()', () => {
  it.each(['Enter', ' '])(
    'should call callback and preventDefault when %s is pressed',
    (pressedKey) => {
      const callback = vi.fn();
      const preventDefault = vi.fn();

      const event = {
        key: pressedKey,
        preventDefault,
      } as unknown as React.KeyboardEvent;

      handleKeyDown(callback)(event);

      expect(callback).toHaveBeenCalledOnce();
      expect(preventDefault).toHaveBeenCalled();
    },
  );

  it.each(['Escape'])(
    'should not call callback and preventDefault when %s is pressed',
    (pressedKey) => {
      const callback = vi.fn();

      const event = {
        key: pressedKey,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      handleKeyDown(callback)(event);

      expect(callback).not.toHaveBeenCalled();
    },
  );
});

describe('sleep()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return pending promise when time has not passed', async () => {
    const handler = vi.fn();
    const promise = Promise.resolve('fulfilled');

    sleep(promise, 100).then(handler);

    await vi.advanceTimersByTimeAsync(50);

    expect(handler).not.toHaveBeenCalled();
  }, 50);

  it('should return rejected promise right away', async () => {
    const promise = new Promise((_, reject) => setTimeout(() => reject(new Error('rejected')), 50));

    const result = sleep(promise, 50);

    await Promise.all([
      expect(result).rejects.toThrow('rejected'),
      vi.advanceTimersByTimeAsync(100),
    ]);
  }, 50);

  it('should return fullfiled promise even after time has expired', async () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve('fulfilled'), 150));

    const result = sleep(promise, 100);

    await vi.advanceTimersByTimeAsync(150);

    await expect(result).resolves.toBe('fulfilled');
  }, 50);
});
