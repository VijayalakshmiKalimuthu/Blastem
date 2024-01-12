import React, { useEffect, useState } from "react";
import "./Maintable.css";
import { IoSearch } from "react-icons/io5";
import { AiFillPlusCircle } from "react-icons/ai";
import { TbExternalLink } from "react-icons/tb";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import appService, { DeviceRegistryData } from "../../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { updatecustomerdata } from "../../store/features/customerdatas";
import DeviceRegistryPopup from "../Device_RegistryPopup/DeviceRegistryPopup";
import { toast } from "react-toastify";
import Deletepopup from "../Delete_Popup/Deletepopup";
import {
  Backdrop,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

const Maintable = () => {
  const [device_registry, setDeviceRegistry] = React.useState<
    DeviceRegistryData[]
  >([]);
  const customersdata = useSelector(
    (state:any) => state.customersdata.customersdata
  );
  React.useEffect(() => {
    fetchTableData();
    setSearch("");
  }, []);

  const defaultprops = {
    id: undefined,
    name: undefined,
    device_id: undefined,
    vehicle_number: undefined,
    phone: undefined,
    state: undefined,
    city: undefined,
    address: undefined,
    emergency_contact_1: undefined,
    emergency_contact_2: undefined,
    tyre_size: undefined,
    pulses: undefined,
  };

  const columns: readonly Column[] = [
    { id: "id", label: "S.no", minWidth: 70 },
    { id: "device_id", label: "Device ID", minWidth: 100 },
    {
      id: "vehicle_number",
      label: "Vehicle Number",
      minWidth: 100,
    },
    {
      id: "name",
      label: "Customer Name",
      minWidth: 100,
    },
    {
      id: "phone",
      label: "Contact",
      minWidth: 100,
    },
    {
      id: "view",
      label: "View",
      minWidth: 70,
    },
    {
      id: "edit",
      label: "Edit",
      minWidth: 70,
    },
    {
      id: "delete",
      label: "Delete",
      minWidth: 70,
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    setDeviceRegistry(customersdata);
  }, [customersdata]);
  useEffect(() => {
    setDeviceRegistry(device_registry);
  }, [device_registry]);

  const fetchTableData = async () => {
    setIsLoading(true);
    const response = await appService.getDeviceRegistry();
    if (response.success) {
      setIsLoading(false);
      dispatch(
        updatecustomerdata({
          customersdata: response.data,
        })
      );
    } else {
      setIsLoading(false);
      toast.error(response.message);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [popup, showPopup] = useState({
    mainpopup: false,
    view: false,
    edit: false,
    delete: false,
  });
  const [popupview, setpopupview] = useState(<></>);

  useEffect(() => {
    setpopupview(popupview);
  }, [popupview]);

  function updatePopup(newvalue:any) {
    showPopup(newvalue);
  }

  function handleView(itemid?: any) {
    showPopup({ ...popup, view: true });
    let data:any[] = [];
    if (itemid) {
      data = device_registry.filter((item) => item.id === itemid);
    }
    setpopupview(
      <>
        <DeviceRegistryPopup
          action="view"
          data={data[0]}
          exist={popup}
          todo={updatePopup}
        />
      </>
    );
  }

  function handleEdit(itemid?: any) {
    showPopup({ ...popup, edit: true });
    let data:any[] = [];
    if (itemid) {
      data = device_registry.filter((item) => item.id === itemid);
    }
    setpopupview(
      <>
        <DeviceRegistryPopup
          action="edit"
          data={data[0]}
          exist={popup}
          todo={updatePopup}
          id={itemid}
        />
      </>
    );
  }

  function handleDelete(itemid?: any) {
    showPopup({ ...popup, delete: true });
    let data:any[] = [];
    if (itemid) {
      data = device_registry.filter((item) => item.id === itemid);
    }
    setpopupview(
      <Deletepopup
        id={data[0].original_id}
        vehicle_number={data[0].vehicle_number}
        exist={popup}
        todo={updatePopup}
      />
    );
  }
  const [search, setSearch] = useState("");

  function handlesearch(value: string) {
    if (value == "") {
      setSearch(value);
      setDeviceRegistry(customersdata);
    } 
    
    else if (value.trim() !== value || !/^[A-Za-z0-9]+$/.test(value)){
      return;
    }
    else {
      let modify = value.toUpperCase();

      if (modify.length <= 10) {
        setSearch(modify);
      }

      const tabledata = customersdata.filter((item: { vehicle_number: string; }) => {
        return item.vehicle_number.toUpperCase().includes(modify);
      });

      setDeviceRegistry(tabledata);
    }
  }

  return (
    <div className="section-page">
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      {popup.mainpopup && (
        <div>
          <div
            className="popup"
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeviceRegistryPopup
              data={defaultprops}
              action="add"
              exist={popup}
              todo={updatePopup}
            />
          </div>
        </div>
      )}

      {popup.view && (
        <div>
          <div
            className="popup"
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {popupview}
          </div>
        </div>
      )}

      {popup.edit && (
        <div>
          <div className="popup"></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {popupview}
          </div>
        </div>
      )}
      {popup.delete && (
        <div>
          <div className="popup"></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {popupview}
          </div>
        </div>
      )}

      <div className="section-content">
        <div className="content-top">
          <div className="content-top-left">
            <div className="search-bar">
              <span
                style={{
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IoSearch />
              </span>

              <input
                type="text"
                placeholder="Vehicle Number"
                value={search}
                onChange={(e) => {
                  handlesearch(e.target.value);
                }}

              />
            </div>
          </div>

          <div className="content-top-right">
            <div className="action-btns">
              <Button
                className="action-btn"
                variant="contained"
                onClick={() => showPopup({ ...popup, mainpopup: true })}
                style={{ backgroundColor: "#8375b2" }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AiFillPlusCircle />
                </span>
                <p>Add Device</p>
              </Button>
            </div>
          </div>
        </div>

        <div className="content-table">
          <Paper sx={{ width: "95%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#8375b2",
                          color: "rgba(255, 255, 255, 0.95)",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          fontFamily: "Poppins",
                        }}
                        className="table-head"
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {device_registry.map((row:any) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column:any) => {
                          const value:any = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align="center"
                              style={{
                                fontSize: "1.2rem",
                                fontFamily: "Nunito",
                                color: "rgba(255, 255, 255, 0.95)",
                                backgroundColor: "#5e6268",
                              }}
                            >
                              {column.id === "view" ? (
                                <span
                                  className="view-btn"
                                  onClick={() => handleView(row.id)} // Call handleView with the row id
                                >
                                  <TbExternalLink />
                                </span>
                              ) : column.id === "edit" ? (
                                <span
                                  className="edit-btn"
                                  onClick={() => handleEdit(row.id)} // Call handleEdit with the row id
                                >
                                  <AiFillEdit />
                                </span>
                              ) : column.id === "delete" ? (
                                <span
                                  className="delete-btn"
                                  onClick={() => handleDelete(row.id)} // Call handleDelete with the row id
                                >
                                  <MdDelete />
                                </span>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </div>

      <div
        className="space"
        style={{
          width: "100%",
          height: "5rem",
        }}
      ></div>
      
    </div>
  );
};

export default Maintable;
