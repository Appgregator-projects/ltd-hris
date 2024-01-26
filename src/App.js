import React, { Suspense } from "react";

// ** Router Import
import Router from "./router/Router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./configs/firebase";
import _axios from "./sevices/Api";
import { useDispatch } from "react-redux";
import { handleCompany } from "./redux/authentication";
import { useEffect } from "react";
import { useState } from "react";

const App = () => {
  // const user = JSON.parse(localStorage.getItem("userData"));
  // const dispatch = useDispatch()
  // const [company, setCompany] = useState([])
  // // console.log(user,"user")

  // useEffect(() => {
  //   // getData()
  //   onAuthStateChanged(auth, async (userChange) => {
  //     if (userChange) {

  //       user.access_token = userChange.accessToken;

  //       localStorage.setItem("userData", JSON.stringify(user));

  //       const { status, data } = await _axios.get(`/hris/company`);
  //       if (status) {

  //         const selectedCompany = data[0];
  //         // console.log('thrid')
  //         setCompany(data)


  //         // User is signed in, see docs for a list of available properties
  //         // https://firebase.google.com/docs/reference/js/auth.user
  //         _axios.defaults.headers.common[
  //           "Authorization"
  //         ] = `Bearer ${user.access_token}`;
  //         if (company.length == 0) {
  //           await dispatch(handleCompany(selectedCompany));
  //         }

  //       }
  //       // return selectedCompany;
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   })

  // }, [])

  // useEffect(() => {
  // }, [company.length])
  // console.log(ability, "GET LIST ABILITY");

  const user = auth.currentUser;

  if (user) {
    user.getIdTokenResult()
      .then((idTokenResult) => {
        // Dapatkan timestamp kedaluwarsa dari token
        const expirationTime = idTokenResult.expirationTime;

        // Dapatkan timestamp sekarang
        const currentTime = new Date().getTime() / 1000;

        // Bandingkan dengan waktu sekarang
        if (expirationTime < currentTime) {
          console.log('Token sudah kedaluwarsa');
        } else {
          console.log('Token masih valid');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('Tidak ada pengguna yang masuk');
  }

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
