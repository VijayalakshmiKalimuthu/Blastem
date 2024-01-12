import React, { useEffect, useState } from "react";
import "./Data_Entry_Popup.css";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import appService from "../../api/endpoints";
import { useDispatch } from "react-redux";
import { addgpsdata, editgpsdata } from "../../store/features/dataentry";
import { BiSolidErrorCircle } from "react-icons/bi";

interface DataEntryPopupProps {
  action?: string;
  data?: any;
  exist?: any;
  todo?: any;
  id?: any;
  calculateDirections?: any;
  origin?: any;
  destination?: any;
}

const Data_Entry_Popup: React.FC<DataEntryPopupProps> = ({
  action,
  data,
  exist,
  todo,
  calculateDirections
}) => {
  const [fielddata, setfielddata] = useState<any>(data);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();

  const [errorData, setErrorData] = useState<{
    latitude: string | null;
    longitude: string | null;
    nearby_police_station: string | null;
    nearby_ambulance: string | null;
    speed_limit: string | null;
  }>({
    latitude: null,
    longitude: null,
    nearby_police_station: null,
    nearby_ambulance: null,
    speed_limit: null,
  });

  const [showError, setShowError] = useState<string>("");

  const setError = (value: string) => {
    if (showError === value) setShowError("");
    else setShowError(value);
  };

  function handlefieldchange(state: string, value: string) {
    switch (state) {
      case "latitude":
        if (/^[0-9.]*$/.test(value))
          setfielddata({ ...fielddata, latitude: value });

        if (value.length === 0)
          setErrorData({ ...errorData, latitude: "Field cannot be empty" });
        else setErrorData({ ...errorData, latitude: null });

        break;

      case "longitude":
        if (/^[0-9.]*$/.test(value))
          setfielddata({ ...fielddata, longitude: value });

        if (value.length === 0)
          setErrorData({ ...errorData, longitude: "Field cannot be empty" });
        else setErrorData({ ...errorData, longitude: null });
        break;

      case "nearby_police_station":
        if (
          /^[0-9]*[-]?[0-9]*$/.test(value) &&
          ((value.includes("-") && value.length <= 11) ||
            (!value.includes("-") && value.length <= 10))
        )
          setfielddata({ ...fielddata, nearby_police_station: value });

        if (value.length === 0)
          setErrorData({
            ...errorData,
            nearby_police_station: "Field cannot be empty",
          });
        else setErrorData({ ...errorData, nearby_police_station: null });

        break;

      case "nearby_ambulance":
        if (
          /^[0-9]*[-]?[0-9]*$/.test(value) &&
          ((value.includes("-") && value.length <= 11) ||
            (!value.includes("-") && value.length <= 10))
        )
          setfielddata({ ...fielddata, nearby_ambulance: value });

        if (value.length === 0)
          setErrorData({
            ...errorData,
            nearby_ambulance: "Field cannot be empty",
          });
        else setErrorData({ ...errorData, nearby_ambulance: null });

        break;

      case "speed_limit":
        if (/^[0-9.]*$/.test(value))
          setfielddata({ ...fielddata, speed_limit: value });

        if (value.length === 0)
          setErrorData({ ...errorData, speed_limit: "Field cannot be empty" });
        else setErrorData({ ...errorData, speed_limit: null });

        break;

      default:
        break;
    }
  }

  useEffect(() => {
    setfielddata(fielddata);
  }, [fielddata]);

  const validate = () => {
    if (
      errorData.latitude ||
      errorData.longitude ||
      errorData.nearby_police_station ||
      errorData.nearby_ambulance ||
      errorData.speed_limit
    ) {
      toast.error("Please fill out all the fields correctly");
      return false;
    } else if (
      fielddata.nearby_police_station.trim().length === 0 ||
      fielddata.nearby_ambulance.trim().length === 0 ||
      fielddata.speed_limit === 0
    ) {
      toast.warning("Please fill out all the fields");
      return false;
    } else if (
      fielddata.nearby_police_station === undefined ||
      fielddata.nearby_ambulance === undefined ||
      fielddata.speed_limit === undefined
    ) {
      toast.warning("Please fill out all the fields");
      return false;
    }

    return true;
  };

  const addDataStore = async () => {
    const isValid = validate();

    if (isValid) {
      setisLoading(true);
      const startPointArr = fielddata.startPoint
        .split(",")
        .map((item: string) => item.trim());
      const endPointArr = fielddata.endPoint
        .split(",")
        .map((item: string) => item.trim());

      const response = await appService.addDataStoreSegment({
        startLatitude: startPointArr[0],
        startLongitude: startPointArr[1],
        endLatitude: endPointArr[0],
        endLongitude: endPointArr[1],
        dataPoints: fielddata.dataPoints,
        nearByPoliceStation: fielddata.nearby_police_station,
        nearByAmbulance: fielddata.nearby_ambulance,
        speedLimit: fielddata.speed_limit,
      });

      if (response.success) {
        toast.success(response.message);

        // dispatch(
        //   addgpsdata({
        //     value: {
        //       ...fielddata,
        //       original_id: response.original_id,
        //       start_latitude: startPointArr[0],
        //       start_longitude: startPointArr[1],
        //       end_latitude: endPointArr[0],
        //       end_longitude: endPointArr[1],
        //       middle_point: {
        //         latitude: response.middle_point.latitude,
        //         longitude: response.middle_point.longitude,
        //       },
        //       next_point: {
        //         latitude: response.next_point.latitude,
        //         longitude: response.next_point.longitude,
        //       }
        //     },
        //   })
        // );

        calculateDirections();

        setisLoading(false);
        todo({ ...exist, mainpopup: false });
      } else {
        toast.error(response.message);
        setisLoading(false);
      }
    }
  };

  useEffect(() => {
    setfielddata(fielddata);
  }, [fielddata]);

  const updateDataStore = async () => {
    setisLoading(true);
    const isValid = validate();

    if (isValid) {
      const response = await appService.updateDataStoreSegment({
        originalID: fielddata.original_id,
        nearByPoliceStation: fielddata.nearby_police_station,
        nearByAmbulance: fielddata.nearby_ambulance,
        speedLimit: fielddata.speed_limit,
      });

      if (response.success) {
        toast.success(response.message);

        // dispatch(
        //   editgpsdata({
        //     value: fielddata,
        //   })
        // );

        calculateDirections();

        setisLoading(false);

        todo({ ...exist, edit: false });
      } else {
        toast.error(response.message);
        setisLoading(false);
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

      <div className="mainbox">
        <div className="top-title">
          <h2 className="title">Geo-Location Data</h2>
        </div>
        <div className="mainflex">
          <div className="flex">
            <div className="field-flex">
              <div className="subtitle">
                <label htmlFor="Latitude" className="labels">
                  Start Lat,Lng
                </label>
              </div>

              <div
                className={`field ${errorData.latitude ? "error-field" : ""}`}
              >
                {errorData.latitude ? (
                  <span
                    style={{
                      color:
                        showError === "latitude" && errorData.latitude
                          ? "#fff"
                          : "#ef233bd6",
                    }}
                    onClick={() => setError("latitude")}
                    className="error-icon"
                  >
                    <BiSolidErrorCircle />
                  </span>
                ) : null}

                <input
                  type="text"
                  placeholder={"Enter Latitude"}
                  value={fielddata.startPoint || ""}
                  className={`device-input-field ${
                    errorData.latitude ? "error-input" : "correct-input"
                  }`}
                  disabled={true}
                  onChange={(e) => {
                    handlefieldchange("latitude", e.target.value);
                  }}
                />

                <div
                  className={`error-txt ${
                    showError === "latitude" && errorData.latitude
                      ? "open-error-txt"
                      : "closed-error-txt"
                  }`}
                >
                  <span>{errorData.latitude}</span>
                </div>
              </div>
            </div>
            <div className="field-flex">
              <div className="subtitle">
                <label htmlFor="longitude" className="labels">
                  End Lat,Lng
                </label>
              </div>
              <div
                className={`field ${errorData.longitude ? "error-field" : ""}`}
              >
                {errorData.longitude ? (
                  <span
                    style={{
                      color:
                        showError === "longitude" && errorData.longitude
                          ? "#fff"
                          : "#ef233bd6",
                    }}
                    onClick={() => setError("longitude")}
                    className="error-icon"
                  >
                    <BiSolidErrorCircle />
                  </span>
                ) : null}
                <input
                  type="text"
                  placeholder={"Enter the Longitude"}
                  value={fielddata.endPoint || ""}
                  className={`data-input-field ${
                    errorData.longitude ? "error-input" : "correct-input"
                  }`}
                  disabled={
                    action === "view" || action === "add" || action === "edit"
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    handlefieldchange("longitude", e.target.value);
                  }}
                />

                <div
                  className={`error-txt ${
                    showError === "longitude" && errorData.longitude
                      ? "open-error-txt"
                      : "closed-error-txt"
                  }`}
                >
                  <span>{errorData.longitude}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="field-flex">
              <div className="subtitle">
                <label htmlFor="nearby_police_station" className="labels">
                  Nearby Police Station Contact
                </label>
              </div>
              <div
                className={`field ${
                  errorData.nearby_police_station ? "error-field" : ""
                }`}
              >
                {errorData.nearby_police_station ? (
                  <span
                    style={{
                      color:
                        showError === "police_station" &&
                        errorData.nearby_police_station
                          ? "#fff"
                          : "#ef233bd6",
                    }}
                    onClick={() => setError("police_station")}
                    className="error-icon"
                  >
                    <BiSolidErrorCircle />
                  </span>
                ) : null}

                <input
                  type="text"
                  placeholder={"Nearby Police Station Contact"}
                  value={fielddata.nearby_police_station || ""}
                  className={`data-input-field ${
                    errorData.nearby_police_station
                      ? "error-input"
                      : "correct-input"
                  }`}
                  disabled={action == "edit" || action == "add" ? false : true}
                  onChange={(e) => {
                    handlefieldchange("nearby_police_station", e.target.value);
                  }}
                />

                <div
                  className={`error-txt ${
                    showError === "police_station" &&
                    errorData.nearby_police_station
                      ? "open-error-txt"
                      : "closed-error-txt"
                  }`}
                >
                  <span>{errorData.nearby_police_station}</span>
                </div>
              </div>
            </div>

            <div className="field-flex">
              <div className="subtitle">
                <label htmlFor="Nearby Ambulance" className="labels">
                  Nearby Ambulance Contact
                </label>
              </div>
              <div
                className={`field ${
                  errorData.nearby_ambulance ? "error-field" : ""
                }`}
              >
                {errorData.nearby_ambulance ? (
                  <span
                    style={{
                      color:
                        showError === "ambulance" && errorData.nearby_ambulance
                          ? "#fff"
                          : "#ef233bd6",
                    }}
                    onClick={() => setError("ambulance")}
                    className="error-icon"
                  >
                    <BiSolidErrorCircle />
                  </span>
                ) : null}

                <input
                  type="text"
                  placeholder={"Nearby Ambulance Contact"}
                  value={fielddata.nearby_ambulance || ""}
                  className={`data-input-field ${
                    errorData.nearby_ambulance ? "error-input" : "correct-input"
                  }`}
                  disabled={action == "edit" || action == "add" ? false : true}
                  onChange={(e) => {
                    handlefieldchange("nearby_ambulance", e.target.value);
                  }}
                />

                <div
                  className={`error-txt ${
                    showError === "ambulance" && errorData.nearby_ambulance
                      ? "open-error-txt"
                      : "closed-error-txt"
                  }`}
                >
                  <span>{errorData.nearby_ambulance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="field-flex">
              <div className="subtitle">
                <label htmlFor="speed_limit" className="labels">
                  Speed Limit
                </label>
              </div>
              <div
                className={`field ${
                  errorData.speed_limit ? "error-field" : ""
                }`}
              >
                {errorData.speed_limit ? (
                  <span
                    style={{
                      color:
                        showError === "speed" && errorData.speed_limit
                          ? "#fff"
                          : "#ef233bd6",
                    }}
                    onClick={() => setError("speed")}
                    className="error-icon"
                  >
                    <BiSolidErrorCircle />
                  </span>
                ) : null}

                <input
                  type="text"
                  placeholder={"Enter the Speed Limit"}
                  value={fielddata.speed_limit || ""}
                  className={`data-input-field ${
                    errorData.speed_limit ? "error-input" : "correct-input"
                  }`}
                  disabled={action == "edit" || action == "add" ? false : true}
                  onChange={(e) => {
                    handlefieldchange("speed_limit", e.target.value);
                  }}
                />

                <div
                  className={`error-txt ${
                    showError === "speed" && errorData.speed_limit
                      ? "open-error-txt"
                      : "closed-error-txt"
                  }`}
                >
                  <span>{errorData.speed_limit}</span>
                </div>
              </div>
            </div>
          </div>

          {action === "view" && (
            <Button
              variant="contained"
              style={{
                backgroundColor: "#E94560",
                fontFamily: "Nunito",
                fontWeight: "bold",
                fontSize: "10px",
                color: "white",
              }}
              onClick={() => {
                todo({ ...exist, view: false });
              }}
            >
              Close
            </Button>
          )}
          {action === "edit" && (
            <div className="popup-action-btns">
              <Button
                variant="contained"
                onClick={updateDataStore}
                style={{
                  backgroundColor: "#635985",
                  fontFamily: "Nunito",
                  fontWeight: "bold",
                  fontSize: "10px",
                  color: "white",
                }}
              >
                Save Changes
              </Button>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#E94560",
                  fontFamily: "Nunito",
                  fontWeight: "bold",
                  fontSize: "10px",
                  color: "white",
                }}
                onClick={() => {
                  todo({ ...exist, edit: false });
                }}
              >
                Close
              </Button>
            </div>
          )}
          {action === "add" && (
            <div className="popup-action-btns">
              <Button
                variant="contained"
                onClick={addDataStore}
                style={{
                  backgroundColor: "#635985",
                  fontFamily: "Nunito",
                  fontWeight: "bold",
                  fontSize: "10px",
                  color: "white",
                }}
              >
                Add Data
              </Button>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#E94560",
                  fontFamily: "Nunito",
                  fontWeight: "bold",
                  fontSize: "10px",
                  color: "white",
                }}
                onClick={() => {
                  todo({ ...exist, mainpopup: false });
                }}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Data_Entry_Popup;
