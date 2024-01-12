import { useEffect, useState } from "react";
import Login from "../../components/Login/login";
import Logo from "../../assets/Logo.png";
import svg from "../../assets/up.svg";
import "./loginPage.css";
import { useSelector, useDispatch } from "react-redux";
import ForgetPass from "../../components/ForgetPass/forgetPass";
import { useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  viewcustomerpage,
  viewloginpage,
} from "../../store/features/pagevalues";
import UserLogin from "../../components/UserLogin/UserLogin";

const LoginPage = () => {
  const loginpage = useSelector((state: any) => state.pagevalues.login);
  const forgotpass = useSelector((state: any) => state.pagevalues.forgotpass);

  const admindash = useSelector(
    (state: any) => state.persists.persists.value.admindashboard
  );

  const userdash = useSelector(
    (state: any) => state.persists.persists.value.userdashboard
  );

  const customer = useSelector((state: any) => state.pagevalues.customer);
  // const temp = useSelector((state:any) => state.persists.persists.value);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [defaultstyle, setDefaultstyle] = useState({
    current: "admin",
    style: { backgroundColor: "#8375b2", color: "white" },
  });
  useEffect(() => {
    if (getCookie("sessionid") && admindash) {
      nav("/dashboard");
    } else if (getCookie("sessionid") && userdash) {
      nav("/user");
    }
  }, []);

  function handletoggle(val: string) {
    if (val === "admin") {
      setDefaultstyle({ ...defaultstyle, current: "admin" });
      dispatch(
        viewloginpage({
          login: true,
          forgotpass: false,
          register: true,
          customer: false,
        })
      );
    } else {
      setDefaultstyle({ ...defaultstyle, current: "user" });
      dispatch(
        viewcustomerpage({
          login: false,
          forgotpass: false,
          register: false,
          customer: true,
        })
      );
    }
  }

  return (
    <>
      <div
        className="login-section"
        style={{
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <img src={Logo} alt="" className="logo" />

        {/* <ToastContainer /> */}
        <div className="login">
          <div className="vector">
            <img src={svg} alt="" className="login-vector" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {loginpage || customer ? (
              <ToggleButtonGroup exclusive aria-label="Platform">
                <ToggleButton
                  value="web"
                  onClick={() => {
                    handletoggle("admin");
                  }}
                  style={
                    defaultstyle.current === "admin" ? defaultstyle.style : {}
                  }
                >
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Login as Admin
                  </span>
                </ToggleButton>
                <ToggleButton
                  value="android"
                  onClick={() => {
                    handletoggle("user");
                  }}
                  style={
                    defaultstyle.current === "user" ? defaultstyle.style : {}
                  }
                >
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Login as User
                  </span>
                </ToggleButton>
              </ToggleButtonGroup>
            ) : null}

            <div className="prompts">
              {loginpage ? <Login></Login> : <div></div>}
              {forgotpass ? <ForgetPass></ForgetPass> : <div></div>}
              {customer ? <UserLogin></UserLogin> : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
