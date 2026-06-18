import clsx from 'clsx';
import React from 'react';

import './Icon.scss';

export type FantasyFont = 'awesome' | 'material';

export type IconSize = 'sm' | 'lg' | 'xl';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  font?: FantasyFont;
  size?: IconSize;
  className?: string;
  as?: React.ElementType;
}

const Icon = ({
  name,
  as: Tag = 'i',
  font = 'material',
  size = 'sm',
  className,
  ...props
}: IconProps) => {
  const isAwesome = font === 'awesome';

  return (
    <Tag
      {...props}
      className={clsx(
        'icon',
        `icon--font-${font}`,
        `icon--size-${size}`,
        'u-non-selectable',
        className,
      )}
      {...(isAwesome ? { 'data-icon-name': name } : {})}
    >
      {!isAwesome && name}
    </Tag>
  );
};

export default Icon;
