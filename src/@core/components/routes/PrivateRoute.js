// ** React Imports
import { Navigate } from "react-router-dom";
import { Suspense, useState } from "react";

// ** Context Imports
// import { AbilityContext } from "@src/utility/context/Can"

// ** Spinner Import
import Cookies from "js-cookie";
import ComponentSpinner from "../spinner/Loading-spinner";
// import { auth } from "../../configs/firebase"
// import { signInWithEmailAndPassword } from "firebase/auth"

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  // const ability = useContext(AbilityContext)
  const user = Cookies.get("userData");

  if (route) {
    // let action = null
    // let resource = null
    let restrictedRoute = false;

    if (route.meta) {
      // action = route.meta.action
      // resource = route.meta.resource
      restrictedRoute = route.meta.restricted;
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user && restrictedRoute) {
      return <Navigate to="/" />;
    }
    if (user && restrictedRoute && user.role === "client") {
      return <Navigate to="/access-control" />;
    }
    // if (user && !ability.can(action || "read", resource)) {
    //   return <Navigate to="/misc/not-authorized" replace />
    // }
  }

  return (
    <Suspense fallback={<ComponentSpinner className="content-loader" />}>
      {children}
    </Suspense>
  );
};

export default PrivateRoute;
