import { memo } from 'react';

import IconItem from '../IconItem/IconItem';
import type { IconItemProps } from '../IconItem/IconItem';

import './IconItemList.scss';

interface IconItemListProps {
  items: IconItemProps[];
}

const IconItemList = ({ items }: IconItemListProps) => {
  return (
    <ul className="icon-item-list">
      {items.map((itemProps, i, arr) => (
        <li key={itemProps.name} className="icon-item-list__item">
          <IconItem {...itemProps} />
          {i !== arr.length - 1 && <div className="icon-item-list__hr" />}
        </li>
      ))}
    </ul>
  );
};

export default memo(IconItemList);
