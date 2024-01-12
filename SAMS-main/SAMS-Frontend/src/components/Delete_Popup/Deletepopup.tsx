import React, { useState } from "react";
import "./Deletepopup.css";
import { useDispatch } from "react-redux";
import appService from "../../api/endpoints";
import { deletecustomerdata } from "../../store/features/customerdatas";
import { toast } from "react-toastify";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { deletegpsdata } from "../../store/features/dataentry";
interface Props {
  id?: any;
  vehicle_number?: any;
  exist?: any;
  todo?: any;
  type?: any;
  calculateDirections?: any;
  origin?: any;
  destination?: any;
}
const Deletepopup: React.FC<Props> = ({
  id,
  vehicle_number,
  exist,
  todo,
  type,
  calculateDirections
}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (action?: string) => {
    if (type === "user") {
      if (action === "yes") {
        setIsLoading(true);
        const response = await appService.deleteDataStoreSegment(id);
        if (response.success) {
          dispatch(
            deletegpsdata({
              id: id,
            })
          );
          calculateDirections();
          setIsLoading(false);
          todo({ ...exist, delete: false });
          toast.success(response.message);
        } else {
          setIsLoading(false);
          toast.error(response.message);
          todo({ ...exist, delete: false });
        }
      } else {
        todo({ ...exist, delete: false });
      }
    } 
    
    else {
      if (action === "yes") {
        setIsLoading(true);
        const response = await appService.deleteDevice(id, vehicle_number);
        if (response.success) {
          dispatch(
            deletecustomerdata({
              id: id,
              vehicle_number: vehicle_number,
            })
          );
          setIsLoading(false);
          todo({ ...exist, delete: false });
          toast.success(response.message);
        } else {
          setIsLoading(false);
          toast.error(response.message);
          todo({ ...exist, delete: false });
        }
      } else {
        todo({ ...exist, delete: false });
      }
    }

    // todo({ ...exist, delete: false });
  };

  return (
    <div className="delete-pop-up">
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <h2 className="pop-h2">Are you sure you want to delete?</h2>
      <div className="pop-buttons">
        <Button
          variant="contained"
          onClick={() => {
            handleDelete("yes");
          }}
          style={{
            backgroundColor: "rgb(255, 2, 2)",
            color: "white",
            fontWeight: "bold",
            fontFamily: "Nunito",
            fontSize: "1.1rem",
          }}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            handleDelete("no");
          }}
          style={{
            backgroundColor: "#2f2e41",
            color: "white",
            fontWeight: "bold",
            fontFamily: "Nunito",
            fontSize: "1.1rem",
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default Deletepopup;
