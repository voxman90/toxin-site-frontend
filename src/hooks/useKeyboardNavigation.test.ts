// @vitest-environment happy-dom
import * as focusManager from '@react-aria/focus';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useKeyboardNavigation } from './useKeyboardNavigation';

vi.mock('@react-aria/focus', () => ({
  useFocusManager: vi.fn(),
}));

describe('useKeyboardNavigation()', () => {
  const mockFocusManager = {
    focusNext: vi.fn(),
    focusPrevious: vi.fn(),
    focusFirst: vi.fn(),
    focusLast: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(focusManager.useFocusManager).mockReturnValue(mockFocusManager);
  });

  it.each(['ArrowDown', 'ArrowRight'])(
    'should call focusNext with wrap when %s is pressed',
    (pressedKey) => {
      const { result } = renderHook(() => useKeyboardNavigation());
      const preventDefault = vi.fn();

      const event = {
        key: pressedKey,
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLElement>;

      result.current(event);

      expect(mockFocusManager.focusNext).toHaveBeenCalledWith({ wrap: true });
      expect(preventDefault).toHaveBeenCalled();
    },
  );

  it.each(['ArrowLeft', 'ArrowUp'])(
    'should call focusPrevious with wrap when %s is pressed',
    (pressedKey) => {
      const { result } = renderHook(() => useKeyboardNavigation());
      const preventDefault = vi.fn();

      const event = {
        key: pressedKey,
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLElement>;

      result.current(event);

      expect(mockFocusManager.focusPrevious).toHaveBeenCalledWith({ wrap: true });
      expect(preventDefault).toHaveBeenCalled();
    },
  );

  it('should call focusFirst when Home is pressed', () => {
    const { result } = renderHook(() => useKeyboardNavigation());
    const event = {
      key: 'Home',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLElement>;

    result.current(event);

    expect(mockFocusManager.focusFirst).toHaveBeenCalled();
  });

  it('should call focusLast when End is pressed', () => {
    const { result } = renderHook(() => useKeyboardNavigation());
    const event = {
      key: 'End',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLElement>;

    result.current(event);

    expect(mockFocusManager.focusLast).toHaveBeenCalled();
  });

  it('should do nothing for unknown keys', () => {
    const { result } = renderHook(() => useKeyboardNavigation());
    const event = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLElement>;

    result.current(event);

    expect(mockFocusManager.focusPrevious).not.toHaveBeenCalled();
    expect(mockFocusManager.focusNext).not.toHaveBeenCalled();
    expect(mockFocusManager.focusFirst).not.toHaveBeenCalled();
    expect(mockFocusManager.focusLast).not.toHaveBeenCalled();
  });
});
