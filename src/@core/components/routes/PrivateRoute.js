// ** React Imports
import { Navigate } from "react-router-dom"
import { useContext, Suspense, useEffect, useState } from "react"

// ** Context Imports
import { AbilityContext } from "@src/utility/context/Can"

// ** Spinner Import
import Spinner from "../spinner/Loading-spinner"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../configs/firebase"
import _axios from "../../../sevices/Api"
import { useDispatch } from "react-redux"
import { handleCompany } from "../../../redux/authentication"
// import Api from '../../../../src/apis/services/Services';

// import { handleCompany } from "../redux/authentication";

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  const [company, setCompany] = useState([])

  const ability = useContext(AbilityContext)
  const user = JSON.parse(localStorage.getItem("userData"))
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      // localStorage.removeItem("userData");

      onAuthStateChanged(auth, async (userChange) => {
        if (userChange) {
          // console.log('second')

          // console.log(userChange, 'ini userChange')
          user.access_token = userChange.accessToken;

          localStorage.setItem("userData", JSON.stringify(user));
          const { status, data } = await _axios.get(`/hris/company`);
          if (status) {

            const selectedCompany = data[0];
            setCompany(data)
            console.log(data, "data company")

            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            _axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${user.access_token}`;
            if (company.length === 0) {
              await dispatch(handleCompany(selectedCompany));
            }
            // console.log('forth')
          }
          // return selectedCompany;
        } else {
          // User is signed out
          // ...
        }
      })


    } catch (error) {
      throw error;
    }
  }

  // console.log(company)

  useEffect(() => {
    // getData()
    onAuthStateChanged(auth, async (userChange) => {
      if (userChange) {

        user.access_token = userChange.accessToken;

        localStorage.setItem("userData", JSON.stringify(user));

        const { status, data } = await _axios.get(`/hris/company`);
        if (status) {

          const selectedCompany = data[0];
          // console.log('thrid')
          setCompany(data)


          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          _axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${user.access_token}`;
          if (company.length == 0) {
            await dispatch(handleCompany(selectedCompany));
          }

        }
        // return selectedCompany;
      } else {
        // User is signed out
        // ...
      }
    })

  }, [])

  useEffect(() => {
  }, [company.length])
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
      // return <Navigate to="/login" replace />
      return <Navigate to="/misc/not-authorized" replace />;
    }
  }

  return (
    <Suspense fallback={<Spinner className="content-loader" />}>
      {children}
    </Suspense>
  )
}

export default PrivateRoute
