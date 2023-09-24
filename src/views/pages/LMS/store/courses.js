// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const coursesSlice = createSlice({
	name: "courses",
	initialState: {
		image: [],
	},
	reducers: {
		getImage(state, action) {
			state.image = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

export const { getImage } = coursesSlice.actions;
export default coursesSlice.reducer;
