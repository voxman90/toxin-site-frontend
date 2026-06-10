import clsx from 'clsx';
import { type ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

import './ImgWithSkeleton.scss';

type ImgWithSkeletonProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
} & Partial<ImgHTMLAttributes<HTMLImageElement>>;

const ImgWithSkeleton = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  ...rest
}: ImgWithSkeletonProps) => {
  const [isDone, setIsDone] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setIsDone(false);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsDone(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setIsDone(true);
    }
  };

  return (
    <div className={clsx('img-with-skeleton', className)}>
      {(!isDone || !src) && <div className="img-with-skeleton__shimmer" />}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={clsx('img-with-skeleton__img', {
          'img-with-skeleton__img--visible': isDone,
        })}
        onLoad={() => setIsDone(true)}
        onError={handleError}
        {...rest}
      />
    </div>
  );
};

export default ImgWithSkeleton;
