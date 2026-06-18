import Heading from '../Heading/Heading';
import Icon from '../Icon/Icon';

import './IconItem.scss';

export interface IconItemProps {
  name: string;
  heading: string;
  description: string;
}

const IconItem = ({ name, heading, description }: IconItemProps) => {
  return (
    <div className="icon-item">
      <div className="icon-item__icon">
        <Icon name={name} size="lg" />
      </div>
      <div className="icon-item__info">
        <Heading type="h4">{heading}</Heading>
        <p className="icon-item__description">{description}</p>
      </div>
    </div>
  );
};

export default IconItem;
