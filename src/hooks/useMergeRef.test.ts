// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useMergeRefs } from './useMergeRef';

describe('seMergeRefs', () => {
  it('should successfully merge and update both types of refs', () => {
    const callbackRef = vi.fn();
    const objectRef = React.createRef<HTMLInputElement>();
    const mockElement = document.createElement('input');

    const { result } = renderHook(() => useMergeRefs(callbackRef, objectRef));

    result.current(mockElement);

    expect(callbackRef).toHaveBeenCalledWith(mockElement);
    expect(objectRef.current).toBe(mockElement);
  });

  it('should handle null and undefined refs correctly', () => {
    const objectRef = React.createRef<HTMLInputElement>();
    const mockElement = document.createElement('input');

    const { result } = renderHook(() => useMergeRefs(null, undefined, objectRef));

    expect(() => result.current(mockElement)).not.toThrow();
    expect(objectRef.current).toBe(mockElement);
  });
});
