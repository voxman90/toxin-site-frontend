import clsx from 'clsx';

import './BulletList.scss';

export interface BulletListItem {
  id: string;
  text: string;
}

interface BulletListProps {
  items?: BulletListItem[];
  isAlignWithText?: boolean;
}

const BulletList = ({ items, isAlignWithText = false }: BulletListProps) => {
  if (!items) return;

  return (
    <ul className={clsx('bullet-list', { 'bullet-list--align-with-text': isAlignWithText })}>
      {items.map(({ id, text }) => (
        <li key={id} className="bullet-list__item">
          <div className="bullet-list__marker" />
          <span className="bullet-list__text">{text}</span>
        </li>
      ))}
    </ul>
  );
};

export default BulletList;
