import { Key, SetStateAction, useEffect, useMemo, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "./Dataentry.css";
import { toast } from "react-toastify";
import Autocomplete from "react-google-autocomplete";
import {
  AiFillEdit,
  AiFillInfoCircle,
  AiFillPlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Draggable from "react-draggable";
import copy from "copy-to-clipboard";

import {
  GoogleMap,
  DirectionsRenderer,
  MarkerF,
} from "@react-google-maps/api";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop,
  CircularProgress,
  styled,
  Button,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { TbExternalLink } from "react-icons/tb";
import { Column } from "../Main_Table/Maintable";
import appService, { DataStoreSegment } from "../../api/endpoints";
import Data_Entry_Popup from "../Data_Entry_Popup/Data_Entry_Popup";
import Deletepopup from "../Delete_Popup/Deletepopup";
import { resetgpsdata, updategpsdata } from "../../store/features/dataentry";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React from "react";
import { RiDragMoveFill } from "react-icons/ri";
import axios from "axios";

const Dataentry = () => {
  const mapData = useSelector((state: any) => state.dataentry.value);
  const dispatch = useDispatch();

  const defaultprops: {
    id: number | null;
    startPoint: string | null;
    endPoint: string | null;
    nearby_police_station: string | null;
    nearby_ambulance: string | null;
    speed_limit: number | null;
    dataPoints?: { lat: number; lng: number }[] | null;
  } = {
    id: null,
    startPoint: null,
    endPoint: null,
    nearby_police_station: null,
    nearby_ambulance: null,
    speed_limit: null,
  };

  const [draggable, showDraggable] = useState({
    start: false,
    stop: false,
  });

  const [speedLimitPoints, setspeedLimitpoints] = useState<{
    startPoint: string;
    endPoint: string;
  }>({
    startPoint: "",
    endPoint: "",
  });

  //   const [search, setSearch] = useState("");
  //   function handlesearch(value: string) {
  //     const modify = value.toUpperCase();

  //     if (modify == "") {
  //       setSearch(modify);
  //     }
  //     if (modify.trim() !== modify || !/^[A-Za-z0-9]+$/.test(modify)) {
  //       return;
  //     }
  //     if (modify.length <= 10) {
  //       setSearch(modify);
  //     }
  //   }

  const [popup, showPopup] = useState({
    mainpopup: false,
    view: false,
    edit: false,
    delete: false,
  });

  const [popupview, setpopupview] = useState(<></>);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 0,
    lng: 0,
  });
  const dir = [{}];

  const [map, setMap] = useState<any>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState<any>(null);
  const [originState, setOriginState] = useState(false);
  const [destinationState, setDestinationState] = useState(false);
  const [speedDirections, setSpeedDirections] = useState<any>(dir);
  const [showSpeed, setShowSpeed] = useState(false);

  const [showTable, setShowTable] = useState(false);

  function updatePopup(
    newvalue: SetStateAction<{
      mainpopup: boolean;
      view: boolean;
      edit: boolean;
      delete: boolean;
    }>
  ) {
    showPopup(newvalue);
  }

  const [isLoading, setisLoading] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
  };

  const [addDataMode, setAddDataMode] = useState<boolean>(false);

  const columns: Column[] = [
    { id: "id", label: "S.no", minWidth: 70 },
    { id: "start_latitude", label: "Start Lat", minWidth: 100 },
    { id: "start_longitude", label: "Start Lng", minWidth: 50 },
    { id: "end_latitude", label: "End Lat", minWidth: 100 },
    { id: "end_longitude", label: "End Lng", minWidth: 50 },
    {
      id: "nearby_police_station",
      label: "Nearby Police Station",
      minWidth: 50,
    },
    {
      id: "nearby_ambulance",
      label: "Nearby Ambulance",
      minWidth: 100,
    },
    {
      id: "speed_limit",
      label: "Speed Limit",
      minWidth: 50,
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

  const [dataPoints, setDataPoints] = useState<
    {
      lat: number;
      lng: number;
    }[]
  >([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation({ lat: userLat, lng: userLng });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const onLoad = (map) => {
    setMap(map);
  };

  const handleAdd = async (startPointStr: string, endPointStr: string) => {
    const startPointArr = startPointStr.split(",").map((item) => item.trim());
    const endPointArr = endPointStr.split(",").map((item) => item.trim());

    if (startPointArr.length != 2 || endPointArr.length != 2)
      toast.warning("Enter a Valid Lat,Lng!!");
    else if (
      startPointArr[0].trim() == "" ||
      startPointArr[1].trim() == "" ||
      endPointArr[0].trim() == "" ||
      endPointArr[1].trim() == ""
    )
      toast.warning("Location Points cannot be empty!!");
    else if (
      !isPresentOnPath(
        {
          lat: Number(startPointArr[0].trim()),
          lng: Number(startPointArr[1].trim()),
        },
        directions.routes
      ) ) toast.warning("Start Point is not on the path!!");    
    else if(
      !isPresentOnPath(
        {
          lat: Number(endPointArr[0].trim()),
          lng: Number(endPointArr[1].trim()),
        },
        directions.routes
      ) ) toast.warning("End Point is not on the path!!");

    else {
      const addData = defaultprops;

      await speedLimitDataPoints();

      addData.startPoint = startPointStr;
      addData.endPoint = endPointStr;
      addData.dataPoints = dataPoints;

      setDataPoints([]);

      showDraggable({ ...draggable, start: false });

      setpopupview(
        <Data_Entry_Popup
          action="add"
          data={addData}
          exist={popup}
          todo={updatePopup}
          calculateDirections={() => calculateDirections()}
        />
      );

      showPopup({ ...popup, mainpopup: true });
      setAddDataMode(false);
    }
  };

  const handleView = (itemID?: any) => {
    showPopup({ ...popup, view: true });
    let data: any[] = [];
    if (itemID) {
      data = mapData.filter((item: DataStoreSegment) => item.id === itemID);
    }

    const viewData = {
      ...data[0],
      startPoint: `${data[0].start_latitude},${data[0].start_longitude}`,
      endPoint: `${data[0].end_latitude},${data[0].end_longitude}`,
    };

    setpopupview(
      <>
        <Data_Entry_Popup
          action="view"
          data={viewData}
          exist={popup}
          todo={updatePopup}
          calculateDirections={() => calculateDirections()}
        />
      </>
    );
  };

  const handleDelete = (itemid?: any) => {
    showPopup({ ...popup, delete: true });
    let data: any = [];

    if (itemid) {
      data = mapData.filter((item: DataStoreSegment) => item.id == itemid);
    }

    setpopupview(
      <Deletepopup
        id={data[0].original_id}
        exist={popup}
        todo={updatePopup}
        type="user"
        calculateDirections={() => calculateDirections()}
      />
    );
  };

  const handleEdit = (itemID?: any) => {
    showPopup({ ...popup, edit: true });
    let data: any[] = [];

    if (itemID) {
      data = mapData.filter((item: DataStoreSegment) => item.id === itemID);
    }

    const updateData = {
      ...data[0],
      startPoint: `${data[0].start_latitude},${data[0].start_longitude}`,
      endPoint: `${data[0].end_latitude},${data[0].end_longitude}`,
    };

    setpopupview(
      <>
        <Data_Entry_Popup
          action="edit"
          data={updateData}
          exist={popup}
          todo={updatePopup}
          calculateDirections={() => calculateDirections()}
        />
      </>
    );
  };

  const handleFormValues = (e: any, field: string) => {
    if (/^[0-9,.]*$/.test(e.target.value)) {
      if (field == "origin") {
        setOrigin(e.target.value);
      } else {
        setDestination(e.target.value);
      }
    }
  };

  const speedLimitDataPoints = async () => {
    const origin = speedLimitPoints.startPoint;
    const destination = speedLimitPoints.endPoint;

    const directionsService = new window.google.maps.DirectionsService();
    await directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      async (result, status) => {
        const route = result?.routes[0];

        route!.legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            step.path.forEach((point) => {
              dataPoints.push({ lat: point.lat(), lng: point.lng() });
            });
          });
        });
      }
    );
  };

  const calculateDirections = async () => {
    dispatch(resetgpsdata());
    setShowSpeed(false);
    if (origin == "" || destination == "") {
      toast.warning("Fill out the fields!!");
      return;
    }

    setDirections(null);

    if (map && origin && destination) {
      setisLoading(true);

      const directionsService = new window.google.maps.DirectionsService();

      await directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true, // Get multiple routes
        },

        async (result, status) => {
          if (status === "OK") {
            await getDataStore(result!.routes);
            // await fetchSegmentLines(result!.routes);
            setDirections(result);
            fitBounds(result!.routes);
          } else toast.error("Error Calculating Directions!!");

          setisLoading(false);
        }
      );
    } else toast.warning("Fill out the fields!!");
  };

  const isPresentOnPath = (
    latLng: { lat: number; lng: number },
    routes: any[]
  ) => {
    const poly = google.maps.geometry.poly;

    let isPresent = false;

    routes.every((route) => {
      const polyLine = new google.maps.Polyline({
        path: route.overview_path,
      });

      const latLngObj = new google.maps.LatLng({
        lat: latLng.lat,
        lng: latLng.lng,
      });

      const isPresentOnEdge = poly.isLocationOnEdge(latLngObj, polyLine, 0.005);

      if (isPresentOnEdge) {
        isPresent = true;
        return false;
      }

      isPresent = false;
      return true;
    });

    return isPresent;
  };

  const filterDataStore = async (
    dataStoreSegments: DataStoreSegment[],
    routes: any[]
  ) => {
    const filteredDataStore: DataStoreSegment[] = [];

    let a = 1;

    dataStoreSegments.forEach((data) => {
      const isValidPoint =
        isPresentOnPath(
          { lat: data.start_latitude, lng: data.start_longitude },
          routes
        ) &&
        isPresentOnPath(
          { lat: data.end_latitude, lng: data.end_longitude },
          routes
        );

      if (isValidPoint) filteredDataStore.push({ ...data, id: a++ });
    });

    dispatch(
      updategpsdata({
        value: filteredDataStore,
      })
    );
    // await speedLimitDirections();
    if (speedDirections) {
      setisLoading(false);
    }
    setShowTable(true);
  };

  const getDataStore = async (routes: any[]) => {
    setisLoading(true);
    const response = await appService.getDataStoreSegment();

    if (response.success) {
      const data: DataStoreSegment[] = response.data;
      toast.success(response.message);
      filterDataStore(data, routes);
      setisLoading(false);
    } else {
      toast.error(response.message);
      setisLoading(false);
    }
  };

  const fitBounds = (routes) => {
    if (map && routes.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      routes.forEach((route) => {
        route.legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            step.path.forEach((point) => {
              bounds.extend(point);
            });
          });
        });
      });
      map.fitBounds(bounds);
    }
  };

  const [clickedLocation, setClickedLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const handleMapClick = (e) => {
    if (e.latLng) {
      const { lat, lng } = e.latLng.toJSON();

      setClickedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });

      map.panTo({ lat, lng });

      const formattedLocation = `${lat},${lng}`;

      // Copy the formatted location to the clipboard
      copy(formattedLocation);
      if (copy(formattedLocation)) {
        toast.info("Lat,Lng Copied to clipboard");
      } else {
        console.error("Error copying to clipboard:", Error);
      }
    }
  };

  const clearDirections = () => {
    setDirections(null);
    setOrigin("");
    setDestination("");
    setShowTable(false);
    setShowSpeed(false);
    setSpeedDirections(null);
    dispatch(resetgpsdata());
    setAddDataMode(false);
  };

  const searchLocation = (
    location: string | google.maps.LatLng,
    type: string
  ) => {
    if (type === "latLng") {
      const { lat, lng } = location as google.maps.LatLng;
      setClickedLocation({
        lat: lat(),
        lng: lng(),
      });
    } else {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location as string }, (results, status) => {
        if (status === "OK") {
          const lat = results![0].geometry.location.lat();
          const lng = results![0].geometry.location.lng();
          setClickedLocation({
            lat: lat,
            lng: lng,
          });
        } else {
          toast.error("Error Finding Address");
        }
      });
    }
  };

  useEffect(() => {
    speedLimitDirections();
    console.log(speedDirections);
  }, [mapData, directions]);


  const speedLimitDirections = async () => {
    console.log("Speed Limit Directions");
    let speedDatas = null;
    if (mapData[0].id == 1) {
      console.log(mapData);
      speedDatas = await Promise.all(
        mapData.map(async (data) => {
          const origin = `${data.start_latitude},${data.start_longitude}`;
          const destination = `${data.end_latitude},${data.end_longitude}`;
          const directions = new window.google.maps.DirectionsService();
          return new Promise((resolve) => {
            directions.route(
              {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === "OK") {
                  resolve(result);
                } else {
                  toast.error("Error Calculating Directions!!");
                  resolve(null);
                }
              }
            );
          });
        })
      );
    }

    // const middlePoints = mapData.map((data: DataStoreSegment) => {
    //   const datas = [
    //     data.middle_point.latitude,
    //     data.middle_point.longitude,
    //     data.speed_limit,
    //   ];
    //   return datas;
    // });
    // setMidPoints(middlePoints);

    console.log(speedDatas);
    setSpeedDirections(speedDatas);
    setShowSpeed(true);
  };  

  const renderMap = useMemo(() => {
    let routeIndex = 0;
    let speedIndex = 0;
    let speedLimitIndex = 0;
    console.log(mapData);
    return (
      <div className="map">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{
            lat:
              clickedLocation.lat === null
                ? userLocation.lat
                : clickedLocation.lat,
            lng:
              clickedLocation.lng === null
                ? userLocation.lng
                : clickedLocation.lng,
          }}
          zoom={10}
          onLoad={onLoad}
          onClick={(e) => {
            handleMapClick(e);
          }}
        >
          {userLocation &&
            clickedLocation.lat === null &&
            clickedLocation.lng === null && (
              <MarkerF
                key="user"
                position={userLocation}
                icon={{
                  url: "https://cdn-icons-png.flaticon.com/512/3279/3279949.png",
                  scaledSize: new google.maps.Size(35, 35),
                }}
              />
            )}

          {clickedLocation.lat && clickedLocation.lng && (
            <div className="marker">
              <MarkerF
                key="clicked"
                position={
                  new google.maps.LatLng({
                    lat: clickedLocation.lat!,
                    lng: clickedLocation.lng!,
                  })
                }
                icon={{
                  url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                  scaledSize: new google.maps.Size(35, 35),
                }}
              />
            </div>
          )}

          {directions &&
            addDataMode &&
            directions.routes.map(() => (
              <DirectionsRenderer
                key={routeIndex++}
                directions={directions}
                routeIndex={routeIndex}
              />
            ))}

          {showSpeed &&
            speedDirections &&
            speedDirections.map((data: any) => {
              return data.routes.map(() => (
                <DirectionsRenderer
                  key={speedIndex++}
                  directions={data}
                  routeIndex={speedIndex}
                  options={{
                    polylineOptions: {
                      strokeColor: "green",
                      strokeOpacity: 0.85,
                      strokeWeight: 7,
                      zIndex: 100,
                    },
                  }}
                ></DirectionsRenderer>
              ));
            })}
          {/* {speedDirections &&
            speedDirections.map((data) => {
              data.routes.map(() => (
                <DirectionsRenderer
                  key={routeIndex++}
                  directions={data}
                  routeIndex={routeIndex}
                ></DirectionsRenderer>
              ));
            })} */}

          {showSpeed &&
            speedDirections &&
            mapData &&
            mapData.map((data: DataStoreSegment) => (
              <div className="marker">
                <MarkerF
                  key={`${data.middle_point.latitude}-${data.middle_point.longitude}-${data.speed_limit}`}
                  position={
                    new google.maps.LatLng({
                      lat: data.middle_point.latitude!,
                      lng: data.middle_point.longitude!,
                    })
                  }
                  // label={`${data.speed_limit}`}
                  label={`${data.speed_limit}Km/Hr`}
                  icon={{
                    url: "https://cdn-icons-png.flaticon.com/512/594/594807.png", // White Round
                    scaledSize: new google.maps.Size(70, 70),
                  }}
                  title={`Speed Limit : ${data.speed_limit} Kmph`}
                  options={{
                    zIndex : 200
                  }}
                />

                <MarkerF
                  key={`${data.middle_point.latitude}-${data.middle_point.longitude}-${data.speed_limit}`}
                  position={
                    new google.maps.LatLng({
                      lat: data.next_point.latitude!,
                      lng: data.next_point.longitude!,
                    })
                  }
                  label={`${
                    speedDirections[
                      speedLimitIndex++
                    ].routes[0].legs[0]
                      .distance.text
                  }`}
                  icon={{
                    url: "https://cdn-icons-png.flaticon.com/512/5853/5853969.png", // Blue Rectangle
                    scaledSize: new google.maps.Size(60, 60),
                  }}
                  title={`Distance : ${
                    speedDirections[
                      --speedLimitIndex
                    ].routes[0].legs[0]
                      .distance.text
                  }`}
                />
              </div>
            ))}
        </GoogleMap>
      </div>
    );
  }, [
    directions,
    clickedLocation,
    userLocation,
    mapData,
    addDataMode,
    speedDirections,
  ]);

  const [info, setInfo] = useState(false);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const showstartDraggable = () => {
    showDraggable({ ...draggable, start: true });
    setAddDataMode(true);
  };

  return (
    // <div style={{ width: "95%", margin: "0 auto", height : "fit-content" }}>
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

      {popup.view && (
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

      <div className="outer-class1">
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
                Origin
              </label>
              <FormControlLabel
                control={
                  <Switch
                    color="warning"
                    // checked={state.textfield}
                    onChange={() => {
                      setOriginState(!originState);
                      setOrigin("");
                    }}
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
              {originState ? (
                <div className="input-field">
                  <input
                    id="location1"
                    type="text"
                    placeholder="Enter Lat,Lng"
                    className="input-field-box"
                    value={origin}
                    onChange={(e) => handleFormValues(e, "origin")}
                  />
                  <div
                    className="input-field__search-icon"
                    onClick={() => {
                      let data: google.maps.LatLng | null = null;
                      if (origin === "")
                        toast.warning("Enter a Valid Origin!!");
                      else {
                        data = new google.maps.LatLng({
                          lat: Number(origin.split(",")[0].trim()),
                          lng: Number(origin.split(",")[1].trim()),
                        });

                        searchLocation(data, "latLng");
                      }
                    }}
                  >
                    <AiOutlineSearch
                      style={{
                        fontSize: "2rem",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="input-field">
                  <Autocomplete
                    placeholder="Enter Location"
                    className="input-field-box"
                    apiKey={"AIzaSyDVTCkC33eoBMXrlYxEycAo5f_gOsy-3xM"}
                    onPlaceSelected={(place) =>
                      setOrigin(place.formatted_address!)
                    }
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    options={{
                      types: ["(regions)"],
                      componentRestrictions: { country: "in" },
                    }}
                  />
                  <div
                    className="input-field__search-icon"
                    onClick={() => {
                      const data: string = "";
                      if (origin.trim().length == 0)
                        toast.warning("Enter a Valid Origin!!");
                      else searchLocation(origin, "address");
                    }}
                  >
                    <AiOutlineSearch
                      style={{
                        fontSize: "2rem",
                      }}
                    />
                  </div>
                </div>
              )}
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
                Destination
              </label>
              <FormControlLabel
                control={
                  <Switch
                    color="warning"
                    onChange={() => {
                      setDestinationState(!destinationState);
                      setDestination("");
                    }}
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
              {destinationState ? (
                <div className="input-field">
                  <input
                    id="location2"
                    type="text"
                    placeholder="Enter Lat,Lng"
                    className="input-field-box"
                    value={destination}
                    onChange={(e) => handleFormValues(e, "destination")}
                  />
                  <div
                    className="input-field__search-icon"
                    onClick={() => {
                      let data: google.maps.LatLng | null = null;
                      if (destination === "")
                        toast.warning("Enter a Valid Destination!!");
                      else {
                        data = new google.maps.LatLng({
                          lat: Number(destination.split(",")[0].trim()),
                          lng: Number(destination.split(",")[1].trim()),
                        });

                        searchLocation(data, "latLng");
                      }
                    }}
                  >
                    <AiOutlineSearch
                      style={{
                        fontSize: "2rem",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="input-field">
                  <Autocomplete
                    placeholder="Enter Location"
                    className="input-field-box"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    apiKey={"AIzaSyDVTCkC33eoBMXrlYxEycAo5f_gOsy-3xM"}
                    onPlaceSelected={(place) => {
                      setDestination(place.formatted_address!);
                    }}
                    options={{
                      types: ["(regions)"],
                      componentRestrictions: { country: "in" },
                    }}
                  />
                  <div
                    className="input-field__search-icon"
                    onClick={() => {
                      const data: string = "";
                      if (destination.trim().length == 0)
                        toast.warning("Enter a Valid Destination!!");
                      else searchLocation(destination, "address");
                    }}
                  >
                    <AiOutlineSearch
                      style={{
                        fontSize: "2rem",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-buttons">
          <button
            className="location-button purple"
            onClick={() => {
              calculateDirections();
            }}
          >
            Calculate Directions
          </button>
          <button className="location-button" onClick={clearDirections}>
            Clear
          </button>
        </div>
      </div>

      <div className="map-container">
        <div className="map-container__top">
          <div className="info-box">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#fff",
                        marginBottom: "0.5rem",
                        backgroundColor: "#2f96b4",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      Tips
                    </h1>

                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      - Click on the map to copy the Lat,Lng Information.
                    </p>

                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      - Click on the marker to add a new location data.
                    </p>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      - The Updation, Deletion and Display of the data can be
                      done from the table below.
                    </p>
                  </div>
                </React.Fragment>
              }
            >
              <div className="info-icon" onClick={() => setInfo(!info)}>
                <AiFillInfoCircle />
              </div>
            </HtmlTooltip>
          </div>
          <Button
            className="map-container__top__btn"
            variant="contained"
            onClick={() => showstartDraggable()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontFamily: "Inter",
              fontWeight: "bold",
              fontSize: "1rem",
              filter: directions ? "" : "grayscale(100%)",
              pointerEvents: directions ? "auto" : "none",
            }}
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
            <p
              style={{
                marginTop: "2px",
              }}
            >
              Add Data
            </p>
          </Button>
        </div>

        {draggable.start && (
          <Draggable handle=".draggable-icon">
            <div className="draggable-box">
              <strong className="dtitle">Enter Speed Limit Points</strong>

              <div className="draggable-icon">
                <RiDragMoveFill />
              </div>

              <div className="draggable-box__content">
                <input
                  type="text"
                  placeholder="Enter Start Lat,Lng"
                  className="input-box"
                  onChange={(e) => {
                    if (/^[0-9,.]*$/.test(e.target.value)) {
                      setspeedLimitpoints({
                        ...speedLimitPoints,
                        startPoint: e.target.value,
                      });
                    }
                  }}
                />

                <input
                  type="text"
                  placeholder="Enter End Lat,Lng"
                  className="input-box"
                  onChange={(e) => {
                    if (/^[0-9,.]*$/.test(e.target.value)) {
                      setspeedLimitpoints({
                        ...speedLimitPoints,
                        endPoint: e.target.value,
                      });
                    }
                  }}
                />
              </div>

              <div className="popup-action-btns">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#655d85",
                    fontFamily: "Nunito",
                    fontWeight: "bold",
                    fontSize: "10px",
                    color: "white",
                  }}
                  onClick={() =>
                    handleAdd(
                      speedLimitPoints.startPoint,
                      speedLimitPoints.endPoint
                    )
                  }
                >
                  Next
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
                    showDraggable({ ...draggable, start: false });
                    setAddDataMode(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Draggable>
        )}

        {
          // This is the map container which renders the map
          renderMap
        }
      </div>

      {showTable && mapData.length > 0 ? (
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
                  {mapData.map(
                    (row: { [x: string]: any; id: Key | null | undefined }) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
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
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      ) : (
        <div
          className="content-holder"
          style={{
            width: "95%",
            height: "10rem",
            border: "1px dashed #ddd",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "40px",
          }}
        >
          <div className="place-holder">
            <p
              className="place-holder-text"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                fontFamily: "Poppins",
                color: "#fff",
              }}
            >
              No Data to Display
            </p>
          </div>
        </div>
      )}

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

export default Dataentry;
