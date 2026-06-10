import { configureStore } from '@reduxjs/toolkit';

import auth from './auth.ts';
import booking from './booking.ts';
import roomDetails from './roomDetails.ts';
import search from './search.ts';

const store = configureStore({
  reducer: {
    auth,
    search,
    booking,
    roomDetails,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
