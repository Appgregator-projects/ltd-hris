import ForgotPassword from "../../views/ForgotPassword"
import Login from "../../views/Login"
import Register from "../../views/Register"

const AuthRoutes = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      name:'login',
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    meta: {
      name:'forgot-password',
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/register',
    element: <Register />,
    meta: {
      name:'register',
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  }
]

export default AuthRoutes