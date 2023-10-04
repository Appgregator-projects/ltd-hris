// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialUser = () => {
  const item = 
  {
      id : Cookies.get("id"),
      name : Cookies.get("name"),
      email : Cookies.get("email"),
      ability : JSON.parse(localStorage.getItem("userData"))?.ability,
      role_id : Cookies.get("role_id"),
      role_name : Cookies.get("role_name"),
      access_token : Cookies.get("access_token")
    }
  return item ? item : {};
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
      console.log(action, "action payload")
      const params = {
        id: action.payload.profile.token.uid,
        name: action.payload.profile.token.name,
        email: action.payload.token.email,
        ability: action.payload.ability,
        role_id: action.payload.permissions[0].id,
        role_name: action.payload.permissions[0].name,
        access_token: action.payload.access_token
      };
      state.userData = params;
      state.accessToken = action.payload.access_token;
      state.can = {
        ...state.can,
        ...action.payload.permissions[0].role_permissions,
      };
      Cookies.set("id", params.id, { expires: 1 });
      Cookies.set("name", params.name, { expires: 1 });
      Cookies.set("email", params.email, { expires: 1 });
      Cookies.set("ability", JSON.stringify(params.ability), { expires: 1 });
      Cookies.set("role_id", params.role_id, { expires: 1 });
      Cookies.set("role_name", params.role_name, { expires: 1 });
      Cookies.set("access_token", params.access_token, { expires: 1 });
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
