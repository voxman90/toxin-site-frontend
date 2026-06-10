import { Outlet } from 'react-router-dom';

import Favicon from '../Favicon/Favicon';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

import './MainLayout.scss';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Favicon />
      <div className="main-layout__wrapper">
        <div className="main-layout__header">
          <Header />
        </div>
        <div className="main-layout__main">
          <Outlet />
        </div>
        <div className="main-layout__footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
