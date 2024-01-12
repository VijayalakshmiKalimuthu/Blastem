import  { useEffect } from "react";
import "./User_Dashboard_Page.css";

import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import SearchUserRecords from "../../components/SearchUserRecords/SearchUserRecords";
import Topbar from "../../components/Topbar/Topbar";
import SideNav from "../../components/SideNav/SideNav";

const User_Dashboard_Page = () => {
  const userdash = useSelector(
    (state:any) => state.persists.persists.value.userdashboard
  );

  const nav = useNavigate();

  useEffect(() => {
    if (!getCookie("sessionid") || !userdash) {
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
              <h2 className="page-title">GPS Data</h2>
          </div>


            <div className="rem-content">
              <SearchUserRecords />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_Dashboard_Page;
