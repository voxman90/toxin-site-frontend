import { describe, expect, it } from 'vitest';

import type { SearchRoomsQuery } from '../@types/api/room.api';

import { getSearchSchema } from './search.schema';

const mockT = (key: string) => key;

const getMockData = (overrides: Partial<SearchRoomsQuery> = {}) => ({
  checkIn: '2030-07-01T00:00:00Z',
  checkOut: '2030-07-02T00:00:00Z',
  minPrice: 1000,
  maxPrice: 5000,
  guests: { adult: 2, child: 0, baby: 0 },
  rules: [],
  accessibility: [],
  additionalServices: [],
  amenities: { bed: 1, bathroom: 1, bedroom: 1 },
  ...overrides,
});

describe('Search Validation Schema', () => {
  const schema = getSearchSchema(mockT as any);

  it('should pass with fully valid data', () => {
    const isValid = schema.isValidSync(getMockData());

    expect(isValid).toBe(true);
  });

  it('should fail when with fully valid data', () => {
    const isValid = schema.isValidSync(
      getMockData({
        checkIn: '2030-07-01T00:00:00Z',
        checkOut: '2030-07-01T00:00:00Z',
      }),
    );

    expect(isValid).toBe(false);
  });

  it('should fail when checkIn or checkOut are empty strings', () => {
    const invalidDatesData = getMockData({
      checkIn: '2030-07-01T00:00:00Z',
      checkOut: '',
    });

    expect(schema.isValidSync(invalidDatesData)).toBe(false);
  });

  it('should fail if total guest count is zero', () => {
    const noGuestsData = getMockData({
      guests: { adult: 0, child: 0, baby: 1 },
    });

    expect(schema.isValidSync(noGuestsData)).toBe(false);
  });
});
