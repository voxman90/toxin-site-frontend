import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { Guest } from '../../@types/data';
import Dropdown from '../Dropdown/Dropdown';
import type { DropdownOption, DropdownProps } from '../Dropdown/Dropdown';

type DropdownGuestsProps<T extends FieldValues> = Omit<
  DropdownProps<T>,
  'getDisplayedValue' | 'options'
>;

const I18N = {
  NS: 'components',
  PREFIX: 'dropdownGuests',
} as const;

const getSentence = (
  t: TFunction<typeof I18N.NS, typeof I18N.PREFIX>,
  values: Record<Guest, number>,
) => {
  const guestsCount = (values.adult || 0) + (values.child || 0);
  const babiesCount = values.baby || 0;

  const collocations = [
    guestsCount > 0 ? t('guest', { count: guestsCount }) : null,
    babiesCount > 0 ? t('baby', { count: babiesCount }) : null,
  ];

  const sentence = collocations.filter((col) => col !== null).join(', ');

  return sentence === '' ? t('default') : sentence;
};

const DropdownGuests = <T extends FieldValues>({ ...props }: DropdownGuestsProps<T>) => {
  const { t } = useTranslation(I18N.NS, { keyPrefix: I18N.PREFIX });

  const options: DropdownOption[] = useMemo(
    () => [
      { name: 'adult', label: t('adult_genitive_plural'), defaultValue: 0, range: [0, 10] },
      { name: 'child', label: t('child_genitive_plural'), defaultValue: 0, range: [0, 10] },
      { name: 'baby', label: t('baby_genitive_plural'), defaultValue: 0, range: [0, 10] },
    ],
    [t],
  );

  return (
    <Dropdown
      options={options}
      getDisplayedValue={(values) => getSentence(t, values as Record<Guest, number>)}
      hasControls
      {...props}
    />
  );
};

export default DropdownGuests;
