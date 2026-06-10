import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import defaultAvatar from '../../assets/img/default_avatar.png';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useExpandable } from '../../hooks/useExpandable';
import { ROUTES } from '../../routes';
import { logout } from '../../slices/auth';
import Button from '../Button/';
import Icon from '../Icon/Icon';
import ImgWithSkeleton from '../ImgWithSkeleton/ImgWithSkeleton';
import Link from '../Link/Link';

import './Userbar.scss';

const Userbar = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation('components', { keyPrefix: 'auth' });
  const { isExpanded, ref, setIsExpanded } = useExpandable<HTMLDivElement>(false);
  const navigate = useNavigate();

  const name = `${user?.firstName} ${user?.lastName}`;

  const handleLogout = () => {
    dispatch(logout());
    setIsExpanded(false);
  };

  return (
    <section className="userbar" ref={ref}>
      {isLoggedIn ? (
        <div className="userbar__profile">
          <button
            type="button"
            className="userbar__avatar-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-haspopup="true"
            aria-label={t('profileMenu')}
          >
            <div className="userbar__avatar-frame">
              <ImgWithSkeleton
                src={user?.avatarUrl || defaultAvatar}
                fallbackSrc={defaultAvatar}
                alt={name}
                loading="lazy"
              />
            </div>
          </button>
          <ul className={clsx('userbar__menu', { 'userbar__menu--expanded': isExpanded })}>
            <li className="userbar__menu-item">
              {`${t('user')}:`}
              <br />
              <span className="userbar__user-name">{name}</span>
            </li>
            <li className="userbar__menu-item">
              <Link href="#" text={t('profile')} className="userbar__menu-link" />
            </li>
            <li className="userbar__menu-item">
              <button
                type="button"
                onClick={handleLogout}
                aria-label={t('logout')}
                className="userbar__icon-btn userbar__icon-btn--menu"
              >
                <Icon name="exit_to_app" />
                <span className="userbar__icon-btn-text">{t('logout')}</span>
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="userbar__guest">
          <div className="userbar__auth-btns">
            <div className={clsx('userbar__btn', 'userbar__btn--login')}>
              <Button onClick={() => navigate(ROUTES.LOGIN)} variant="outlined" size="stretchy">
                {t('login')}
              </Button>
            </div>
            <div className={clsx('userbar__btn', 'userbar__btn--register')}>
              <Button
                onClick={() => navigate(ROUTES.REGISTER)}
                variant="filled"
                size="stretchy"
                hasPadding
              >
                {t('register')}
              </Button>
            </div>
          </div>
          <div className="userbar__auth-icons">
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              aria-label={t('login')}
              className="userbar__icon-btn"
            >
              <Icon name="lock_open" />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.REGISTER)}
              aria-label={t('register')}
              className="userbar__icon-btn"
            >
              <Icon name="person_add" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Userbar;
