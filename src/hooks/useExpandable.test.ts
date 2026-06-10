// @vitest-environment happy-dom
import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useExpandable } from './useExpandable';

describe('useExpandable(isExpandedInitially, isDisabled)', () => {
  let element: HTMLElement | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (element && document.body.contains(element)) {
      document.body.removeChild(element);
    }

    element = null;
  });

  it('isExpanded should be false by default', () => {
    const { result } = renderHook(() => useExpandable());

    expect(result.current.isExpanded).toBe(false);
  });

  it.each([true, false])('setIsExpanded should change isExpanded to %s', (val) => {
    const { result } = renderHook(() => useExpandable());

    act(() => result.current.setIsExpanded(val));

    expect(result.current.isExpanded).toBe(val);
  });

  it.each([true, false])(
    'setIsExpanded should change isExpanded to %s when isDisabled is true',
    (val) => {
      const { result } = renderHook(() => useExpandable(undefined, true));

      act(() => result.current.setIsExpanded(val));

      expect(result.current.isExpanded).toBe(val);
    },
  );

  it.each([true, false])(
    'isExpanded should be equal to isExpandedInitially [%s]',
    (isExpandedInitially) => {
      const { result } = renderHook(() => useExpandable(isExpandedInitially));

      expect(result.current.isExpanded).toBe(isExpandedInitially);
    },
  );

  it.each([true, false])(
    'isExpanded should be false when mousedown fire outside the ref [isExpanded is %s initially]',
    (isExpandedInitially) => {
      const { result } = renderHook(() => useExpandable(isExpandedInitially));

      act(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        result.current.ref.current = element;
      });

      fireEvent.mouseDown(document.body);

      expect(result.current.isExpanded).toBe(false);
    },
  );

  it.each([true, false])(
    'isExpanded should not change when mousedown fire outside the ref [isExpanded is %s initially]',
    (isExpandedInitially) => {
      const { result } = renderHook(() => useExpandable(isExpandedInitially, true));

      act(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        result.current.ref.current = element;
      });

      fireEvent.mouseDown(document.body);

      expect(result.current.isExpanded).toBe(isExpandedInitially);
    },
  );

  it.each([true, false])(
    'isExpanded should be false when Escape is pressed [isExpanded is %s initially]',
    (isExpandedInitially) => {
      const { result } = renderHook(() => useExpandable(isExpandedInitially));

      act(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        result.current.ref.current = element;
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(result.current.isExpanded).toBe(false);
    },
  );

  it.each([true, false])(
    'isExpanded should not change when Escape is pressed and isDisabled is true [isExpanded is %s initially]',
    (isExpandedInitially) => {
      const { result } = renderHook(() => useExpandable(isExpandedInitially, true));

      act(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
        result.current.ref.current = element;
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(result.current.isExpanded).toBe(isExpandedInitially);
    },
  );

  it('should remove added eventListeners', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useExpandable(true));

    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addSpy.mockClear();
    removeSpy.mockClear();

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
