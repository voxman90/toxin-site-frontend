import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { SearchRoomsQuery } from '../@types/api/room.api';
import type { Accessibility, AdditionalService, RoomSort, Rule } from '../@types/data';
import type { DeepRequired } from '../@types/utils';
import {
  DEFAULT_ROOM_LIMIT,
  DEFAULT_ROOM_ORDER,
  DEFAULT_ROOM_SORT,
  MAX_PRICE,
  MIN_PRICE,
} from '../constants/constants';

const getFiltersFromUrl = (searchParams: URLSearchParams): DeepRequired<SearchRoomsQuery> => ({
  checkIn: searchParams.get('checkIn') ?? '',
  checkOut: searchParams.get('checkOut') ?? '',
  minPrice: Number(searchParams.get('minPrice') ?? MIN_PRICE),
  maxPrice: Number(searchParams.get('maxPrice') ?? MAX_PRICE),
  guests: {
    adult: Number(searchParams.get('adult') ?? 0),
    child: Number(searchParams.get('child') ?? 0),
    baby: Number(searchParams.get('baby') ?? 0),
  },
  additionalServices: searchParams.getAll('additionalServices') as AdditionalService[],
  accessibility: searchParams.getAll('accessibility') as Accessibility[],
  amenities: {
    bed: Number(searchParams.get('bed') ?? 0),
    bathroom: Number(searchParams.get('bathroom') ?? 0),
    bedroom: Number(searchParams.get('bedroom') ?? 0),
  },
  rules: searchParams.getAll('rules') as Rule[],
  sort: (searchParams.get('sort') as RoomSort) ?? DEFAULT_ROOM_SORT,
  limit: Number(searchParams.get('limit') ?? DEFAULT_ROOM_LIMIT),
  order: Number(searchParams.get('order') ?? DEFAULT_ROOM_ORDER),
  page: Number(searchParams.get('page') ?? 1),
});

export const useSearchFilters = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const filters = useMemo(() => getFiltersFromUrl(searchParams), [searchParams]);

  const applyFilters = useCallback(
    (updates: Partial<SearchRoomsQuery>) => {
      const next = new URLSearchParams(window.location.search);

      Object.entries(updates).forEach(([key, value]) => {
        if (typeof value !== 'object' || value === null) {
          next.delete(key);
        }

        if ((key === 'minPrice' || key === 'maxPrice') && typeof value === 'number') {
          return next.set(key, String(value));
        }

        if (!value) return;

        if (Array.isArray(value)) {
          next.delete(key);

          if (value.length !== 0) {
            value.forEach((v) => next.append(key, String(v)));
          }

          return;
        }

        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subVal]) => {
            if (subVal) {
              next.set(subKey, String(subVal));
            } else {
              next.delete(subKey);
            }
          });

          return;
        }

        next.set(key, String(value));
      });

      if (!Object.hasOwn(updates, 'page')) {
        next.set('page', '1');
      }

      navigate(`?${next.toString()}`, { replace: true });
    },
    [navigate],
  );

  return { searchParams, filters, applyFilters };
};
