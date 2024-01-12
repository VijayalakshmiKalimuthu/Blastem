import Blastem_white_logo from "../../assets/Blastem-white-logo.png";
import "./Topbar.css";
const Topbar = () => {
  return (
    <div className="container">
      <div className="content">
        <img src={Blastem_white_logo} alt="" />
      </div>
      <div className="text">
        <p>SWARM CONTROL AUTOMOTIVE FLEET MANAGEMENT SOFTWARE </p>
        <p style={{ alignSelf: "flex-end" }}>[&nbsp;SAMS&nbsp;]</p>
      </div>
    </div>
  );
};

export default Topbar;
