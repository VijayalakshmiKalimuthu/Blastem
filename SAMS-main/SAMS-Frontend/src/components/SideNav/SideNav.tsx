/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./SideNav.css";
import { GoPencil } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { SiSpeedtest } from "react-icons/si";
import { FiLogOut } from "react-icons/fi";
import profile from "../../assets/profile.png";
import { useSelector, useDispatch } from "react-redux";
import { updatecurrentview } from "../../store/features/dashboard";

import { removeCookie } from "typescript-cookie";
import { useNavigate } from "react-router-dom";
import appService from "../../api/endpoints";
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  viewadmindashboard,
  viewuserdashboard,
} from "../../store/features/persists";
import { viewcustomerpage } from "../../store/features/pagevalues";

const SideNav = () => {
  const dispatch = useDispatch();
  const currentview = useSelector((state: any) => state.dashboard.currentview);
  const nav = useNavigate();
  const user = useSelector(
    (state: any) => state.persists.persists.value.userdashboard
  );

    const username = useSelector(
    (state: any) => state.persists.persists.value.username
  );

  const [isLoading, setIsLoading] = useState(false);

  function handlechange(value: string) {
    if (value == "deviceregistry") {
      dispatch(
        updatecurrentview({
          deviceregistry: true,
          searchdevices: false,
          dataentry: false,
        })
      );
    } else if (value == "searchdevices") {
      dispatch(
        updatecurrentview({
          deviceregistry: false,
          searchdevices: true,
          dataentry: false,
        })
      );
    } else if (value == "dataentry") {
      dispatch(
        updatecurrentview({
          deviceregistry: false,
          searchdevices: false,
          dataentry: true,
        })
      );
    }
  }

  const logout = async () => {
    setIsLoading(true);
    const response = await appService.logout();
    if (response.success) {
      removeCookie("sessionid");
      dispatch(
        viewadmindashboard({
          admindashboard: false,
        })
      );

      dispatch(
        viewuserdashboard({
          userdashboard: false,
        })
      );
      dispatch(
        viewcustomerpage({
          customer: false,
          login: true,
          forgotpass: false,
          register: true,
        })
      );

      setIsLoading(false);
      nav("/login");
      toast.success(response.message);
    } else {
      setIsLoading(false);
      toast.error(response.message);
    }
  };

  return (
    <div className="sidenav-com">
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <div className="user-pro">
        <img
          className="img1"
          src={profile}
          style={{
            height: "30px",
            display: "block",
          }}
        />
        <h3 style={{"letterSpacing":"1.2px"}}>{username.toUpperCase()}</h3>
      </div>

      <div className="side-nav-main">
        {!user && (
          <div className="side-nav-top">
            <div
              className="user-pro user-options"
              onClick={() => {
                handlechange("deviceregistry");
              }}
              style={
                currentview.deviceregistry
                  ? {
                      backgroundColor: "#f5f5f5",
                      color: "#1e1e20",
                    }
                  : {}
              }
            >
              <span
                className="user-image"
                style={
                  currentview.deviceregistry
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                <GoPencil />
              </span>
              <h3
                style={
                  currentview.deviceregistry
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                Device Registry
              </h3>
            </div>

            <div
              className="user-pro user-options"
              style={
                currentview.searchdevices
                  ? {
                      backgroundColor: "#f5f5f5",
                      color: "#1e1e20",
                    }
                  : {}
              }
              onClick={() => {
                handlechange("searchdevices");
              }}
            >
              <span
                className="user-image"
                style={
                  currentview.searchdevices
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                <GoSearch />
              </span>
              <h3
                style={
                  currentview.searchdevices
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                Search Devices
              </h3>
            </div>

            <div
              className="user-pro user-options"
              onClick={() => {
                handlechange("dataentry");
              }}
              style={
                currentview.dataentry
                  ? {
                      backgroundColor: "#f5f5f5",
                      color: "#1e1e20",
                    }
                  : {}
              }
            >
              <span
                className="user-image"
                style={
                  currentview.dataentry
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                <SiSpeedtest/>
              </span>
              <h3
                style={
                  currentview.dataentry
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                Speed Limits
              </h3>
            </div>
          </div>
        )}

        {user && (
          <div className="side-nav-top">
            <div
              className="user-pro user-options"
              style={{
                backgroundColor: "#f5f5f5",
                color: "#1e1e20",
              }}
            >
              <span
                className="user-image"
                style={
                  currentview.deviceregistry
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                <GoPencil />
              </span>
              <h3
                style={
                  currentview.deviceregistry
                    ? {
                        color: "#1e1e20",
                      }
                    : {}
                }
              >
                Information
              </h3>
            </div>
          </div>
        )}

        <div className="user-pro user-options1 logout" onClick={logout}>
          <span className="user-image">
            <FiLogOut />
          </span>
          <h3>Logout</h3>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
