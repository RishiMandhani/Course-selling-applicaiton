import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../app/api";

const storedAuth = JSON.parse(localStorage.getItem("coursehub-auth") || "null");

export const registerUser = createAsyncThunk("auth/register", async (payload) =>
  apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) })
);

export const loginUser = createAsyncThunk("auth/login", async (payload) =>
  apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) })
);

export const fetchProfile = createAsyncThunk("auth/profile", async (_, { getState }) => {
  const token = getState().auth.token;
  return apiRequest("/auth/me", {}, token);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth?.user || null,
    token: storedAuth?.token || null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("coursehub-auth");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("coursehub-auth", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("coursehub-auth", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("coursehub-auth", JSON.stringify({ user: action.payload, token: state.token }));
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
