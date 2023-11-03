// ** React Imports
import { Navigate } from "react-router-dom"
import { useContext, Suspense } from "react"

// ** Context Imports
import { AbilityContext } from "@src/utility/context/Can"

// ** Spinner Import
import Spinner from "../spinner/Loading-spinner"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../configs/firebase"
import _axios from "../../../sevices/Api"

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  const ability = useContext(AbilityContext)
  const user = JSON.parse(localStorage.getItem("userData"))

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
  // console.log(ability, "GET LIST ABILITY");

  if (route) {
    let action = null
    let resource = null
    let restrictedRoute = false

    if (route.meta) {
      action = route.meta.action
      resource = route.meta.resource
      restrictedRoute = route.meta.restricted
    }
    if (!user) {
      return <Navigate to="/login" />
    }
    if (user && restrictedRoute) {
      return <Navigate to="/" />
    }
    // if (user && restrictedRoute && user.role === "client") {
    //   return <Navigate to="/access-control" />;
    // }

    if (user && !ability.can(action, resource)) {
      return <Navigate to="/login" replace />
      // return <Navigate to="/misc/not-authorized" replace />;
    }
  }

  return (
    <Suspense fallback={<Spinner className="content-loader" />}>
      {children}
    </Suspense>
  )
}

export default PrivateRoute
