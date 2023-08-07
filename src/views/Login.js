// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Input } from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import Api from "../sevices/Api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleLogin, handlePermission } from "@store/authentication";
import themeConfig from "@configs/themeConfig";
import { auth } from "../configs/firebase";
import { handleCompany } from "../redux/authentication";
import ButtonSpinner from "./pages/components/ButtonSpinner";

const Login = () => {
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);

  // const fetchPermission = async() => {
  //   try {
  //     const {data, status} = await api.get('/api/permissions')
  //     if (status) {
  //       dispatch(handlePermission(data))
  //     }
  //   } catch (error) {
  //     throw error
  //   }
  // }

  const fetchCompany = async () => {
    try {
      const data = await Api.get(`/hris/company`);
      const selectedCompany = data[0];
      // console.log(selectedCompany,"selectedCompany")
      return selectedCompany;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  // const fetchMe = (token) => {
  //   return new Promise((resolve, reject) => {
  //     api.get(`/api/me?token=${token}`)
  //       .then(res => resolve(res))
  //       .catch(err => reject(err))
  //   })
  // }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsloading(true);
      const submitLogin = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsloading(false);
      const token = submitLogin.user;
      const checkCompany = await fetchCompany();
      console.log(token.accessToken, "token");

      // const userDetail = await submitLogin.user
      // const {status, data} = await fetchMe(token)
      const accessToken = await token.getIdToken(true);
      token.access_token = accessToken;
      if ((token, checkCompany)) {
        console.log(checkCompany, "checkCompany");
        if (checkCompany) {
          dispatch(handleLogin(token));
          dispatch(handleCompany(checkCompany));
          navigate("/home");
          toast.success("Login succes", {
            position: "top-center",
          });
        }
      } else {
        toast.error(`Error : ${data}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      setIsloading(false);
      const errorMessage = error.message.replace("Firebase:", "");
      toast.error(`Error : ${errorMessage}`, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img
            src={themeConfig.app.appLogoImage}
            alt="logo"
            style={{ maxWidth: "40px" }}
          />
          <h2 className="brand-text text-primary ms-1">LifeTime Design</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Welcome to LifeTme Design! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText>
            <Form className="auth-login-form mt-2" onSubmit={onSubmit}>
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="login-email"
                  placeholder="john@example.com"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="login-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
              <ButtonSpinner
                isLoading={isLoading}
                color="primary"
                block={true}
                type="submit"
                label="Login"
              />
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
