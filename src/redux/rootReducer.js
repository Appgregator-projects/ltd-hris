// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import authentication from "./authentication";
import coursesSlice from "../views/pages/LMS/store/courses";


const rootReducer = { navbar, layout, authentication, coursesSlice };

export default rootReducer;
