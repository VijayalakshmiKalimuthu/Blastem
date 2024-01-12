import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import appService, { ServerResponse } from "../../api/endpoints";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { viewloginpage, viewforgotpass } from "../../store/features/pagevalues";
import { updateadmin } from "../../store/features/dashboard";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Backdrop, CircularProgress } from "@mui/material";
import { viewadmindashboard } from "../../store/features/persists";

const Login = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  // const dash = useSelector((state) => state.dashboard.dashboardview);
  useEffect(() => {
    dispatch(
      viewloginpage({
        login: true,
        forgotpass: false,
        register: true,
        customer: false,
      })
    );
  }, []);
  const [loginForm, setLoginForm] = useState({
    credential: "",
    password: "",
  });

  const [passwordToggle, setPasswordToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e: any, type: string) => {
    if (type === "credential") {
      setLoginForm({
        ...loginForm,
        credential: e.target.value,
      });
    } else {
      setLoginForm({
        ...loginForm,
        password: e.target.value,
      });
    }
  };

  const proceedLogin = async () => {
    if (loginForm.credential === "" || loginForm.password === "") {
      toast.warning("Please Fill out all the field!!");
    } else {
      setIsLoading(true);
      const loginResponse: ServerResponse = await appService.loginAsAdmin(
        loginForm.credential,
        loginForm.password
      );
      if (loginResponse.success) {
        // ADD THIS TO STORE

        toast.success(loginResponse.message);

        dispatch(
          viewadmindashboard({
            admindashboard: true,
            username: loginResponse.username,
          })
        );
        dispatch(
          updateadmin({
            usernameoremailid: loginForm.credential,
            
          })
        );
        setIsLoading(false);
        nav("/dashboard");
      } else {
        setIsLoading(false);
        toast.error(loginResponse.message);
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <h2 className="login-h2">LOGIN</h2>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          proceedLogin();
        }}
      >
        <div className="form-card">
          <div className="form-field">
            <label htmlFor="" className="login-label">
              Username or Email ID
            </label>

            <div className="input-box">
              <input
                type="text"
                className="login-input"
                placeholder="Enter your Username or Email Id"
                onChange={(e) => {
                  handleFormChange(e, "credential");
                }}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="" className="login-label">
              Password
            </label>
            <div className="input-box">
              <input
                type={passwordToggle ? "text" : "password"}
                className="login-input"
                placeholder="Enter your Password"
                onChange={(e) => {
                  handleFormChange(e, "password");
                }}
              />
              <span
                onClick={() => {
                  setPasswordToggle(!passwordToggle);
                }}
                className="input-box-icon"
                style={{ cursor: "pointer" }}
              >
                {passwordToggle ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
          </div>
        </div>
        <button className="login-button">Login</button>
        <div className="links">
          <p
            onClick={() => {
              dispatch(
                viewforgotpass({
                  login: false,
                  forgotpass: true,
                  register: true,
                })
              );
            }}
          >
            Forgot Password?
          </p>
          <p
            onClick={() => {
              nav("/register");
            }}
          >
            New User? Sign Up
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
