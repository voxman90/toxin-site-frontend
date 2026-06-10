import clsx from 'clsx';
import type { AnchorHTMLAttributes } from 'react';

import './Link.scss';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  text: string;
};

const Link = ({ href, text, target = '_self', className, ...props }: LinkProps) => {
  return (
    <a
      {...props}
      className={clsx('link', className)}
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
      <span className="link__text" data-text={text}>
        {text}
      </span>
    </a>
  );
};

export default Link;
