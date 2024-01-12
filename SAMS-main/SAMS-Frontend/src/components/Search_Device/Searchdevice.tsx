import { useState, useEffect } from "react";
import "./Searchdevice.css";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { toast } from "react-toastify";
import appService, { gpsData } from "../../api/endpoints";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Column } from "../Main_Table/Maintable";
import Search_Files from "../../assets/Search_Files.svg"
import No_Data from "../../assets/No_Data.svg"


const Searchdevice = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [filteredData, setFilteredData] = useState<gpsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, currentstate] = useState({
    vehicle_number: true,
    device_id: false,
  });

  const [startSearch, setStartSearch] = useState<boolean>(false);

  const columns: readonly Column[] = [
    { id: "id", label: "S.no", minWidth: 70 },
    { id: "device_id", label: "Device ID", minWidth: 100 },
    {
      id: "vehicle_number",
      label: "Vehicle Number",
      minWidth: 100,
    },
    {
      id: "timestamp",
      label: "Timestamp",
      minWidth: 100,
    },
    {
      id: "latitude",
      label: "Latitude",
      minWidth: 100,
    },
    {
      id: "longitude",
      label: "Longitude",
      minWidth: 70,
    },
    {
      id: "speed",
      label: "Speed (KMPH)",
      minWidth: 70,
    },
  ];

  const [searchData, setSearchData] = useState<{
    vehicle_number: string;
    device_id: string;
  }>({
    vehicle_number: "",
    device_id: "",
  });

  useEffect(() => {
    setStartSearch(false);
  }, [])

  const formatDate = (date: Dayjs | null) => {
    if (!date) return "";
    return date.format("YYYY-MM-DD");
  };
;

  const filterDeviceData = async () => {
    if (searchData.vehicle_number === "" && searchData.device_id === "")
      toast.warning("Please fill out all the fields!!");
    else if (startDate === null || endDate === null)
      toast.warning("Please fill out all the fields!!");
    else {
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);
      
      setIsLoading(true);
      const response = await appService.filterDevice(
        searchData.vehicle_number,
        searchData.device_id,
        startDateStr,
        endDateStr
      );

      if (response.success) {
        setIsLoading(false);
        setFilteredData(response.data);
        setStartSearch(true);
        toast.success(response.message);
      } else {
        setIsLoading(false);
        setFilteredData(response.data);
        setStartSearch(true);
        toast.error(response.message);
      }
    }
  };

  const validateVehicleNumber = (value:string)=>{
      let modify = value.toUpperCase();

      if (modify=="") {
          setSearchData({
          ...searchData,
          vehicle_number: modify,
        });
        return;
      }

      
        if (modify.trim() !== modify || !/^[A-Za-z0-9]+$/.test(modify)){
          return;
        }
      if (modify.length <= 10) {
          setSearchData({
          ...searchData,
          vehicle_number: modify,
        });
      }
  }

  useEffect(() => {
    if(state.device_id){
      setSearchData({
        ...searchData,
        vehicle_number: ''
      })
    }else{
      setSearchData({
        ...searchData,
        device_id: ''
      })
    }
  }, [state])

  const changeToggle = ()=>{
    currentstate({
      device_id: !state.device_id,
      vehicle_number: !state.vehicle_number,
    });
  }

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

      <div className="section">
        <div className="mainbox1">
          <div className="flex-wrap">
            <div className="mainflex">
              
              <div className="box-flex">
                <div className="field-flex">
                  <div
                    className="subtitle"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <label htmlFor="vehicle number" className="labels">
                      Vehicle Number
                    </label>
                    <FormControlLabel
                      control={
                        <Switch
                          color="warning"
                          checked={state.vehicle_number}
                          onChange={()=>{changeToggle()}}
                          style={{
                            fontFamily: "Poppins",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                          }}
                        />
                      }
                      label=""
                      className="subtitle"
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginLeft: "1rem",
                      }}
                    />
                  </div>

                  <div className="box-field">
                    <input
                      id="vehicle number"
                      type="text"
                      placeholder="Enter the Vehicle Number"
                      className="input-field"
                      value={searchData.vehicle_number || ""}
                      onChange={(e) => {
                        validateVehicleNumber(e.target.value) 
                      }}
                      disabled={!state.vehicle_number}
                      style={!state.vehicle_number ? { 
                        opacity: "0.3", 
                        cursor : "not-allowed" } : {}}
                    />
                  </div>
                </div>

                <div className="field-flex">
                  <div
                    className="subtitle"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <label htmlFor="vehicle number" className="labels">
                      Device Id
                    </label>
                    <FormControlLabel
                      control={
                        <Switch
                          color="warning"
                          checked={state.device_id}
                          onChange={()=>{changeToggle()}}
                          style={{
                            fontFamily: "Poppins",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                          }}
                        />
                      }
                      label=""
                      className="subtitle"
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginLeft: "1rem",
                      }}
                    />
                  </div>

                  <div className="box-field">
                    <input
                      id="device id"
                      type="text"
                      placeholder="Enter the Device unique ID"
                      className="input-field"
                      value={searchData.device_id}
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          device_id: e.target.value,
                        });
                      }}
                      disabled={!state.device_id}
                      style={!state.device_id ? { 
                        opacity: "0.3",
                        cursor : "not-allowed" 
                      } : {}}
                    />
                  </div>
                </div>
              </div>
              <div className="box-flex">
                <div className="field-flex">
                  <div className="subtitle" style={{ marginBottom: "-7px" }}>
                    <label htmlFor="from date" className="labels">
                      Start Date
                    </label>
                  </div>
                  <div className="field" style={{
                    marginTop : '5px'
                  }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          className="picker"
                          value={startDate}
                          onChange={(newValue) => {
                            setStartDate(newValue);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>

                <div className="field-flex">
                  <div className="subtitle" style={{ marginBottom: "-7px" }}>
                    <label htmlFor="to date" className="labels">
                      End Date
                    </label>
                  </div>
                  <div className="field" style={{
                    marginTop : '5px'
                  }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          className="picker"
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <button onClick={filterDeviceData} className="btn">Search</button> */}
          <Button
            style={{ backgroundColor: "#D21312" }}
            variant="contained"
            onClick={filterDeviceData}
            className="btn"
          >
            Search
          </Button>
        </div>
        {
            !startSearch?
              <div className="placeholder-img">
                <img src={Search_Files} className="img" alt="search" />
                <p className="subs">
                  Search for your vehicle records!!
                </p>
              </div>
            :
            startSearch && filteredData.length===0?
              <div className="placeholder-img">
                <img src={No_Data} className="img" alt="no data" />
                <p className="subs">
                  No Data Found!!
                </p>
              </div>
            :
            startSearch && filteredData.length>0?
              <div className="content-table">
                <Paper sx={{ width: "95%", overflow: "hidden" }}>
                  <TableContainer
                    sx={{ maxHeight: 500 }}
                    className="ttable-container"
                  >
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
                        {filteredData.map((row:any) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
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
                                    {value}
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
            :
            null
          
          }
        
      </div>
    </>
  );
};

export default Searchdevice;
