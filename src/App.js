import React, { Suspense } from "react";

// ** Router Import
import Router from "./router/Router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./configs/firebase";
import _axios from "./sevices/Api";

const App = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  console.log(user,"user")

  onAuthStateChanged(auth, (userChange) => {
    if (userChange) {
      localStorage.removeItem("userData");
      user.access_token = userChange.accessToken;
      localStorage.setItem("userData", JSON.stringify(user));

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      _axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.access_token}`;
    } else {
      // User is signed out
      // ...
    }
  })

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
