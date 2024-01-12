/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./UserLogin.css";
import "react-phone-input-2/lib/style.css";
import { MuiOtpInput } from "mui-one-time-password-input";
import appService from "../../api/endpoints";
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewuserdashboard } from "../../store/features/persists";

const UserLogin = () => {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentOTP, setSentOTP] = useState(null);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (newValue: any) => {
    setOtp(newValue);
  };

  const requestOTP = async () => {
    if (phone.length !== 10) toast.error("Invalid Phone Number");
    else {
      setIsLoading(true);
      const response = await appService.sendLoginOTP(phone);
      if (response.success) {
        toast.success(response.message);
        console.log(response);
        setSentOTP(response.otp);
        setState(true);
        setIsLoading(false);
      } else {
        toast.error(response.message);
        setIsLoading(false);
      }
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 4) toast.error("Invalid OTP");
    else {
      if (otp === sentOTP) {
        setIsLoading(true);
        const response = await appService.loginAsUser(phone);
        if (response.success) {
          // ADD THIS TO STORE
          setIsLoading(false);
          toast.success(response.message);
          dispatch(
            viewuserdashboard({
              userdashboard: true,
              username: response.username,
            })
          );
          nav("/user");
        } else {
          setIsLoading(false);
          setState(false);
          toast.error(response.message);
        }
      } else {
        setState(false);
        toast.error("Invalid OTP");
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <div style={{ marginBottom: "8rem" }}>
        <h2 className="clogin-h2">LOGIN</h2>
        <form
          className="clogin-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="cform-card">
            <div className="cform-field">
              <label htmlFor="" className="clogin-label">
                Enter your Phone Number
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  backgroundColor: "#ddd",
                  borderRadius: "5px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    bottom: "0",
                    fontFamily: "Nunito",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    backgroundColor: "#313136",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3px 10px",
                    borderRadius: "5px 0 0 5px",
                  }}
                  className="country-code"
                >
                  +91
                </span>
                <input
                  type="text"
                  style={{
                    backgroundColor: "#ddd",
                    paddingLeft: "5rem",
                    width: "40rem",
                    opacity: state ? "0.5" : "1",
                    cursor: state ? "not-allowed" : "text",
                    border: "none",
                  }}
                  disabled={state}
                  placeholder={"Enter the Contact"}
                  value={phone}
                  className="device-input-field correct-input"
                  onChange={(e) => {
                    const value = e.target.value;
                    const phone_regex = /^[0-9]*$/;
                    if (value.length <= 10 && phone_regex.test(value)) {
                      setPhone(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            {state && (
              <div className="cform-field">
                <label htmlFor="" className="clogin-label">
                  Enter your OTP
                </label>

                <div className="cinput-box">
                  <MuiOtpInput
                    style={{
                      width: "43rem",
                      color: "#2f2e41",
                      fontSize: "2rem",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                    }}
                    value={otp}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {!state && (
              <button
                className="clogin-button"
                onClick={() => {
                  requestOTP();
                }}
              >
                Request OTP
              </button>
            )}
            {state && (
              <button className="clogin-button" onClick={verifyOTP}>
                Verify & Login
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default UserLogin;
