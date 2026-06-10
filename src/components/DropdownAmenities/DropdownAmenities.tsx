import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Amenity } from '../../@types/data';
import Dropdown from '../Dropdown/Dropdown';
import type { DropdownOption, DropdownProps } from '../Dropdown/Dropdown';

type DropdownAmenitiesProps<T extends FieldValues> = Omit<
  DropdownProps<T>,
  'getDisplayedValue' | 'options' | 'size'
>;

const I18N = {
  NS: 'components',
  PREFIX: 'dropdownAmenities',
} as const;

const getSentence = (
  t: TFunction<typeof I18N.NS, typeof I18N.PREFIX>,
  values: Record<Amenity, number>,
): string => {
  const collocations = [
    values.bedroom > 0 ? t('bedroom', { count: values.bedroom }) : null,
    values.bed > 0 ? t('bed', { count: values.bed }) : null,
    values.bathroom > 0 ? t('bathroom', { count: values.bathroom }) : null,
  ];

  const sentence = collocations.filter((col) => col !== null).join(', ');

  return sentence === '' ? t('default') : sentence;
};

const DropdownAmenities = <T extends FieldValues>({ ...props }: DropdownAmenitiesProps<T>) => {
  const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });

  const options: DropdownOption[] = useMemo(
    () => [
      { name: 'bedroom', label: t('bedroom_genitive_plural'), defaultValue: 0, range: [0, 5] },
      { name: 'bed', label: t('bed_genitive_plural'), defaultValue: 0, range: [0, 5] },
      { name: 'bathroom', label: t('bathroom_genitive_plural'), defaultValue: 0, range: [0, 5] },
    ],
    [t],
  );

  return (
    <Dropdown
      {...props}
      size="md"
      options={options}
      getDisplayedValue={(values) => getSentence(t, values as Record<Amenity, number>)}
    />
  );
};

export default DropdownAmenities;
