import type { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import './LikeButton.scss';

type LikeButtonProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  count: number;
  isLiked?: boolean;
} & React.ComponentPropsWithoutRef<'input'>;

const getFormattedCount = (count: number) => {
  if (count < 1000) {
    return count;
  }

  if (count < 10000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return `${Math.floor(count / 1000)}K`;
};

const LikeButton = ({ count, onChange, isLiked = false, ...props }: LikeButtonProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'likeButton' });

  return (
    <label className="like-button">
      <input
        {...props}
        type="checkbox"
        checked={isLiked}
        onChange={onChange}
        className="like-button__input"
        aria-label={t('label')}
        aria-checked={isLiked}
      />
      <div className="like-button__counter" aria-hidden="true">
        {getFormattedCount(count)}
      </div>
      <span className="u-visually-hidden">{t('likes', { count })}</span>
    </label>
  );
};

export default LikeButton;
