import type { TFunction } from 'i18next';
import type { MouseEventHandler } from 'react';

import type { BookingFilters } from '../@types/api/booking.api';
import type { KnownError } from '../@types/api/errors.api';
import type { Rule } from '../@types/data';
import type { BulletListItem } from '../components/BulletList/BulletList';
import type { IconItemProps } from '../components/IconItem/IconItem';
import { BASE_URL } from '../constants/endpoints';

export const mod = (dividend: number, divisor: number) => {
  if (divisor === 0) {
    throw new Error('division by zero');
  }

  return ((dividend % divisor) + divisor) % divisor;
};

const formatNumberWithSpaces = (x: number) => {
  return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatCurrency = (value: number) => `${formatNumberWithSpaces(value)} ₽`;

export const handleKeyDown = (callback: MouseEventHandler) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback(e as unknown as React.MouseEvent);
  }
};

export const isKnownError = (error: unknown): error is KnownError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data
  );
};

export const sleep = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

  return result;
};

export const getFeatures = (t: TFunction<'pages', 'booking'>): IconItemProps[] => [
  {
    name: 'insert_emoticon',
    heading: t('features.comfort'),
    description: t('features.comfortDescription'),
  },
  {
    name: 'location_city',
    heading: t('features.convenience'),
    description: t('features.convenienceDescription'),
  },
  {
    name: 'whatshot',
    heading: t('features.cosiness'),
    description: t('features.cosinessDescription'),
  },
];

export const getRules = (t: TFunction<'pages', 'booking'>, rules: Rule[]): BulletListItem[] => {
  const checkInAndOutRule = { id: t('rules.checkInAndOut'), text: t('rules.checkInAndOut') };
  const noSmoking = { id: t('rules.noSmoking'), text: t('rules.noSmoking') };
  const noPets = { id: t('rules.noPets'), text: t('rules.noPets') };
  const noParties = { id: t('rules.noParties'), text: t('rules.noParties') };

  const roomRules: BulletListItem[] = [checkInAndOutRule];
  if (!rules.includes('guestsAllowed')) roomRules.push(noParties);
  if (!rules.includes('petsAllowed')) roomRules.push(noPets);
  if (!rules.includes('smokeAllowed')) roomRules.push(noSmoking);

  return roomRules;
};

export const getBookingParams = (filters: BookingFilters) => {
  const bookingParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (['rules', 'additionalServices', 'accessibility'].includes(key) && value instanceof Array) {
      value.forEach((v) => bookingParams.append(key, String(v)));
    } else if (key === 'guests' && typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subVal]) => {
        if (subVal && subVal !== 0) bookingParams.set(subKey, String(subVal));
      });
    } else if (key === 'checkIn' || key === 'checkOut') {
      bookingParams.set(key, String(value));
    }
  });

  return bookingParams;
};

export const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) return imagePath;

  return `${BASE_URL}${imagePath}`;
};

export const createKnownError = ({
  message,
  status,
}: {
  message: string;
  status: number;
}): KnownError => {
  return {
    status,
    data: { message },
  };
};
