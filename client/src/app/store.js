import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import coursesReducer from "../features/courses/courseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer
  }
});
