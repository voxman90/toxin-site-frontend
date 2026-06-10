import { useMemo } from 'react';

import type { BookingFilters } from '../@types/api/booking.api';

export const useStableBookingFields = (filters: Partial<BookingFilters>) => {
  const checkIn = filters?.checkIn ?? '';
  const checkOut = filters?.checkOut ?? '';

  const guestsKey = `${filters?.guests?.adult || 0}-${filters?.guests?.baby || 0}-${filters?.guests?.child || 0}`;

  const servicesKey = filters?.additionalServices?.join(',') || '';

  return useMemo(
    () => ({
      checkIn,
      checkOut,
      guestsKey,
      servicesKey,
    }),
    [checkIn, checkOut, guestsKey, servicesKey],
  );
};
