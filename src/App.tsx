import { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { initialize } from './actions/auth.actions';
import AppErrorBoundary from './components/AppErrorBoundary/AppErrorBoundary';
import { AppToast } from './components/AppToast/AppToast';
import { BookingErrorFallback } from './components/BookingErrorFallback/BookingErrorFallback';
import ErrorBoundaryLayout from './components/ErrorBoundaryLayout/ErrorBoundaryLayout';
import MainLayout from './components/MainLayout/MainLayout';
import { useAppDispatch } from './hooks';
import BookingSuccess from './pages/booking-success/BookingSuccess';
import Booking from './pages/booking/Booking';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Search from './pages/search/Search';
import UiKit from './pages/ui-kit/UiKit';
import Cards from './pages/ui-kit/cards/Cards';
import ColorsAndTypes from './pages/ui-kit/colors-and-types/ColorsAndTypes';
import FormElements from './pages/ui-kit/form-elements/FormElements';
import HeadersAndFooters from './pages/ui-kit/headers-and-footers/HeadersAndFooters';
import { ROUTES } from './routes';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.UI_KIT} element={<Outlet />}>
          <Route index={true} element={<UiKit />} />
          <Route path={ROUTES.COLORS_AND_TYPES} element={<ColorsAndTypes />} />
          <Route path={ROUTES.HEADERS_AND_FOOTERS} element={<HeadersAndFooters />} />
          <Route path={ROUTES.CARDS} element={<Cards />} />
          <Route path={ROUTES.FORM_ELEMENTS} element={<FormElements />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route element={<ErrorBoundaryLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.SEARCH} element={<Search />} />
          </Route>
          <Route
            path={ROUTES.BOOKING_PATTERN}
            element={
              <AppErrorBoundary FallbackComponent={BookingErrorFallback}>
                <Booking />
              </AppErrorBoundary>
            }
          />
        </Route>
        <Route path={ROUTES.BOOKING_SUCCESS} element={<BookingSuccess />} />
      </Routes>
      <AppToast />
    </BrowserRouter>
  );
}

export default App;
