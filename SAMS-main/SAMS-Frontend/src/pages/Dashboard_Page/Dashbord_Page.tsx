import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";

import Topbar from "../../components/Topbar/Topbar";
import "./Dashboard_Page.css";
import SideNav from "../../components/SideNav/SideNav";
import Maintable from "../../components/Main_Table/Maintable";
import Searchdevice from "../../components/Search_Device/Searchdevice";
import Dataentry from "../../components/Data_Entry/Dataentry";

const Dashbord_Page = () => {
  const admindash = useSelector(
    (state: any) => state.persists.persists.value.admindashboard
  );

  const currentview = useSelector((state: any) => state.dashboard.currentview);
  const nav = useNavigate();

  useEffect(() => {
    if (!getCookie("sessionid") || !admindash) {
      nav("/");
    }
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="side-nav">
        <SideNav />
      </div>

      <div className="dashboard-page">
        <div className="top-bar">
          <Topbar />
        </div>

        <div className="dashboard-main">
          <div className="main-content">
            <div className="top">
              {currentview.deviceregistry && (
                <h2 className="page-title">Device Registry</h2>
              )}
              {currentview.searchdevices && (
                <h2 className="page-title">Search Devices</h2>
              )}
              {currentview.dataentry && (
                <h2 className="page-title">Speed Limits</h2>
              )}
            </div>

            <div className="rem-content">
              {currentview.deviceregistry && <Maintable />}
              {currentview.searchdevices && (
                <div>
                  <Searchdevice />
                </div>
              )}
              {currentview.dataentry && <Dataentry />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbord_Page;
