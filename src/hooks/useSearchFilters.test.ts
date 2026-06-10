// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SearchRoomsQuery } from '../@types/api/room.api';
import {
  ACCESSIBILITY,
  DEFAULT_ROOM_LIMIT,
  DEFAULT_ROOM_ORDER,
  DEFAULT_ROOM_SORT,
  MAX_PRICE,
  MIN_PRICE,
} from '../constants/constants';

import { useSearchFilters } from './useSearchFilters';

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('useSearchFilters()', () => {
  const defaultFilter: SearchRoomsQuery = {
    checkIn: '',
    checkOut: '',
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    guests: {
      adult: 0,
      child: 0,
      baby: 0,
    },
    accessibility: [],
    additionalServices: [],
    amenities: {
      bed: 0,
      bathroom: 0,
      bedroom: 0,
    },
    rules: [],
    limit: DEFAULT_ROOM_LIMIT,
    order: DEFAULT_ROOM_ORDER,
    sort: DEFAULT_ROOM_SORT,
    page: 1,
  };

  const testFilter: SearchRoomsQuery = {
    checkIn: '2026-11-10:00:00.000Z',
    checkOut: '2026-12-10:00:00.000Z',
    minPrice: 1000000,
    maxPrice: 2000000,
    guests: {
      adult: 1,
      child: 2,
      baby: 3,
    },
    accessibility: ['wideCorridor'],
    additionalServices: ['crib', 'desk'],
    amenities: {
      bed: 10,
      bathroom: 11,
      bedroom: 12,
    },
    rules: ['guestsAllowed', 'smokeAllowed'],
    limit: DEFAULT_ROOM_LIMIT,
    order: DEFAULT_ROOM_ORDER,
    sort: DEFAULT_ROOM_SORT,
    page: 100,
  };

  const getMockLocation = (url: string): Location => {
    const mockLocation = { search: new URL(url).search } as any;
    return mockLocation;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle search params', () => {
    const mockLocation = getMockLocation(
      'https://example.com?checkIn=2026-11-10:00:00.000Z&checkOut=2026-12-10:00:00.000Z&minPrice=1000000&maxPrice=2000000&adult=1&child=2&baby=3&additionalServices=crib&additionalServices=desk&accessibility=wideCorridor&bed=10&bathroom=11&bedroom=12&rules=guestsAllowed&rules=smokeAllowed&page=100',
    );
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);

    const { result } = renderHook(() => useSearchFilters());

    expect(result.current.filters).toEqual(testFilter);
  });

  it('should ignore additional search params', () => {
    const mockLocation = getMockLocation(
      'https://example.com/path/param?add=100&add2=&add3=string#fragments',
    );
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);

    const { result } = renderHook(() => useSearchFilters());

    expect(result.current.filters).toEqual(defaultFilter);
  });

  it('should handle empty search', () => {
    const mockLocation = getMockLocation('https://example.com?');
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);

    const { result } = renderHook(() => useSearchFilters());

    expect(result.current.filters).toEqual(defaultFilter);
  });

  it('should correctly build new search params in applyFilters', () => {
    const mockLocation = getMockLocation('https://example.com?');
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useSearchFilters());

    act(() => result.current.applyFilters({ checkIn: '2026-05-06', page: 5 }));

    const newSearch = (mockNavigate as Mock).mock.calls[0][0];

    expect(newSearch.includes('checkIn=2026-05-06')).toBe(true);
    expect(newSearch.includes('page=5')).toBe(true);
  });

  it('should reset page param when page not specified', () => {
    const mockLocation = getMockLocation('https://example.com');
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useSearchFilters());

    const { page, ...filtersWithoutPage } = testFilter;
    act(() => result.current.applyFilters(filtersWithoutPage));

    const newSearch = (mockNavigate as Mock).mock.calls[0][0];

    expect(newSearch.includes('page=1')).toBe(true);
  });

  it('should split arrays in the new search params in applyFilter', () => {
    const mockLocation = getMockLocation('https://example.com');
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useSearchFilters());

    act(() => result.current.applyFilters({ accessibility: ACCESSIBILITY }));

    const newSearch = (mockNavigate as Mock).mock.calls[0][0];

    expect(new URLSearchParams(newSearch).getAll('accessibility')).toEqual(ACCESSIBILITY);
  });

  it('should remove empty params in the new search params in applyFilter', () => {
    const mockLocation = getMockLocation('https://example.com');
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useLocation).mockReturnValue(mockLocation);
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useSearchFilters());

    act(() =>
      result.current.applyFilters({
        accessibility: undefined,
        rules: undefined,
        checkIn: '',
        minPrice: 0,
        maxPrice: 1000,
        guests: {
          baby: 0,
          adult: 0,
          child: 1,
        },
      }),
    );

    const newSearch = (mockNavigate as Mock).mock.calls[0][0];
    const newURLSearchParams = new URLSearchParams(newSearch);

    expect(newURLSearchParams.has('accessibility')).toBe(false);
    expect(newURLSearchParams.has('rules')).toBe(false);
    expect(newURLSearchParams.has('baby')).toBe(false);
    expect(newURLSearchParams.has('adult')).toBe(false);
    expect(newURLSearchParams.has('checkIn')).toBe(false);
    expect(newURLSearchParams.get('child')).toBe('1');
    expect(newURLSearchParams.get('minPrice')).toBe('0');
    expect(newURLSearchParams.get('maxPrice')).toBe('1000');
  });
});
