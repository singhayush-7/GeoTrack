import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api';

const tokenKey = 'rt_token';
const userKey = 'rt_user';

export const login = createAsyncThunk('user/login', async ({ email, password }) => {
  const data = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
  return data; 
});

export const register = createAsyncThunk('user/register', async ({ name, email, password }) => {
  const data = await apiFetch('/api/auth/register', { method: 'POST', body: { name, email, password } });
  return data;  
});

const initialState = (() => {
  const token = localStorage.getItem(tokenKey);
  const user = localStorage.getItem(userKey);
  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
    status: 'idle',
    error: null
  };
})();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem(userKey, JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem(tokenKey, a.payload.token);
        localStorage.setItem(userKey, JSON.stringify(a.payload.user));
      })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })
      .addCase(register.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem(tokenKey, a.payload.token);
        localStorage.setItem(userKey, JSON.stringify(a.payload.user));
      })
      .addCase(register.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  }
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
