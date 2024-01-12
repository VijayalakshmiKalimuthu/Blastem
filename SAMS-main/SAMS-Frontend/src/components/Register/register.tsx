import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  viewforgotpass,
  viewregisterpage,
} from "../../store/features/pagevalues";
import { useNavigate } from "react-router-dom";
import "./register.css";
import appService from "../../api/endpoints";
// import { TiTick } from "react-icons/ti";
// import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Backdrop, CircularProgress } from "@mui/material";

const Register = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [viewothersec, setviewothersec] = useState({
    otp: true,
    signup: false,
    register: true,
  });
  useEffect(() => {
    dispatch(
      viewregisterpage({ login: true, forgotpass: false, register: true })
    );
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    otp: "",
    password: "",
    confirmpassword: "",
  });

  // const [usernameStatus, setUsernameStatus] = useState("");
  // const [emailStatus, setEmailStatus] = useState("");

  const handleFormChange = (e: any, type: string) => {
    if (type === "username") {
      setRegisterForm({
        ...registerForm,
        username: e.target.value,
      });
    } else if (type === "email") {
      setRegisterForm({
        ...registerForm,
        email: e.target.value,
      });
    } else if (type === "password") {
      setRegisterForm({
        ...registerForm,
        password: e.target.value,
      });
    } else if (type === "confirmpassword") {
      setRegisterForm({
        ...registerForm,
        confirmpassword: e.target.value,
      });
    }
  };

  const proceedRegister = async () => {
    if (
      registerForm.username.length === 0 ||
      registerForm.email.length === 0 ||
      registerForm.password.length === 0 ||
      registerForm.confirmpassword.length === 0
    )
      alert("please fill all the fields");
    else {
      if (registerForm.password === registerForm.confirmpassword) {
        setIsLoading(true);
        const response: any = await appService.register(
          registerForm.username,
          registerForm.email,
          registerForm.password
        );
        if (response.success) {
          toast.success("Registration Successfull!!");
          setIsLoading(false);
          nav("/login");
        } else {
          toast.error(response.message);
          setIsLoading(false);
        }
      } else alert("passwords do not match");
    }
  };

  const verifyMail = async () => {
    if (
      registerForm.username.trim().length > 0 &&
      registerForm.email.trim().length > 0
    ) {
      setIsLoading(true);
      const response: any = await appService.sendOTP(
        "verify",
        registerForm.username,
        registerForm.email
      );

      if (response.success) {
        const sent_otp = response.otp;
        setIsLoading(false);

        // toast.success(response.message);

        let otp: any = "";

        while (!otp) {
          otp = window.prompt("Enter your OTP");
        }

        const regex = /^[0-9]{4}$/;

        if (otp && regex.test(otp)) {
          if (sent_otp === otp) {
            toast.success("OTP verified successfully!!");
            setviewothersec({ ...viewothersec, otp: false, signup: true });
          } else toast.error("OTP doesn't match!!");
        } else toast.error("OTP not valid!!");
      } else {
        setIsLoading(false);
        toast.error(response.message);
      }
    } else {
      toast.warning("Please Fill out all Fields!!");
    }
  };

  const handleusername = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, username: e.target.value });
  };
  const handleemail = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, email: e.target.value });
  };

  // const handleblurusername = async () => {
  //   if (registerForm.username.length === 0) setUsernameStatus("");
  //   else {
  //     const response: ServerResponse = await appService.verifyCredential(
  //       "username",
  //       registerForm.username
  //     );
  //     if (response.success) setUsernameStatus("true");
  //     else setUsernameStatus("false");
  //   }
  // };

  // const handlebluremail = async () => {
  //   if (registerForm.email.length === 0) setEmailStatus("");
  //   else {
  //     let regex = new RegExp('[a-z0-9]+@[a-z]+[.][a-z]{2,3}');
  //     if(!regex.test(registerForm.email)){
  //         toast.error("Enter the valid Email!");
  //         return;
  //     }
  //     const response: ServerResponse = await appService.verifyCredential(
  //       "email",
  //       registerForm.email
  //     );
  //     if (response.success) setEmailStatus("true");
  //     else setEmailStatus("false");
  //   }
  // };

  return (
    <div
      style={
        viewothersec.signup
          ? {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
              marginTop: "3rem",
            }
          : {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
            }
      }
    >
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <h2
        className="login-h2"
        style={viewothersec.signup ? { marginBottom: "1rem" } : {}}
      >
        REGISTER
      </h2>

      <form
        action=""
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="form-card">
          <div className="form-field">
            <label htmlFor="" className="login-label">
              Username
            </label>

            <div className="input-box">
              <input
                type="text"
                className="login-input"
                onChange={(e) => {
                  handleusername(e);
                  handleFormChange(e, "username");
                }}
                placeholder="Enter your Username"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="" className="login-label">
              Email ID
            </label>

            <div
              className="input-box"
              style={
                viewothersec.signup
                  ? {
                      opacity: 0.5,
                      pointerEvents: "none",
                    }
                  : {}
              }
            >
              <input
                type="text"
                className="login-input"
                placeholder="Enter your Email Id"
                onChange={(e) => {
                  handleemail(e);
                  handleFormChange(e, "email");
                }}
              />
            </div>
          </div>
        </div>

        {viewothersec.otp ? (
          <button
            className="login-button"
            onClick={verifyMail}
            style={
              registerForm.username.trim().length <= 0 ||
              registerForm.email.trim().length <= 0
                ? { opacity: "0.30", pointerEvents: "none" }
                : {}
            }
          >
            Verify Mail
          </button>
        ) : (
          <div></div>
        )}

        {viewothersec.signup && (
          <>
            <div className="form-card" style={{ marginTop: "20px" }}>
              <div className="form-field">
                <label htmlFor="" className="login-label">
                  Password
                </label>
                <div className="input-box">
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Enter your Password"
                    onChange={(e) => {
                      handleFormChange(e, "password");
                    }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="" className="login-label">
                  Confirm Password
                </label>
                <div className="input-box">
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Retype Password"
                    onChange={(e) => {
                      handleFormChange(e, "confirmpassword");
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {viewothersec.signup ? (
          <button className="login-button" onClick={proceedRegister}>
            Sign Up
          </button>
        ) : (
          <div></div>
        )}

        <div className="links">
          <p
            onClick={() => {
              dispatch(
                viewforgotpass({
                  login: false,
                  forgotpass: true,
                  register: false,
                })
              );
            }}
          >
            Forgot Password?
          </p>
          <p
            onClick={() => {
              nav("/login");
            }}
          >
            Back to Login
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
