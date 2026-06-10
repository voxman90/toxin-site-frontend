import { createSlice } from '@reduxjs/toolkit';

import type { KnownError } from '../@types/api/errors.api';
import type { IRoom } from '../@types/data';
import { fetchRooms } from '../actions/searchActions';
import { UnknownError } from '../constants/constants';

export interface SearchState {
  rooms: IRoom[];
  pagination: {
    roomsPerPage: number;
    totalPages: number;
    totalRooms: number;
  };
  isLoading: boolean;
  error: KnownError | null;
}

const initialState: SearchState = {
  rooms: [],
  pagination: {
    totalPages: 0,
    roomsPerPage: 0,
    totalRooms: 0,
  },
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload.docs;
        state.pagination = {
          totalPages: action.payload.totalPages,
          roomsPerPage: action.payload.limit,
          totalRooms: action.payload.totalDocs,
        };
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error = action.payload ?? UnknownError;
      });
  },
});

export const { clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
