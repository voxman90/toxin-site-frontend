import { describe, expect, it } from 'vitest';

import type { BookingFilters } from '../@types/api/booking.api';

import { getBookingSchema } from './booking.schema';

const mockT = (key: string) => key;

const getMockData = (overrides: Partial<BookingFilters> = {}) => ({
  checkIn: '2026-06-01',
  checkOut: '2026-06-10',
  guests: { adult: 2, child: 0, baby: 0 },
  additionalServices: [],
  accessibility: [],
  ...overrides,
});

describe('Search Validation Schema', () => {
  const schema = getBookingSchema(mockT as any);

  it('should pass with fully valid data', () => {
    const isValid = schema.isValidSync(getMockData());

    expect(isValid).toBe(true);
  });

  it('should fail if checkIn or checkOut are empty strings', () => {
    const invalidDatesData = getMockData({
      checkIn: '2026-06-10',
      checkOut: '',
    });

    expect(schema.isValidSync(invalidDatesData)).toBe(false);
  });

  it('should fail if total guest count is zero', () => {
    const noGuestsData = getMockData({
      guests: { adult: 0, child: 0, baby: 0 },
    });

    expect(schema.isValidSync(noGuestsData)).toBe(false);
  });
});
