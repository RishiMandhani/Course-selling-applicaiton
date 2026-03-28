import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../app/api";
import { getDemoCourseById, getDemoCourses, isDemoEnrolled, mergeCourses } from "./demoCourses";

export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
  try {
    const data = await apiRequest("/courses");
    return data.length ? mergeCourses(data) : getDemoCourses();
  } catch {
    return getDemoCourses();
  }
});

export const fetchCourseById = createAsyncThunk("courses/fetchById", async (id) => {
  try {
    return await apiRequest(`/courses/${id}`);
  } catch {
    return getDemoCourseById(id);
  }
});

export const fetchOwnedCourseContent = createAsyncThunk("courses/fetchOwnedContent", async (id, { getState }) => {
  const token = getState().auth.token;

  try {
    return await apiRequest(`/courses/${id}/content`, {}, token);
  } catch {
    const demoCourse = getDemoCourseById(id);

    if (demoCourse && isDemoEnrolled(demoCourse._id)) {
      return demoCourse;
    }

    throw new Error("Course access unavailable");
  }
});
export const fetchAdminCourses = createAsyncThunk("courses/fetchAdminCourses", async (_, { getState }) => {
  const token = getState().auth.token;
  try {
    const data = await apiRequest("/courses/admin/all", {}, token);
    return mergeCourses(data);
  } catch {
    return getDemoCourses();
  }
});

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    list: getDemoCourses(),
    selected: null,
    owned: null,
    adminList: getDemoCourses(),
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.selected = action.payload || getDemoCourses()[0] || null;
      })
      .addCase(fetchOwnedCourseContent.fulfilled, (state, action) => {
        state.owned = action.payload;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.adminList = action.payload;
      });
  }
});

export default courseSlice.reducer;
