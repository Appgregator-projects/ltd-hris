// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const coursesSlice = createSlice({
	name: "courses",
	initialState: {
		image: [],
		course: [],
		sections: [],
		lessons: [],
		lessonPerCourse: [],
	},
	reducers: {
		getImage(state, action) {
			state.image = action.payload;
		},
		getCourse(state, action) {
			state.course = action.payload;
		},
		getSections(state, action) {
			state.sections = action.payload;
		},
		getLessons(state, action) {
			state.lessons = action.payload;
		},
		getAllLessonPerCourse(state, action) {
			state.lessonPerCourse = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

export const {
	getImage,
	getCourse,
	getSections,
	getLessons,
	getAllLessonPerCourse,
} = coursesSlice.actions;
export default coursesSlice.reducer;
