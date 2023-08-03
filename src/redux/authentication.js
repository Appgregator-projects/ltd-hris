// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialUser = () => {
  const item = Cookies.get("userData");
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {};
};

const initialToken = () => {
  const token = Cookies.get("accessToken");
  return token ? token : null;
};

const initialPermission = () => {
  const permission = Cookies.get("userPermissions");
  return permission ? JSON.parse(permission) : {};
};

const intialCompany = () => {
  const company_id = Cookies.get("company_id");
  const company_name = Cookies.get("company_name");
  const company = { id: company_id, name: company_name };
  return company;
  // return console.log(company_id,"company_id")
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: initialUser(),
    token: initialToken(),
    can: initialPermission(),
    company: intialCompany(),
  },
  reducers: {
    handlePermission: (state, action) => {
      state.can = action.payload;
      Cookies.set("userPermissions", JSON.stringify(action.payload), {
        expires: 1,
      });
    },
    handleLogin: (state, action) => {
      const params = {
        // id:action.payload.id,
        name: action.payload.displayName,
        email: action.payload.email,
        // role:action.payload.role,
        // company_default_id:action.payload.company_default_id,
        // company_default_name:action.payload.company_default_name,
      };
      state.userData = params;
      state.accessToken = action.payload.access_token;
      state.can = { ...state.can, ...action.payload.permission };
      Cookies.set("userData", JSON.stringify(params), { expires: 1 });
      Cookies.set("accessToken", action.payload.access_token, {
        expires: 1,
      });
    },
    handleCompany: (state, action) => {
      console.log(action.payload, "handleCompany");
      state.company = action.payload;
      Cookies.set("company_name", action.payload.name);
      Cookies.set("company_id", action.payload.id);
    },
    handleLogout: (state) => {
      state.userData = null;
      state.token = null;
      Cookies.remove("userData");
      Cookies.remove("accessToken");
    },
  },
});

export const { handleLogin, handleLogout, handlePermission, handleCompany } =
  authSlice.actions;

export default authSlice.reducer;
