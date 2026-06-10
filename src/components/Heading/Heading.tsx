import clsx from 'clsx';

import './Heading.scss';

type HTMLHeadingType = 'h1' | 'h2' | 'h3' | 'h4';

type HeadingType = 'h4' | 'label' | 'h2' | 'h1';

type HeadingProps = {
  type: HeadingType;
  className?: string;
} & React.ComponentPropsWithoutRef<HTMLHeadingType>;

const TAG_MAP: Record<HeadingType, HTMLHeadingType> = {
  h4: 'h4',
  label: 'h3',
  h2: 'h2',
  h1: 'h1',
};

const Heading = ({ type, className, children, ...props }: HeadingProps) => {
  const Tag = TAG_MAP[type];

  return (
    <Tag {...props} className={clsx('heading', `heading--type-${type}`, className)}>
      {children}
    </Tag>
  );
};

export default Heading;
