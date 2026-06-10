import clsx from 'clsx';
import type { ElementType, ReactNode } from 'react';

import './CardFrame.scss';

interface CardFrameProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

const CardFrame = ({ children, className, as: Tag = 'div' }: CardFrameProps) => {
  return <Tag className={clsx('card-frame', className)}>{children}</Tag>;
};

export default CardFrame;
