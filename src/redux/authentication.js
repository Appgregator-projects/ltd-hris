// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialUser = () => {
  const item = 
  // Cookies.get("userData")
  {
    id : Cookies.get("id"),
    name : Cookies.get("name"),
    email : Cookies.get("email"),
    ability : JSON.parse(localStorage.getItem("userData"))?.ability,
    role_id : Cookies.get("role_id"),
    role_name : Cookies.get("role_name"),
    access_token : Cookies.get("access_token"),
    avatar : JSON.parse(localStorage.getItem("userData"))?.avatar
  }
  return item ? item : {};
  // return item ? JSON.parse(item) : {}
};

const initialToken = () => {
  const token = Cookies.get("accessToken");
  return token ? token : null;
};

const initialPermission = () => {
  // const permission = Cookies.get("userPermissions");
  const permit = JSON.parse(localStorage.getItem("userPermissions"))
  return permit ? permit : {};
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
      state.can = {
        ...state.can,
        ...action.payload.permissions[0].role_permissions,
      };
      Cookies.set("userPermissions",JSON.stringify(state.can), { expires: 1});
      localStorage.setItem("userPermissions",JSON.stringify(state.can))

    },
    handleLogin: (state, action) => {
      const params = {
        id: action.payload.profile.token.uid,
        name: action.payload.profile.token.name,
        email: action.payload.token.email,
        ability: action.payload.ability,
        role_id: action.payload.permissions[0].id,
        role_name: action.payload.permissions[0].name,
        access_token: action.payload.access_token,
        avatar: action.payload.profile.token.picture
      };
      console.log(action.payload, "action payload")
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
      Cookies.set("avatar", JSON.stringify(params.avatar), { expires: 1 });
      Cookies.set("access_token", params.access_token, { expires: 1 });
      // Cookies.set("userData", JSON.stringify(params), { expires: 1})
      Cookies.set("accessToken", action.payload.access_token, {
        expires: 1,
      });
      Cookies.set('userPermissions', JSON.stringify(state.can), { expires: 1 })
      localStorage.setItem("userData", JSON.stringify(params));
    },
    handleCompany: (state, action) => {
      state.company = action.payload;
      Cookies.set("company_name", action.payload.name);
      Cookies.set("company_id", action.payload.id);
    },
    handleLogout: (state) => {
      state.userData = null;
      state.token = null;
      // Cookies.remove("userData");
      Cookies.remove("name");
      Cookies.remove("email");
      Cookies.remove("ability");
      Cookies.remove("role_id");
      Cookies.remove("role_name");
      Cookies.remove("role_avatar");
      Cookies.remove("access_token");
      Cookies.remove("accessToken");
      localStorage.removeItem("userData");
    },
  },
});

export const { handleLogin, handleLogout, handlePermission, handleCompany } =
  authSlice.actions;

export default authSlice.reducer;
