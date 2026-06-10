import type { TFunction } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Control, FieldValues, UseFormWatch } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import type { IRatingSummary } from '../../../@types/data';
import type { BulletListItem } from '../../../components/BulletList/BulletList';
import BulletList from '../../../components/BulletList/BulletList';
import Button from '../../../components/Button';
import type { CheckboxProps } from '../../../components/Checkbox/Checkbox';
import type { CheckboxGroupOption } from '../../../components/CheckboxGroup/CheckboxGroup';
import CheckboxGroup from '../../../components/CheckboxGroup/CheckboxGroup';
import DropdownFacilities from '../../../components/DropdownAmenities/DropdownAmenities';
import DropdownDate from '../../../components/DropdownDate/DropdownDate';
import DropdownDateFilter from '../../../components/DropdownDateFilter/DropdownDateFilter';
import DropdownGuests from '../../../components/DropdownGuests/DropdownGuests';
import ExpandableCheckboxGroup from '../../../components/ExpCheckboxGroup/ExpCheckboxGroup';
import Field from '../../../components/Field/Field';
import type { IconItemProps } from '../../../components/IconItem/IconItem';
import IconItemList from '../../../components/IconItemList/IconItemList';
import Label from '../../../components/Label/Label';
import LangSelector from '../../../components/LangSelector/LangSelector';
import LikeButton from '../../../components/LikeButton/LikeButton';
import Logo from '../../../components/Logo/Logo';
import MaskedFieldDate from '../../../components/MaskedFieldDate/MaskedFieldDate';
import Pagination from '../../../components/Pagination/Pagination';
import RadioButton from '../../../components/RadioButton/RadioButton';
import RangeSlider from '../../../components/RangeSlider/RangeSlider';
import RateButton from '../../../components/RateButton/RateButton';
import { RatingChartView } from '../../../components/RatingChart/RatingChart';
import Review from '../../../components/Review/Review';
import SubscriptionField from '../../../components/SubscriptionField/SubscriptionField';
import TextField from '../../../components/TextField/TextField';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import Toggle from '../../../components/Toggle/Toggle';
import { ROUTES } from '../../../routes';

import './FormElements.scss';

const ICON_ITEM_NAMES = ['insert_emoticon', 'location_city'] as const;

const RATING_SUMMARY: IRatingSummary = {
  avgScore: 3.99,
  totalCount: 229,
  scoreBreakdown: { '1': 4, '2': 10, '3': 45, '4': 99, '5': 71 },
};

const Capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getIconItems = (t: TFunction<'ui-kit', 'formElements'>) => {
  const iconItemsProps = t('iconItems', { returnObjects: true });

  return ICON_ITEM_NAMES.map<IconItemProps>((name) => {
    const { heading, description } = iconItemsProps[name];

    return { heading, description, name };
  });
};

const getCheckboxItems = <T extends FieldValues>(t: TFunction<'ui-kit', 'formElements'>) =>
  t('checkboxBtnsItems', { returnObjects: true }).map<CheckboxProps<T>>((text, i) => ({
    key: text,
    value: `${i}`,
    text,
  }));

const getRichCheckboxItems = <T extends FieldValues>(t: TFunction<'ui-kit', 'formElements'>) => {
  return t('richCheckboxBtnsItems', { returnObjects: true }).map<CheckboxProps<T>>(
    ({ heading, description }, i) => ({
      key: heading,
      value: `${i}`,
      text: Capitalize(heading),
      description,
      isRich: true,
      isTruncated: false,
    }),
  );
};

const getExpCheckboxItems = <T extends FieldValues>(t: TFunction<'ui-kit', 'formElements'>) =>
  t('expandableCheckboxListItems', { returnObjects: true }).map<CheckboxGroupOption<T>>(
    (text, i) => ({
      key: text,
      value: `${i}`,
      text: Capitalize(text),
    }),
  );

const getBulletListItems = (t: TFunction<'ui-kit', 'formElements'>) =>
  t('bulletListItems', { returnObjects: true }).map<BulletListItem>((text) => ({ id: text, text }));

const RangeSliderPlayground = ({
  control,
  watch,
}: {
  control: Control;
  watch: UseFormWatch<Record<string, string>>;
}) => {
  const from = watch('from');
  const to = watch('to');
  const fixedRangeFrom = watch('fixedRangeFrom');
  const fixedRangeTo = watch('fixedRangeTo');
  const draggableFrom = watch('draggableFrom');
  const draggableTo = watch('draggableTo');
  const disabledFrom = watch('disabledFrom');
  const disabledTo = watch('disabledTo');

  const testConfig = useMemo(
    () => ({
      min: 0,
      max: 100,
      from: 20,
      to: 50,
    }),
    [],
  );

  const fixedRangeConfig = useMemo(
    () => ({
      isRangeFixed: true,
      min: -150,
      from: 0,
      to: 100,
      max: 150,
      step: 10,
    }),
    [],
  );

  return (
    <>
      <Field width="lg" margin="md">
        <div className="form-elements__range-slider">
          <Label text="range slider" appendix={`${from} - ${to}`} />
          <RangeSlider nameFrom="from" nameTo="to" control={control} config={testConfig} />
        </div>
      </Field>
      <Field width="lg" margin="md">
        <div className="form-elements__range-slider">
          <Label text="fixed range slider" appendix={`[${fixedRangeFrom}] - [${fixedRangeTo}]`} />
          <RangeSlider
            nameFrom="fixedRangeFrom"
            nameTo="fixedRangeTo"
            control={control}
            config={fixedRangeConfig}
          />
        </div>
      </Field>
      <Field width="lg" margin="md">
        <div className="form-elements__range-slider">
          <Label text="draggable range slider" appendix={`${draggableFrom} - ${draggableTo}`} />
          <RangeSlider
            nameFrom="draggableFrom"
            nameTo="draggableTo"
            control={control}
            config={testConfig}
            isRangeDraggable
          />
        </div>
      </Field>
      <Field width="lg">
        <div className="form-elements__range-slider">
          <Label text="disabled range slider" appendix={`${disabledFrom} - ${disabledTo}`} />
          <RangeSlider
            nameFrom="disabledFrom"
            nameTo="disabledTo"
            control={control}
            config={testConfig}
            disabled
          />
        </div>
      </Field>
    </>
  );
};

const FormElements = () => {
  const { t } = useTranslation('ui-kit', { keyPrefix: 'formElements' });
  const [page, setPage] = useState(1);
  const [rate, setRate] = useState(2);
  const [likeCount, setLikeCount] = useState(999);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedToo, setIsLikedToo] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { register, handleSubmit, control, watch, reset } = useForm<Record<string, any>>({
    defaultValues: {
      email: '',
      'text-field': 'Это весьма замечательно',
      'masked-field': '',
      guests: { adult: 0, child: 0, baby: 0 },
      dateFrom: null,
      dateTo: new Date(2026, 11, 19),
      dateFilterFrom: new Date(2026, 10, 19),
      dateFilterTo: new Date(2026, 11, 23),
      rules: ['0'],
      gender: 'male',
      subs: true,
      'subs-other': false,
      facilities: {},
      'facilities-two': { bedroom: 2, bed: 2, bathroom: 1 },
      'guests-two': {},
      accessibilities: ['1'],
      amenities: ['1', '3', '4'],
      'amenities-two': ['2'],
      'guests-dirty': { adult: 3, child: 1, baby: 2 },
      from: 0,
      to: 100,
      fixedRangeFrom: -100,
      fixedRangeTo: 0,
      draggableFrom: 10,
      draggableTo: 50,
      disabledFrom: 20,
      disabledTo: 70,
    },
  });

  const paginationCaption = useMemo(() => {
    const itemsPerPage = 12;
    const itemsOnPage = `${1 + (page - 1) * itemsPerPage} - ${page * itemsPerPage}`;

    return t('paginationCaption', { itemsOnPage, totalItems: '100+' });
  }, [page, t]);

  const bulletListItems = useMemo(() => getBulletListItems(t), [t]);
  const iconItemListItems = useMemo(() => getIconItems(t), [t]);
  const expCheckboxItems = useMemo(() => getExpCheckboxItems(t), [t]);
  const expCheckboxItemsSec = useMemo(() => getExpCheckboxItems(t), [t]);
  const checkboxItems = useMemo(() => getCheckboxItems(t), [t]);
  const richCheckboxItems = useMemo(() => getRichCheckboxItems(t), [t]);

  const focusedTextFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedTextFieldRef.current) {
      focusedTextFieldRef.current.focus();
    }
  }, [focusedTextFieldRef]);

  useEffect(() => {
    setLikeCount(998 + (isLiked ? 1 : 0) + (isLikedToo ? 1 : 0));
  }, [isLiked, isLikedToo]);

  const onSubmit = (data: any) => console.log(data);

  const onSubscribe = (payload: Record<string, string>) => {
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      toast.success(`${payload.email} have successfully subscribed!`);
    }, 1000);
  };

  const onRate = (rating: number) => setRate(rating === rate ? 0 : rating);

  return (
    <div className="form-elements">
      <title>{t('title')}</title>
      <header>
        <Link className="form-elements__logo" to={ROUTES.UI_KIT}>
          <Logo size="lg" isSigned={false} isColored={false} />
        </Link>
        <LangSelector />
        <ThemeToggle />
      </header>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-elements__layout">
            <div>
              <Field width="lg" margin="md" zIndex={100}>
                <TextField
                  name="email"
                  register={register}
                  type="email"
                  placeholder={t('textFieldPlaceholder')}
                  labelText={t('textFieldLabel')}
                  labelAppendix={t('textFieldAppendix')}
                />
              </Field>
              <Field width="lg" margin="md" zIndex={95}>
                <TextField
                  name="text-field"
                  register={register}
                  ref={focusedTextFieldRef}
                  labelText={t('textFieldFocusedLabel')}
                  labelAppendix={t('textFieldFocusedAppendix')}
                />
              </Field>
              <Field width="lg" margin="md" zIndex={90}>
                <DropdownGuests
                  name="guests"
                  control={control}
                  labelText={t('dropdownGuestsLabel')}
                />
              </Field>
              <Field width="lg" margin="xl" zIndex={85}>
                <MaskedFieldDate
                  name="masked-field"
                  control={control}
                  labelText={t('maskedTextFieldLabel')}
                />
              </Field>
              <Field width="lg" margin="xl" zIndex={80}>
                <DropdownDate
                  nameFrom="dateFrom"
                  nameTo="dateTo"
                  control={control}
                  labelFrom={t('dropdownDateLabel')}
                  labelTo={t('dropdownDateLabel')}
                />
              </Field>
              <Field width="lg" margin="lg" zIndex={75}>
                <DropdownDateFilter
                  nameFrom="dateFilterFrom"
                  nameTo="dateFilterTo"
                  control={control}
                  label={t('dropdownDateFilterLabel')}
                />
              </Field>
            </div>
            <div>
              <Field width="md" margin="lg">
                <Label text={t('checkboxBtnsLabel')} hasLargeMargin />
                <CheckboxGroup name="rules" options={checkboxItems} register={register} />
              </Field>
              <Field width="md" margin="lg">
                <Label text={t('radioBtnsLabel')} hasLargeMargin />
                <div className="form-elements__radio-buttons">
                  <RadioButton
                    name="gender"
                    value="male"
                    text={t('radioBtnsMale')}
                    register={register}
                    defaultChecked
                  />
                  <RadioButton
                    name="gender"
                    value="female"
                    text={t('radioBtnsFemale')}
                    register={register}
                  />
                </div>
              </Field>
              <Field width="md" margin="xl">
                <Label text={t('toggleLabel')} hasLargeMargin />
                <Field width="md" margin="sm">
                  <Toggle name="subs" text={t('toggleText')} register={register} defaultChecked />
                </Field>
                <Toggle name="subs-other" text={t('toggleText')} register={register} />
              </Field>
              <Field width="md" margin="xl">
                <Label text={t('likesLabel')} hasLargeMargin />
                <LikeButton
                  name="like"
                  count={likeCount}
                  isLiked={isLiked}
                  onChange={() => setIsLiked(!isLiked)}
                />
                <div className="form-elements__plug" />
                <LikeButton
                  name="like-too"
                  isLiked={isLikedToo}
                  count={likeCount}
                  onChange={() => setIsLikedToo(!isLikedToo)}
                />
              </Field>
              <Field width="md">
                <Label text={t('rateBtnLabel')} hasLargeMargin />
                <RateButton onRate={(rate) => onRate(rate)} value={rate} />
                <div className="form-elements__plug" />
                <RateButton value={5} readonly />
              </Field>
            </div>
            <div className="form-elements__buttons">
              <Field width="lg" margin="md">
                <Label text={t('btnsLabel')} hasLargeMargin />
                <Button type="submit" variant="filled" size="short">
                  {t('btnText')}
                </Button>
                <div className="form-elements__plug" />
                <Button variant="filled" size="short" disabled>
                  {t('btnText')}
                </Button>
              </Field>
              <Field width="lg" margin="md">
                <Button variant="outlined" size="short">
                  {t('btnText')}
                </Button>
                <div className="form-elements__plug" />
                <Button variant="outlined" size="short" disabled>
                  {t('btnText')}
                </Button>
              </Field>
              <Field width="lg" margin="md">
                <Button variant="text" size="content">
                  {t('btnText')}
                </Button>
                <div className="form-elements__plug" />
                <Button variant="text" size="content" disabled>
                  {t('btnText')}
                </Button>
              </Field>
              <Field width="lg" margin="xl">
                <Button variant="filled" size="long" hasArrow>
                  {t('btnPayment')}
                </Button>
              </Field>
              <Field width="lg" margin="xl">
                <Label text={t('paginationLabel')} hasLargeMargin />
                <Pagination
                  totalPages={20}
                  page={page}
                  onChange={setPage}
                  caption={paginationCaption}
                />
              </Field>
              <Field width="lg">
                <Label text={t('controlLabel')} hasLargeMargin />
                <Button type="submit" variant="filled" size="short">
                  {t('submit')}
                </Button>
                <div className="form-elements__plug" />
                <Button onClick={() => reset()} variant="filled" size="short">
                  {t('reset')}
                </Button>
              </Field>
            </div>
            <div className="form-elements__dropdown-facilities">
              <Field width="lg" margin="md" zIndex={1}>
                <DropdownFacilities
                  name="facilities"
                  control={control}
                  labelText={t('dropdownFacilitiesLabel')}
                  labelAppendix={t('dropdownFacilitiesAppendix')}
                />
              </Field>
              <Field width="lg" zIndex={0}>
                <DropdownFacilities
                  name="facilities-two"
                  control={control}
                  isExpanded
                  isExpandingDisabled
                  labelText={t('dropdownFacilitiesExpandedLabel')}
                  labelAppendix={t('dropdownFacilitiesExpandedAppendix')}
                />
              </Field>
            </div>
            <div className="form-elements__dropdown-guests-exp">
              <DropdownGuests
                name="guests-two"
                control={control}
                isExpanded
                isExpandingDisabled
                labelText={t('dropdownGuestsLabel')}
              />
            </div>
            <div className="form-elements__rich-checkbox-list">
              <Label text={t('richCheckboxBtnsLabel')} hasLargeMargin>
                <CheckboxGroup
                  name="accessibilities"
                  options={richCheckboxItems}
                  register={register}
                />
              </Label>
            </div>
            <div className="form-elements__exp-checkbox-lists">
              <Field width="lg" margin="md">
                <ExpandableCheckboxGroup
                  legend={t('expandableCheckboxListText')}
                  name="amenities"
                  options={expCheckboxItems}
                  register={register}
                />
              </Field>
              <Field width="lg">
                <ExpandableCheckboxGroup
                  legend={t('expandableCheckboxListText')}
                  name="amenities-two"
                  options={expCheckboxItemsSec}
                  isExpanded
                  register={register}
                />
              </Field>
            </div>
            <div className="form-elements__dropdown-guests-dirty">
              <DropdownGuests
                name="guests-dirty"
                control={control}
                isExpanded
                isExpandingDisabled
                labelText={t('dropdownGuestsLabel')}
              />
            </div>
            <div className="form-elements__bullet-list">
              <Label text={t('bulletList')} hasLargeMargin />
              <BulletList items={bulletListItems} />
            </div>
            <div className="form-elements__icon-list">
              <IconItemList items={iconItemListItems} />
            </div>
            <div className="form-elements__sliders">
              <RangeSliderPlayground control={control} watch={watch} />
            </div>
            <div className="form-elements__charts">
              <Field width="lg">
                <Label text={t('ratingChart')} hasLargeMargin />
                <RatingChartView summary={RATING_SUMMARY} isLoading={false} />
              </Field>
            </div>
            <div className="form-elements__reviews">
              <Review
                review={{
                  id: 'review01',
                  authorName: 'Мурад Сафронов',
                  createdAt: new Date().toISOString(),
                  text: 'Великолепный матрас на кровати в основной спальне! А пуфик вообще потрясающий. И стены, действительно, шумоподавляющие. Выкрикивал комплименты повару — никто не жаловался из соседей.',
                  likeCount: 12,
                  isLiked: true,
                  avatarUrl: '',
                }}
              />
              <Review
                review={{
                  id: 'review02',
                  authorName: 'Сафрон Мурадов',
                  createdAt: '2030-07-01T00:00:00Z',
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                  likeCount: 9925,
                  isLiked: false,
                  avatarUrl: '',
                }}
              />
            </div>
          </div>
        </form>
        <div className="form-elements__subscription">
          <SubscriptionField
            name="email"
            onSubscribe={onSubscribe}
            isDisabled={isSubscribing}
            labelText={t('subscriptionTextField')}
          />
        </div>
      </main>
    </div>
  );
};

export default FormElements;
