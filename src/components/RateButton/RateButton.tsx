import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import './RateButton.scss';

type RateButtonProps = {
  onRate?: (val: number) => void;
  value?: number;
  readonly?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

const STARS = [1, 2, 3, 4, 5];
const NOOP = () => {};

const RateButton = ({ onRate = NOOP, value = 0, readonly = false, ...props }: RateButtonProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'rateButton' });
  const name = useId();

  return (
    <div {...props} className="rate-button" role="radiogroup">
      {STARS.map((starValue) => (
        <input
          key={starValue}
          type="radio"
          name={name}
          value={starValue}
          className="rate-button__star"
          onChange={() => onRate(starValue)}
          checked={value === starValue}
          disabled={readonly}
          aria-label={t('rate', { count: starValue })}
        />
      ))}
    </div>
  );
};

export default RateButton;
