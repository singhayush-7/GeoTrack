import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api';

export const fetchMyHistory = createAsyncThunk('locations/fetchMyHistory', async ({ token, limit = 200 }) => {
  const data = await apiFetch(`/api/locations/me/history?limit=${limit}`, { token });
  return data;  
});

export const fetchUserHistory = createAsyncThunk('locations/fetchUserHistory', async ({ userId, limit = 200 }) => {
  const data = await apiFetch(`/api/locations/${userId}/history?limit=${limit}`);
  return { userId, data };
});

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    live: {},       
    history: [],     
    status: 'idle',
    error: null
  },
  reducers: {
    upsertLive(state, action) {
      const { userId, name, latitude, longitude, timestamp } = action.payload;
      state.live[userId] = { latitude, longitude, name,updatedAt: timestamp || Date.now() };
    },
    removeLive(state, action) {
      const userId = action.payload;
      delete state.live[userId];
    },
    clearHistory(state) { state.history = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyHistory.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchMyHistory.fulfilled, (s, a) => { s.status = 'succeeded'; s.history = a.payload; })
      .addCase(fetchMyHistory.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })
      .addCase(fetchUserHistory.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchUserHistory.fulfilled, (s, a) => { s.status = 'succeeded'; s.history = a.payload.data; })
      .addCase(fetchUserHistory.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  }
});

export const { upsertLive, removeLive, clearHistory } = locationSlice.actions;
export default locationSlice.reducer;
