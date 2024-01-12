import { useEffect } from "react";
import Logo from "../../assets/Logo.png";
import svg from "../../assets/up.svg";
import Register from "../../components/Register/register";
import { useSelector} from "react-redux";


import "./registerPage.css";
import ForgetPass from "../../components/ForgetPass/forgetPass";
import { useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
const RegisterPage = () => {
  const forgotpass = useSelector((state:any) => state.pagevalues.forgotpass);
  const register = useSelector((state:any) => state.pagevalues.register);

  const dash = useSelector((state:any) => state.dashboard.dashboardview);
  const nav = useNavigate();
  useEffect(() => {
    if (getCookie("sessionid") || dash) {
      nav("/dashboard");
    }
  }, []);

  return (
    <div
      className="login-section"
      style={{
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <img src={Logo} alt="" className="logo" />
      <div className="login">

        <div className="vector">
          <img src={svg} alt="" className="login-vector" />
        </div>
        <div className="prompts">
          {register ? <Register></Register> : <></>}
          {forgotpass ? <ForgetPass></ForgetPass> : <div></div>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
