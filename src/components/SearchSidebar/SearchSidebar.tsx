import { yupResolver } from '@hookform/resolvers/yup';
import type { TFunction } from 'i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { SearchRoomsFilters } from '../../@types/api/room.api';
import {
  ACCESSIBILITY,
  ADDITIONAL_SERVICES,
  DEFAULT_STEP,
  MAX_PRICE,
  MIN_PRICE,
  RULES,
} from '../../constants/constants';
import { useSearchFilters } from '../../hooks/useSearchFilters';
import { getSearchSchema } from '../../schemas/search.schema';
import { formatCurrency } from '../../utils/utils';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import DropdownFacilities from '../DropdownAmenities/DropdownAmenities';
import DropdownDateFilter from '../DropdownDateFilter/DropdownDateFilter';
import DropdownGuests from '../DropdownGuests/DropdownGuests';
import ExpandableCheckboxGroup from '../ExpCheckboxGroup/ExpCheckboxGroup';
import Field from '../Field/Field';
import Fieldset from '../Fieldset/Fieldset';
import Label from '../Label/Label';
import RangeSlider from '../RangeSlider/RangeSlider';
import type { RangeState } from '../RangeSlider/range';

import './SearchSidebar.scss';
import { useFilterDebounce } from './useFilterDebounce';

const getRules = (tCommon: TFunction<'components'>) =>
  RULES.map((rule) => ({
    key: rule,
    value: rule,
    text: tCommon(`rules.${rule}`),
  }));

const getAccessibilityOptions = (tCommon: TFunction<'components'>) =>
  ACCESSIBILITY.map((opt) => ({
    key: opt,
    value: opt,
    text: tCommon(`accessibility.${opt}`),
    isRich: true,
    description: tCommon(`accessibility.${opt}Description`),
  }));

const getAdditionalServices = (tCommon: TFunction<'components'>) =>
  ADDITIONAL_SERVICES.map((service) => ({
    key: service,
    value: service,
    text: tCommon(`additionalServices.${service}`),
  }));

const SearchSidebar = ({
  onDebounceChange,
}: {
  onDebounceChange?: (isDebounceChange: boolean) => void;
}) => {
  const { t } = useTranslation('components', { keyPrefix: 'searchSidebar' });
  const { t: tCommon } = useTranslation('components');
  const { t: tErr } = useTranslation('components', { keyPrefix: 'errors' });
  const { filters, applyFilters } = useSearchFilters();

  const schema = useMemo(() => getSearchSchema(tErr), [tErr]);

  const methods = useForm<SearchRoomsFilters>({
    resolver: yupResolver(schema),
    defaultValues: {
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      accessibility: filters.accessibility,
      amenities: filters.amenities,
      additionalServices: filters.additionalServices,
      rules: filters.rules,
    },
    mode: 'onChange',
  });

  const { register, control, getValues, trigger, handleSubmit, setFocus } = methods;

  const reactiveFields = useWatch({
    control,
    name: [
      'checkIn',
      'checkOut',
      'guests',
      'rules',
      'accessibility',
      'amenities',
      'additionalServices',
    ],
  });
  const reactiveFieldsString = JSON.stringify(reactiveFields);

  const handleFiltersUpdate = useCallback(() => {
    const cleanValues = schema.cast(getValues());

    applyFilters(cleanValues);
  }, [applyFilters, getValues, schema]);

  const { onKeyDown, onKeyUp, onMouseDown } = useFilterDebounce({
    control,
    handleFiltersUpdate,
    onDebounceChange,
  });

  const rangeConfig: RangeState = useMemo(
    () => ({
      min: MIN_PRICE,
      max: MAX_PRICE,
      step: DEFAULT_STEP,
      from: filters.minPrice ?? MIN_PRICE,
      to: filters.maxPrice ?? MAX_PRICE,
      isFromFixed: false,
      isToFixed: false,
      isRangeFixed: false,
    }),
    [],
  );

  const rules = useMemo(() => getRules(tCommon), [tCommon]);
  const accessibilityOptions = useMemo(() => getAccessibilityOptions(tCommon), [tCommon]);
  const additionalServices = useMemo(() => getAdditionalServices(tCommon), [tCommon]);

  const [minPrice, maxPrice] = useWatch({ control, name: ['minPrice', 'maxPrice'] });
  const minPriceLabel = formatCurrency(minPrice ?? MIN_PRICE);
  const maxPriceLabel = formatCurrency(maxPrice ?? MAX_PRICE);

  useEffect(() => {
    handleFiltersUpdate();
  }, [reactiveFieldsString, handleFiltersUpdate]);

  useEffect(() => {
    setFocus('checkIn');

    trigger();
  }, [setFocus, trigger]);

  const onSubmit = useCallback(
    (data: Partial<SearchRoomsFilters>) => {
      applyFilters(data);
    },
    [applyFilters],
  );

  return (
    <section className="search-sidebar">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field width="md" margin="md" zIndex={60}>
          <DropdownDateFilter
            label={t('dateFilterLabelText')}
            control={control}
            nameFrom="checkIn"
            nameTo="checkOut"
          />
        </Field>
        <Field width="md" margin="lg" zIndex={50}>
          <DropdownGuests
            labelText={t('guestsLabelText')}
            size="md"
            control={control}
            name="guests"
          />
        </Field>
        <Field width="md" margin="lg" zIndex={40}>
          <Label
            text={t('priceLabelText')}
            appendix={`${minPriceLabel} - ${maxPriceLabel}`}
            hasLargeMargin
          />
          <RangeSlider
            nameFrom="minPrice"
            nameTo="maxPrice"
            control={control}
            config={rangeConfig}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onMouseDown={onMouseDown}
          />
          <p className="search-sidebar__price-caption">{t('priceCaption')}</p>
        </Field>
        <Field width="md" margin="lg" zIndex={30}>
          <Fieldset legend={t('rulesLegend')} indent="md">
            <CheckboxGroup name="rules" options={rules} register={register} />
          </Fieldset>
        </Field>
        <Field width="md" margin="lg" zIndex={20}>
          <Fieldset legend={t('accessibilityLegend')} indent="md">
            <CheckboxGroup
              name="accessibility"
              options={accessibilityOptions}
              register={register}
            />
          </Fieldset>
        </Field>
        <Field width="md" margin="sm" zIndex={10}>
          <DropdownFacilities
            labelText={t('amenitiesLabelText')}
            control={control}
            name="amenities"
          />
        </Field>
        <Field width="md" margin="sm" zIndex={0}>
          <ExpandableCheckboxGroup
            name="additionalServices"
            legend={t('additionalServicesLegend')}
            options={additionalServices}
            register={register}
          />
        </Field>
      </form>
    </section>
  );
};

export default SearchSidebar;
