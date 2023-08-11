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
      state.can = action;
      Cookies.set(
        "userPermissions",
        JSON.stringify(action.payload.permissions),
        {
          expires: 1,
        }
      );
    },
    handleLogin: (state, action) => {
      const params = {
        id: action.payload.profile.token.uid,
        name: action.payload.profile.token.name,
        email: action.payload.email,
        ability: action.payload.ability,
        role_id: action.payload.permissions[0].id,
        role_name: action.payload.permissions[0].name,
        access_token: action.payload.access_token,

        // company_default_id:action.payload.company_default_id,
        // company_default_name:action.payload.company_default_name,
      };
      state.userData = params;
      state.accessToken = action.payload.access_token;
      state.can = {
        ...state.can,
        ...action.payload.permissions[0].role_permissions,
      };
      Cookies.set("userData", JSON.stringify(params), { expires: 1 });
      Cookies.set("accessToken", action.payload.access_token, {
        expires: 1,
      });
      localStorage.setItem("userData", JSON.stringify(params));
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
      localStorage.removeItem("userData");
    },
  },
});

export const { handleLogin, handleLogout, handlePermission, handleCompany } =
  authSlice.actions;

export default authSlice.reducer;
