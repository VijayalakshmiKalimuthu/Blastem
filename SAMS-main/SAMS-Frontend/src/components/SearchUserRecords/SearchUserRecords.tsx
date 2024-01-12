import {useState,useEffect} from "react";
import "./SearchUserRecords.css";

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {toast } from 'react-toastify';
import { Backdrop, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import appService, { gpsData } from '../../api/endpoints';
import { Column } from "../Main_Table/Maintable";
import Search_Files from "../../assets/Search_Files.svg"
import No_Data from "../../assets/No_Data.svg"


const SearchUserRecords = () => {
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
    const [vehicleNumber,setVehicleNumber]=useState<string>("");
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const device_id="";

    const [filteredData, setFilteredData] = useState<gpsData[]>([]);
    const [numbers,setNumbers]=useState([]);

    const [startSearch,setStartSearch]=useState<boolean>(false);


      const columns: readonly Column[] = [
      { id: 'id', label: 'S.no', minWidth: 70},
      { id: 'device_id', label: 'Device ID', minWidth: 100},
      {
        id: 'vehicle_number',
        label: 'Vehicle Number',
        minWidth: 100,
      },
      {
        id: 'timestamp',
        label: 'Timestamp',
        minWidth: 100,
      },
      {
        id: 'latitude',
        label: 'Latitude',
        minWidth: 100,
      },
      {
        id: 'longitude',
        label: 'Longitude',
        minWidth: 70,
      },
      {
        id: 'speed',
        label: 'Speed (KMPH)',
        minWidth: 70,
      }
    ];


    useEffect(()=>{
      setStartSearch(false);
      getVehicleNumbers();
    },[]);


    const formatDate = (date: Dayjs | null) => {
    if (!date) return '';
    return date.format('YYYY-MM-DD');
  }

  const getVehicleNumbers = async () => {
    setIsLoading(true);
    let response= await appService.getVehicleNumbers()
    if(response.success){
        setIsLoading(false);
        setNumbers(response.data);
    }

    else{
        setIsLoading(false);
        toast.error(response.message);
    }

  }


      const UserSearchData= async ()=>{
        if(vehicleNumber==="") toast.warning("Please fill out all the fields!!");
        else if(startDate===null || endDate===null) toast.warning("Please fill out all the fields!!");
        else if(startDate>endDate) toast.warning("Start Date cannot be greater than End Date!!");

        else{ 
          const startDateStr = formatDate(startDate);
          const endDateStr = formatDate(endDate);
          setIsLoading(true);
          let response = await appService.filterDevice(
              vehicleNumber,
              device_id,
              startDateStr,
              endDateStr
          );
          
          if(response.success){ 
            setStartSearch(true);
            setIsLoading(false);
            setFilteredData(response.data);
            toast.success(response.message);
          }
          else{
            setStartSearch(true);
            setIsLoading(false);
            setFilteredData(response.data);
            toast.error(response.message);
          }

        }
        
      }


    return(
        <>
        {
        isLoading?
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        :null
      } 
      <div className="section1">
         <div className="mainbox2">
          <div className='flex-wrap1'>
            <div className="mainflex1">
              <div className="box-flex1">
                
                <div className="field-flex">
                    <div className="subtitle">
                      <label htmlFor="vehicle number" className="labels">
                        Vehicle Number
                      </label>
                    </div>

                    <div className="box-field">
                      <select style={{cursor:"pointer"}} value={vehicleNumber} onChange={(e)=>{setVehicleNumber(e.target.value)}} className="input-field">
                        <option value="">Select your Vehicle Number</option>
                        {numbers.map((number)=>(<option key={number} value={number}>{number}</option>))}
                      </select>
                    </div>
                  </div>

              </div>
              
              <div className="box-flex1"
              >

                <div className="field-flex">
                  <div className="subtitle" style={{marginBottom : '-7px'}}>
                    <label htmlFor="from date" className="labels">
                      Start Date
                    </label>
                  </div>
                  <div className="field">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']} >
                          <DatePicker 
                            className='picker'
                            value={startDate}
                            onChange={(newValue) => {
                              setStartDate(newValue)
                            }}
                            />
                        </DemoContainer>
                      </LocalizationProvider>
                  </div>
                </div>


                <div className="field-flex">
                  <div className="subtitle" style={{marginBottom : '-7px'}}>
                    <label htmlFor="to date" className="labels">
                      End Date
                    </label>
                  </div>
                  <div className="field">

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']} >
                          <DatePicker 
                            className='picker'
                            value={endDate}  
                            onChange={(newValue) => {
                              setEndDate(newValue)
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>

                  </div>
                </div>  
              </div>
            </div>
          </div>

          <Button style={{backgroundColor : '#D21312'}} variant="contained" 
          onClick={UserSearchData} 
          className='btn'>Search</Button>

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

                <Paper sx={{ width: '95%', overflow: 'hidden' }} >
              
                  <TableContainer sx={{ maxHeight: 500 }} className='ttable-container'>
                    
                    <Table stickyHeader aria-label="sticky table" >
                      
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
                        {filteredData
                          .map((row:any) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
            :null

          }
          

        </div>
        </>
    );
}

export default SearchUserRecords;