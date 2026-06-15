import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { createRoomMock } from '../../../__tests__/fixtures/fixtures';
import BookingCard from '../../../components/BookingCard/BookingCard';
import Carousel from '../../../components/Carousel';
import CarouselItem from '../../../components/Carousel/CarouselItem';
import LangSelector from '../../../components/LangSelector/LangSelector';
import LoginCard from '../../../components/LoginCard/LoginCard';
import Logo from '../../../components/Logo/Logo';
import RegisterCard from '../../../components/RegisterCard/RegisterCard';
import RoomBasicSearchCard from '../../../components/RoomBasicSearchCard/RoomBasicSearchCard';
import RoomCard from '../../../components/RoomCard/RoomCard';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import { ROUTES } from '../../../routes';

import './Cards.scss';

const Cards = () => {
  const { t } = useTranslation('ui-kit', { keyPrefix: 'cards' });

  return (
    <div className="cards">
      <title>{t('title')}</title>
      <header>
        <Link className="cards__logo" to={ROUTES.UI_KIT}>
          <Logo size="sm" />
        </Link>
        <LangSelector />
        <ThemeToggle />
      </header>
      <div className="cards__wrapper">
        <div className="cards__container">
          <div className="cards__column">
            <RoomBasicSearchCard />
            <LoginCard />
          </div>
          <div className="cards__column">
            <BookingCard
              room={createRoomMock({ id: '94303453523453ad234' })}
              roomId="94303453523453ad234"
              isRoomLoading={false}
            />
            <RegisterCard />
          </div>
          <div className="cards__column">
            <RoomCard
              id="888"
              roomNumber={888}
              isLuxe
              reviewsCount={145}
              price={9990}
              images={['fake-img-src', 'fake-img-sec-src']}
              avgRating={5}
              onClick={() => {}}
            />
            <RoomCard
              id="840"
              roomNumber={840}
              reviewsCount={65}
              price={9900}
              images={['fake-img-src', 'fake-img-sec-src']}
              avgRating={4}
              onClick={() => {}}
            />
            <div className="cards__carousel">
              <Carousel isFocusable hasControlButtons hasNavPanel>
                {[1, 2, 3].map((i) => (
                  <CarouselItem key={i}>
                    <div className="cards__carousel-item" data-id={i} />
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
            <div className="cards__carousel">
              <Carousel isFocusable hasControlButtons hasNavPanel>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <CarouselItem key={i}>
                    <div className="cards__carousel-item" data-id={i % 4} />
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
