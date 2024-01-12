import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  viewloginpage,
  viewforgotpass,
  viewregisterpage,
} from "../../store/features/pagevalues";
import { useNavigate } from "react-router-dom";
import "./forgetPass.css";
import appService from "../../api/endpoints";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { Backdrop, CircularProgress } from "@mui/material";


const ForgetPass = () => {
  const nav = useNavigate();
  const [start, setStart] = useState(true);
  const [further, setFurther] = useState(false);
  const [otp, setotp] = useState(false);

  const [sentOTP, setsentOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    mail: "",
    username: "",
    password: "",
    confirmpassword: "",
    otp: "",
  });

  const dispatch = useDispatch();

  const [passwordToggle, setPasswordToggle] = useState(false)
  
  const sendOTP = async () => {
    let email = formData.mail;
    let regex = new RegExp('[a-z0-9]+@[a-z]+[.][a-z]{2,3}');
      if(!regex.test(email)){
          toast.error("Enter the valid Email!");
          return;
      }
    
    setIsLoading(true);
    let response:any = await appService.sendOTP('reset', "",  email)
    
    console.log(response);

    if(response.success){
      setIsLoading(false);
      toast.success(response.message);
      setsentOTP(response.otp);
      setFurther(true);
      setStart(false);
    }else{
      setIsLoading(false);
      toast.error(response.message);
    }
  }

  const verifyOTP = async () => {
    if(formData.otp.trim().length>0){
      if(formData.otp === sentOTP){
        toast.success('OTP verified');
        setotp(true);
        setFurther(false);
      }else{
        toast.error('OTP not verified');
      }
    }else{
      toast.error('Please enter OTP');
    }
    
  }

  const resetPassword = async ()=>{
    let [newPassword, confirmPasssword] = [formData.password, formData.confirmpassword]
    if(newPassword.trim().length>0 && confirmPasssword.trim().length>0){
      if(newPassword===confirmPasssword){
        setIsLoading(true);
        let response:any = await appService.resetPassword(formData.mail, formData.password)
        if(response.success){
          setIsLoading(false);
          toast.success(response.message)
          dispatch(viewforgotpass({ login: true, forgotpass: false, register : true }));
        }else{
          setIsLoading(false);
          toast.error(response.message)
        }
      }else{
        toast.warning('Passwords Doesn\'t Match!!')
      }
    }
    else{
      toast.error('Please Fill out all fields!!')
    }
    
  }
  
  return (
    <div>
      <ToastContainer
        autoClose={2000}
        theme="dark"
        style={{
          fontSize: "1.2rem",
          fontFamily : 'Poppins'
        }}
      />
      {isLoading ? (
      
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      {start && (
        <div>
          <h2 className="login-h2 forgot">FORGOT PASSWORD?</h2>
          <form className="login-form" onSubmit={(e)=>{e.preventDefault()}}>

            <div className="form-card">
            
              <div className="form-field">
                <label htmlFor="forget-user" className="login-label">
                  Email ID
                </label>
                <div className="input-box">
                  <input
                    type="email"
                    id="forget-user"
                    required
                    className="login-input"
                    onChange={(e) => {
                      setFormData({ ...formData, mail: e.target.value });
                    }}
                    value={formData.mail}
                    placeholder="Enter your Email Id"
                  />
                </div>
                
              </div>

            </div>
            

            <button
              onClick={sendOTP}
              className="login-button"
            >
              Request for OTP
            </button>
            <div className="links">
              <p
                onClick={() => {
                  dispatch(
                    viewloginpage({
                      login: true,
                      forgotpass: false,
                      register: true,
                    })
                  );
                  nav("/login");
                }}
              >
                Back to Login
              </p>
              <p
                onClick={() => {
                  nav("/register");
                  dispatch(
                    viewregisterpage({
                      login: true,
                      register: true,
                      forgotpass: false,
                    })
                  );
                }}
              >
                New User? Sign Up
              </p>
            </div>
          </form>
        </div>
      )}

      {further && (
        <div>
          <h2 className="login-h2 forgot">FORGOT PASSWORD?</h2>
          <form action="" className="login-form" onSubmit={
            (e)=>{e.preventDefault()}
          }>

            <div className="form-card">
              
              <div className="form-field">

                <label htmlFor="forget-mail" className="login-label">
                  Email ID
                </label>

                <div className="input-box"
                  style={{
                    pointerEvents : 'none',
                    opacity : '0.5'
                  }}
                >
                  <input
                    type="mail"
                    id="forget-mail"
                    value={formData.mail}
                    readOnly
                    className="login-input"
                    placeholder="Enter your Email Id"
                  />
                </div>
                
              </div>

              <div className="form-field">
                <label htmlFor="forget-pas" className="login-label">
                  OTP
                </label>
                <div className="input-box">
                  <input
                    type={passwordToggle?'text':'password'}
                    required
                    id="forget-pas"
                    value={formData.otp}
                    onChange={(e) => {
                      setFormData({ ...formData, otp: e.target.value });
                    }}
                    className="login-input"
                    placeholder="Enter your OTP"
                    minLength={4}
                    maxLength={4}
                  />
                  <span 
                    onClick={()=>{setPasswordToggle(!passwordToggle)}}
                    className="input-box-icon" style={{cursor : 'pointer'}}
                  > 
                  {
                    passwordToggle?
                    <AiFillEye/> : <AiFillEyeInvisible/>
                  }
                  </span>
                </div>
                
              </div>
            </div>
            
            <button
              onClick={verifyOTP}
              className="login-button"
            >
              Validate OTP
            </button>
            <div className="links">
              <p
                onClick={() => {
                  dispatch(
                    viewloginpage({
                      login: true,
                      forgotpass: false,
                      register: true,
                    })
                  );
                  nav("/login");
                }}
              >
                Back to Login
              </p>
              <p
                onClick={() => {
                  nav("/register");
                  dispatch(
                    viewregisterpage({
                      login: true,
                      register: true,
                      forgotpass: false,
                    })
                  );
                }}
              >
                New User? Sign Up
              </p>
            </div>
            ;
          </form>
        </div>
      )}

      {otp && (
        <div>
          <h2 className="login-h2 forgot">FORGOT PASSWORD?</h2>
          <form action="" className="login-form" onSubmit={(e)=>{e.preventDefault()}}>
            <div className="form-card">
              <div className="form-field">
                <label htmlFor="email1" className="login-label">
                  Email ID
                </label>
                <div className="input-box"
                  style={
                    {
                      pointerEvents : 'none',
                      opacity : '0.5'
                    }
                  }
                >
                  <input
                    type="mail"
                    id="email1"
                    value={formData.mail}
                    readOnly
                    className="login-input"
                    placeholder="Enter your Email Id"
                  />
                </div>
                
              </div>

              <div className="form-field">
                <label htmlFor="new1" className="login-label">
                  New password
                </label>
                <div className="input-box">
                  <input
                    type="password"
                    required
                    minLength={8}
                    id="new1"
                    className="login-input"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    placeholder="Enter your new password "
                  />
                </div>
                
              </div>

              <div className="form-field">
                <label htmlFor="confirm1" className="login-label">
                  Confirm password
                </label>
                <div className="input-box">
                  <input
                    type="text"
                    required
                    minLength={8}
                    id="confirm1"
                    className="login-input"
                    value={formData.confirmpassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmpassword: e.target.value });
                    }}
                    placeholder="Enter your confirm password "
                  />
                </div>
                
              </div>
            </div>

            
            
            
            
            <button
              onClick={resetPassword}
              className="login-button"
            >
              Reset Password
            </button>
            <div className="links">
              <p
                onClick={() => {
                  dispatch(
                    viewloginpage({
                      login: true,
                      forgotpass: false,
                      register: true,
                    })
                  );
                  nav("/login");
                }}
              >
                Back to Login
              </p>
              <p
                onClick={() => {
                  nav("/register");
                  dispatch(
                    viewregisterpage({
                      login: true,
                      register: true,
                      forgotpass: false,
                    })
                  );
                }}
              >
                New User? Sign Up
              </p>
            </div>
            ;
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgetPass;
