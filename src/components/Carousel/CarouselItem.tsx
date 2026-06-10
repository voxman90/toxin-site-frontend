import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

export type CarouselItemProps = {
  isActive?: boolean;
  isSliding?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

const CarouselItem = ({
  children,
  isActive = false,
  isSliding = false,
  ...rest
}: PropsWithChildren<CarouselItemProps>) => {
  return (
    <div
      className={clsx('carousel__item', {
        'carousel__item--active': isActive,
        'carousel__item--sliding': isSliding,
      })}
      {...rest}
    >
      {children}
    </div>
  );
};

export default CarouselItem;
