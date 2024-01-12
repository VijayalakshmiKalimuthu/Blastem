import React, { useEffect, useState } from "react";
import "./DeviceRegistryPopup.css";
import appService from "../../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import {
  addcustomerdata,
  editcustomerdata,
} from "../../store/features/customerdatas";
import { toast } from "react-toastify";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { BiSolidErrorCircle } from "react-icons/bi";

interface DeviceRegistryPopupProps {
  action?: string;
  data?: any;
  exist?: any;
  todo?: any;
  id?: any;
}

const DeviceRegistryPopup: React.FC<DeviceRegistryPopupProps> = ({
  action,
  data,
  exist,
  todo,
  id,
}) => {
  const [fielddata, setfielddata] = useState(data);

  const dispatch = useDispatch();
  const customersdata = useSelector(
    (state: any) => state.customersdata.customersdata
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setfielddata(fielddata);
  }, [fielddata]);

  const [showError, setShowError] = useState<string>("");

  function handlefieldchange(state: string, value: string) {
    switch (state) {
      case "device_id":
        if (value.length === 0) {
          setErrorData({
            ...errorData,
            device_id: "Device ID cannot be empty",
          });
        } else {
          setErrorData({
            ...errorData,
            device_id: null,
          });
        }
        setfielddata({ ...fielddata, device_id: value });

        break;

      case "vehicle_number":
        // eslint-disable-next-line no-case-declarations
        const modify = value.toUpperCase();

        if (modify == "") {
          setfielddata({ ...fielddata, vehicle_number: modify });
        }

        if (modify.trim() !== modify || !/^[A-Za-z0-9]+$/.test(modify)) {
          break;
        }

        if (modify.length <= 4) {
          if (modify.length === 0) {
            setfielddata({ ...fielddata, vehicle_number: modify });
            setErrorData({
              ...errorData,
              vehicle_number: "Vehicle Number cannot be empty",
            });
          } else {
            setfielddata({ ...fielddata, vehicle_number: modify });
            setErrorData({
              ...errorData,
              vehicle_number: "Vehicle Number Invalid",
            });
          }
        } else if (modify.length > 4 && modify.length <= 10) {
          setfielddata({ ...fielddata, vehicle_number: modify });
          setErrorData({ ...errorData, vehicle_number: null });
        }

        break;

      case "name":
        if (value.length === 0) {
          setErrorData({
            ...errorData,
            name: "Field cannot be empty",
          });
        } else if (value.length > 30) {
          setErrorData({
            ...errorData,
            name: "Name cannot be greater than 30 characters",
          });
        } else if (!/^[a-zA-Z ]+$/.test(value)) {
          setErrorData({
            ...errorData,
            name: "Name cannot contain numbers or special characters",
          });
        } else {
          setErrorData({
            ...errorData,
            name: null,
          });
        }

        setfielddata({ ...fielddata, name: value });
        break;

      case "phone":
        const phone_str = value;
        const phone_regex = /^[0-9]*$/;
        if (value.length <= 10 && phone_regex.test(value)) {
          setfielddata({ ...fielddata, phone: phone_str });
        }
        if (value.length < 10)
          setErrorData({
            ...errorData,
            phone: "Contact number should be 10 digits",
          });
        else setErrorData({ ...errorData, phone: null });

        break;

      case "state":
        setfielddata({ ...fielddata, state: value });
        if (value.length === 0)
          setErrorData({ ...errorData, state: "Field cannot be empty" });
        else if (!/^[a-zA-Z ]+$/.test(value))
          setErrorData({ ...errorData, state: "State name invalid" });
        else setErrorData({ ...errorData, state: null });

        break;

      case "city":
        setfielddata({ ...fielddata, city: value });

        if (value.length === 0)
          setErrorData({ ...errorData, city: "Field cannot be empty" });
        else if (!/^[a-zA-Z ]+$/.test(value))
          setErrorData({ ...errorData, city: "City name invalid" });
        else setErrorData({ ...errorData, city: null });

        break;

      case "address":
        setfielddata({ ...fielddata, address: value });
        if (value.length === 0)
          setErrorData({ ...errorData, address: "Field cannot be empty" });
        else setErrorData({ ...errorData, address: null });
        break;

      case "pincode":
        if (value.length <= 6 && /^[0-9]*$/.test(value)) {
          setfielddata({ ...fielddata, pincode: value });
        }

        if (value.length < 6)
          setErrorData({ ...errorData, pincode: "Pincode should be 6 digits" });
        else if (value.length === 6)
          setErrorData({ ...errorData, pincode: null });

        break;

      case "emergency_contact_1":
        if (/^[0-9]*$/.test(value) && value.length <= 10) {
          setfielddata({ ...fielddata, emergency_contact_1: value });
        }

        if (value.length < 10)
          setErrorData({
            ...errorData,
            emergency_contact_1: "Contact number should be 10 digits",
          });
        else if (value.length === 10)
          setErrorData({ ...errorData, emergency_contact_1: null });

        break;

      case "emergency_contact_2":
        if (/^[0-9]*$/.test(value) && value.length <= 10) {
          setfielddata({ ...fielddata, emergency_contact_2: value });
        }

        if (value.length < 10)
          setErrorData({
            ...errorData,
            emergency_contact_2: "Contact number should be 10 digits",
          });
        else if (value.length === 10)
          setErrorData({ ...errorData, emergency_contact_2: null });
        break;

      case "tyre_size":
        if (/^[0-9.]*$/.test(value)) {
          setfielddata({ ...fielddata, tyre_size: value });
        }
        if (value.length === 0)
          setErrorData({ ...errorData, tyre_size: "Field cannot be empty" });
        else setErrorData({ ...errorData, tyre_size: null });

        break;

      case "pulses":
        if (/^[0-9.]*$/.test(value)) {
          setfielddata({ ...fielddata, pulses: value });
        }
        if (value.length === 0)
          setErrorData({ ...errorData, pulses: "Field cannot be empty" });
        else setErrorData({ ...errorData, pulses: null });
        break;

      default:
        break;
    }
  }

  const registerDevice = async () => {
    const isNotValid =
      errorData.device_id ||
      errorData.vehicle_number ||
      errorData.name ||
      errorData.phone ||
      errorData.address ||
      errorData.state ||
      errorData.city ||
      errorData.pincode ||
      errorData.emergency_contact_1 ||
      errorData.emergency_contact_2 ||
      errorData.tyre_size ||
      errorData.pulses;

    if (
      fielddata.device_id === undefined ||
      fielddata.device_id === undefined ||
      fielddata.vehicle_number === undefined ||
      fielddata.name === undefined ||
      fielddata.phone === undefined ||
      fielddata.state === undefined ||
      fielddata.city === undefined ||
      fielddata.address === undefined ||
      fielddata.pincode === undefined ||
      fielddata.emergency_contact_1 === undefined ||
      fielddata.emergency_contact_2 === undefined ||
      fielddata.tyre_size === undefined ||
      fielddata.pulses === undefined
    )
      toast.warning("Please Fill out all the fields!!");
    else if (
      fielddata.device_id === "" ||
      fielddata.vehicle_number === "" ||
      fielddata.name === "" ||
      fielddata.phone.length <= 2 ||
      fielddata.state === "" ||
      fielddata.city === "" ||
      fielddata.address === "" ||
      fielddata.pincode === "" ||
      fielddata.emergency_contact_1 === "" ||
      fielddata.emergency_contact_2 === "" ||
      fielddata.tyre_size === "" ||
      fielddata.pulses === ""
    )
      toast.warning("Please Fill out all the fields!!");
    else if (isNotValid) toast.error("Form Invalid");
    else {
      setIsLoading(true);
      const response = await appService.registerDevice(fielddata);
      if (response.success) {
        setfielddata({
          ...fielddata,
        });
        dispatch(
          addcustomerdata({
            customersdata: fielddata,
            original_id: response.original_id,
          })
        );
        setIsLoading(false);
        toast.success(response.message);
        todo({ ...exist, mainpopup: false });
      } else {
        setIsLoading(false);
        toast.error(response.message);
      }
    }
  };

  const updateDeviceRegistry = async () => {
    if (
      fielddata.device_id === undefined ||
      fielddata.device_id === undefined ||
      fielddata.vehicle_number === undefined ||
      fielddata.name === undefined ||
      fielddata.phone === undefined ||
      fielddata.state === undefined ||
      fielddata.city === undefined ||
      fielddata.address === undefined ||
      fielddata.pincode === undefined ||
      fielddata.emergency_contact_1 === undefined ||
      fielddata.emergency_contact_2 === undefined ||
      fielddata.tyre_size === undefined ||
      fielddata.pulses === undefined
    ) {
      toast.warning("Please Fill out all the fields!!");
    } else if (
      fielddata.device_id === "" ||
      fielddata.vehicle_number === "" ||
      fielddata.name === "" ||
      fielddata.phone === "" ||
      fielddata.state === "" ||
      fielddata.city === "" ||
      fielddata.address === "" ||
      fielddata.pincode === "" ||
      fielddata.emergency_contact_1 === "" ||
      fielddata.emergency_contact_2 === "" ||
      fielddata.tyre_size === "" ||
      fielddata.pulses === ""
    ) {
      toast.warning("Please Fill out all the fields!!");
    } else {
      setIsLoading(true);
      const response = await appService.updateDevice(fielddata);
      if (response.success) {
        const updatedcustomersdata = customersdata.filter(
          (item: { id: any }) => {
            return item.id == id;
          }
        );

        const orgid = updatedcustomersdata[0].original_id;
        delete fielddata.original_id;
        delete fielddata.id;
        delete fielddata.vehicle_number;
        delete fielddata.device_id;

        dispatch(
          editcustomerdata({
            orgid: orgid,
            customersdata: fielddata,
          })
        );
        setIsLoading(false);
        toast.success(response.message);
        todo({ ...exist, edit: false });
      } else {
        setIsLoading(false);
        toast.error(response.message);
      }
    }
  };

  const setError = (value: string) => {
    if (showError === value) setShowError("");
    else setShowError(value);
  };
  const [errorData, setErrorData] = useState<{
    device_id?: string | null;
    vehicle_number?: string | null;
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    state?: string | null;
    city?: string | null;
    pincode?: string | null;
    emergency_contact_1?: string | null;
    emergency_contact_2?: string | null;
    tyre_size?: string | null;
    pulses?: string | null;
  }>({
    device_id: null,
    vehicle_number: null,
    name: null,
    phone: null,
    address: null,
    state: null,
    city: null,
    pincode: null,
    emergency_contact_1: null,
    emergency_contact_2: null,
    tyre_size: null,
    pulses: null,
  });

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
          <h2 className="title">DEVICE REGISTRY</h2>
        </div>

        <div className="mainflex">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mainflex"
          >
            <div className="flex">
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Device ID" className="labels">
                    Device Id
                  </label>
                </div>

                <div
                  className={`field ${
                    errorData.device_id ? "error-field" : ""
                  }`}
                >
                  {errorData.device_id ? (
                    <span
                      style={{
                        color:
                          showError === "device" && errorData.device_id
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("device")}
                      className="error-icon"
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}

                  <input
                    type="text"
                    placeholder={"Enter the Device ID"}
                    value={fielddata.device_id || ""}
                    className={`device-input-field ${
                      errorData.device_id ? "error-input" : "correct-input"
                    }`}
                    disabled={action == "add" ? false : true}
                    onChange={(e) => {
                      handlefieldchange("device_id", e.target.value);
                    }}
                    style={
                      action == "edit"
                        ? {
                            opacity: ".75",
                            cursor: "not-allowed",
                          }
                        : {}
                    }
                  />

                  <div
                    className={`error-txt ${
                      showError === "device" && errorData.device_id
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.device_id}</span>
                  </div>
                </div>
              </div>

              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Vechicle Number" className="labels">
                    Vehicle Number
                  </label>
                </div>
                <div
                  className={`field ${
                    errorData.vehicle_number ? "error-field" : ""
                  }`}
                >
                  {errorData.vehicle_number ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "vehicle" && errorData.vehicle_number
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("vehicle")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}

                  <input
                    type="text"
                    placeholder={"Enter the Vehicle Number"}
                    value={fielddata.vehicle_number || ""}
                    className={`device-input-field ${
                      errorData.vehicle_number ? "error-input" : "correct-input"
                    }`}
                    disabled={action == "add" ? false : true}
                    onChange={(e) => {
                      handlefieldchange("vehicle_number", e.target.value);
                    }}
                    style={
                      action == "edit"
                        ? {
                            opacity: ".75",
                            cursor: "not-allowed",
                          }
                        : {}
                    }
                  />

                  <div
                    className={`error-txt ${
                      showError === "vehicle" && errorData.vehicle_number
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.vehicle_number}</span>
                  </div>
                </div>
              </div>

              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Customer Name" className="labels">
                    Customer Name
                  </label>
                </div>
                <div className={`field ${errorData.name ? "error-field" : ""}`}>
                  {errorData.name ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "name" && errorData.name
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("name")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}
                  <input
                    type="text"
                    placeholder={"Enter the Customer Name"}
                    className={`device-input-field ${
                      errorData.name ? "error-input" : "correct-input"
                    }`}
                    value={fielddata.name || ""}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("name", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "name" && errorData.name
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Contact Number" className="labels">
                    Contact Number
                  </label>
                </div>
                <div
                  className={`field ${errorData.phone ? "error-field" : ""}`}
                >
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
                        padding: "3px 7px",
                        borderRadius: "5px 0 0 5px",
                      }}
                      className="country-code"
                    >
                      +91
                    </span>

                    {errorData.phone ? (
                      <span
                        className="error-icon"
                        style={{
                          color:
                            showError === "phone" && errorData.phone
                              ? "#fff"
                              : "#ef233bd6",
                        }}
                        onClick={() => setError("phone")}
                      >
                        <BiSolidErrorCircle />
                      </span>
                    ) : null}

                    <input
                      type="text"
                      style={{
                        backgroundColor: "#ddd",
                        paddingLeft: "4.5rem",
                      }}
                      placeholder={"Enter the Contact"}
                      value={fielddata.phone || ""}
                      className={`device-input-field ${
                        errorData.phone ? "error-input" : "correct-input"
                      }`}
                      disabled={
                        action == "edit" || action == "add" ? false : true
                      }
                      onChange={(e) => {
                        handlefieldchange("phone", e.target.value);
                      }}
                    />

                    <div
                      className={`error-txt ${
                        showError === "phone" && errorData.phone
                          ? "open-error-txt"
                          : "closed-error-txt"
                      }`}
                    >
                      <span>{errorData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Address" className="labels">
                    Address
                  </label>
                </div>
                <div
                  className={`field ${errorData.address ? "error-field" : ""}`}
                >
                  {errorData.address ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "address" && errorData.address
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("address")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}

                  <input
                    type="text"
                    placeholder={"Enter the Address"}
                    value={fielddata.address || ""}
                    className={`device-input-field ${
                      errorData.address ? "error-input" : "correct-input"
                    }`}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("address", e.target.value);
                    }}
                  />
                  <div
                    className={`error-txt ${
                      showError === "address" && errorData.address
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.address}</span>
                  </div>
                </div>
              </div>

              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="City" className="labels">
                    City
                  </label>
                </div>
                <div className={`field ${errorData.city ? "error-field" : ""}`}>
                  {errorData.city ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "city" && errorData.city
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("city")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}

                  <input
                    type="text"
                    placeholder={"Enter the City" || ""}
                    value={fielddata.city}
                    className={`device-input-field ${
                      errorData.city ? "error-input" : "correct-input"
                    }`}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("city", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "city" && errorData.city
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.city}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="State" className="labels">
                    State
                  </label>
                </div>
                <div
                  className={`field ${errorData.state ? "error-field" : ""}`}
                >
                  {errorData.state ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "state" && errorData.state
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("state")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}

                  <input
                    type="text"
                    placeholder={"Enter the State"}
                    value={fielddata.state || ""}
                    className={`device-input-field ${
                      errorData.state ? "error-input" : "correct-input"
                    }`}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("state", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "state" && errorData.state
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.state}</span>
                  </div>
                </div>
              </div>
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Pincode" className="labels">
                    Pincode
                  </label>
                </div>
                <div
                  className={`field ${errorData.pincode ? "error-field" : ""}`}
                >
                  {errorData.pincode ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "pincode" && errorData.pincode
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("pincode")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}
                  <input
                    type="text"
                    placeholder={"Enter the Pin"}
                    className={`device-input-field ${
                      errorData.pincode ? "error-input" : "correct-input"
                    }`}
                    value={fielddata.pincode || ""}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("pincode", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "pincode" && errorData.pincode
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.pincode}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Emergency-Contact1" className="labels">
                    Emergency Contact - 1
                  </label>
                </div>
                <div
                  className={`field ${
                    errorData.emergency_contact_1 ? "error-field" : ""
                  }`}
                >
                  {errorData.emergency_contact_1 ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "emergency_contact_1" &&
                          errorData.emergency_contact_1
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("emergency_contact_1")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}
                  <input
                    type="text"
                    placeholder={"Enter the Emergency Contact"}
                    value={fielddata.emergency_contact_1 || ""}
                    className={`device-input-field ${
                      errorData.emergency_contact_1
                        ? "error-input"
                        : "correct-input"
                    }`}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("emergency_contact_1", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "emergency_contact_1" &&
                      errorData.emergency_contact_1
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.emergency_contact_1}</span>
                  </div>
                </div>
              </div>
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Energency-Contact2" className="labels">
                    Emergency Contact - 2
                  </label>
                </div>
                <div
                  className={`field ${
                    errorData.emergency_contact_2 ? "error-field" : ""
                  }`}
                >
                  {errorData.emergency_contact_2 ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "emergency_contact_2" &&
                          errorData.emergency_contact_2
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("emergency_contact_2")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}
                  <input
                    type="text"
                    placeholder={"Enter the Emergency Contact"}
                    className={`device-input-field ${
                      errorData.emergency_contact_2
                        ? "error-input"
                        : "correct-input"
                    }`}
                    value={fielddata.emergency_contact_2 || ""}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("emergency_contact_2", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "emergency_contact_2" &&
                      errorData.emergency_contact_2
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.emergency_contact_2}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Tyre_Size" className="labels">
                    Tyre Size
                  </label>
                </div>
                <div
                  className={`field ${
                    errorData.tyre_size ? "error-field" : ""
                  }`}
                >
                  {errorData.tyre_size ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "tyre" && errorData.tyre_size
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("tyre")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}
                  <input
                    type="text"
                    placeholder={"Enter the Tyre Size"}
                    value={fielddata.tyre_size || ""}
                    className={`device-input-field ${
                      errorData.tyre_size ? "error-input" : "correct-input"
                    }`}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("tyre_size", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "tyre" && errorData.tyre_size
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.tyre_size}</span>
                  </div>
                </div>
              </div>
              <div className="field-flex">
                <div className="subtitle">
                  <label htmlFor="Pulses" className="labels">
                    Pulses
                  </label>
                </div>
                <div
                  className={`field ${errorData.pulses ? "error-field" : ""}`}
                >
                  {errorData.pulses ? (
                    <span
                      className="error-icon"
                      style={{
                        color:
                          showError === "pulses" && errorData.pulses
                            ? "#fff"
                            : "#ef233bd6",
                      }}
                      onClick={() => setError("pulses")}
                    >
                      <BiSolidErrorCircle />
                    </span>
                  ) : null}

                  <input
                    type="text"
                    placeholder={"Enter the Pulses"}
                    className={`device-input-field ${
                      errorData.pulses ? "error-input" : "correct-input"
                    }`}
                    value={fielddata.pulses || ""}
                    disabled={
                      action == "edit" || action == "add" ? false : true
                    }
                    onChange={(e) => {
                      handlefieldchange("pulses", e.target.value);
                    }}
                  />

                  <div
                    className={`error-txt ${
                      showError === "pulses" && errorData.pulses
                        ? "open-error-txt"
                        : "closed-error-txt"
                    }`}
                  >
                    <span>{errorData.pulses}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>

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
                onClick={updateDeviceRegistry}
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
                onClick={registerDevice}
                style={{
                  backgroundColor: "#635985",
                  fontFamily: "Nunito",
                  fontWeight: "bold",
                  fontSize: "10px",
                  color: "white",
                }}
              >
                Register
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

export default DeviceRegistryPopup;
