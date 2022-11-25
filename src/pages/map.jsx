import React, { useState, useEffect } from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import EvacuationCenterPin from "../assets/pins/evacuation_center_pin.svg";
import EarthquakePin from "../assets/pins/earthquake_pin.svg";
import FirePin from "../assets/pins/fire_pin.svg";
import FloodPin from "../assets/pins/flood_pin.svg";
import HeavyRainPin from "../assets/pins/heavy_rain_pin.svg";
import LandslidePin from "../assets/pins/landslide_pin.svg";
import TsunamiPin from "../assets/pins/tsunami_pin.svg";
import TyphoonPin from "../assets/pins/typhoon_pin.svg";
import VolcanicEruptionPin from "../assets/pins/volcanic_eruption_pin.svg";
import { HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { FaMapMarked } from "react-icons/fa";
import { IoCloseOutline, IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { onValue, ref } from "firebase/database";
import { db } from "../configs/firebase";

const Map = () => {
  // Reports and evacuation data state manager
  const [ecData, setEcData] = useState([]);
  const [tempEcData, setTempEcData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [tempReportData, setTempReportData] = useState([]);

  // Currently hovered/selected state
  const [current, setCurrent] = useState({});

  // Loading state manager
  const [isLoading, setIsLoading] = useState(false);

  // Instantiate AuthContext for use
  const { logout } = useAuthContext();

  // List of libraries to inject to JavaScript API Loader
  const [libraries] = useState(["places"]);

  const navigate = useNavigate();

  // Center of map (Currently UST's location)
  const [defaultCoordinates, setdefaultCoordinates] = useState({ lat: 14.609817753661206, lng: 120.98943292296173 });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Query evacuation centers
  const getEvacuationCenters = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/EvacuationCenters");

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const ec = snapshot.val();
        const ecList = [];
        for (let id in ec) {
          ecList.push({ id, ...ec[id] });
        }
        setEcData(ecList);
        setTempEcData(ecList);
        console.log(ecList);

        // After getting data, set loading to false
        setIsLoading(false);
      } else {
        console.error("No data");
      }
    });
  };

  // Query reports
  const getReports = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/Reports");

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        // Test if we can convert it to an array
        const reports = snapshot.val();
        const reportsList = [];
        for (let id in reports) {
          reportsList.push({ id, ...reports[id] });
        }
        setReportData(reportsList);
        setTempReportData(reportsList);
        console.log(reportsList);

        // For Pagination
        // setCurrentData(reportsList.slice(itemOffset, itemOffset + itemsPerPage));
        // setPageCount(Math.ceil(reportsList.length / itemsPerPage));

        setIsLoading(false);
      } else {
        console.error("No data");
      }
    });
  };

  // Fetch evacuation centers and reports at page load
  useEffect(() => {
    getEvacuationCenters();
    getReports();
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  // If any of the loading state is True, return Loading.jsx component
  if (!isLoaded || isLoading) {
    return <Loading />;
  }

  // Function to determine what disaster report icon to display
  const iconSwitch = (disasterType) => {
    switch (disasterType) {
      case "Earthquake":
        return EarthquakePin;
      case "Fire":
        return FirePin;
      case "Flood":
        return FloodPin;
      case "Heavy Rain":
        return HeavyRainPin;
      case "Landslide":
        return LandslidePin;
      case "Tsunami":
        return TsunamiPin;
      case "Typhoon":
        return TyphoonPin;
      case "Volcanic Eruption":
        return VolcanicEruptionPin;
      default:
        return DoraHomeIcon;
    }
  };

  const filterSwitch = (filter) => {
    switch (filter) {
      case "all":
        setEcData(tempEcData);
        setReportData(tempReportData);
        toast.success("Now displaying all markers");
        break;
      case "reports":
        setEcData([]);
        setReportData(tempReportData);
        toast.success("Now displaying all disaster report markers");
        break;
      case "ec":
        setEcData(tempEcData);
        setReportData([]);
        toast.success("Now displaying all evacuation center markers");
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-bg-color flex flex-col md:flex-row items-start">
      {/* Navigation */}
      <aside className="hidden md:flex flex-col justify-between h-screen fixed z-10">
        {/* Upper Part */}
        <div className="h-[80%] w-24 bg-safe-gray rounded-br-2xl outline outline-2 outline-primary-gray">
          <div className="overflow-y-auto py-4 px-4">
            <ul className="space-y-2">
              <li>
                <Link to="/">
                  <img src={DoraHomeIcon} alt="DORAv4 Home Button" />
                </Link>
              </li>
              <li className="pt-48">
                <Link to="/evacuation" className="text-secondary-gray transition hover:text-primary-green active:text-secondary-green">
                  {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
                  <HiOfficeBuilding className="h-12 w-12 mx-auto" />
                </Link>
              </li>
              <li className="pt-6">
                <Link to="/reports" className="text-secondary-gray transition hover:text-primary-green active:text-secondary-green">
                  {/* <img src="src\assets\evacuation_center_icon.svg" alt="Evacuation Center Icon" className="mx-auto" /> */}
                  <HiFolder className="h-12 w-12 mx-auto " />
                </Link>
              </li>
              <li className="pt-6">
                <Link to="/map" className="text-primary-green transition active:text-secondary-green">
                  {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
                  <FaMapMarked className="h-12 w-12 mx-auto" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Part */}
        <div className="h-[15%] w-24 bg-safe-gray rounded-tr-2xl outline outline-2 outline-primary-gray">
          <a href="#" onClick={() => handleLogout()} className="text-secondary-gray transition hover:text-primary-green active:text-secondary-green">
            {/* <img src="src/assets/logout_btn.svg" alt="Logout Button" className="mx-auto mt-8" /> */}
            <IoLogOut className="h-12 w-12 mt-8 mx-auto" />
          </a>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="absolute flex left-[25%] top-[1%] md:left-0 md:top-[5%] justify-center md:w-screen">
        <div className="bg-safe-white py-4 px-8 z-10 text-center rounded-2xl shadow-md">
          <h1 className="text-lg font-medium text-primary-green">Filter Markers</h1>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button onClick={() => filterSwitch("all")} className="bg-primary-green py-2 px-4 rounded-full font-bold text-sm text-safe-white shadow-lg transition hover:bg-secondary-green">
              Show All
            </button>
            <button onClick={() => filterSwitch("reports")} className="bg-primary-green py-2 px-4 rounded-full font-bold text-sm text-safe-white shadow-lg transition hover:bg-secondary-green">
              Disaster Reports
            </button>
            <button onClick={() => filterSwitch("ec")} className="bg-primary-green py-2 px-4 rounded-full font-bold text-sm text-safe-white shadow-lg transition hover:bg-secondary-green">
              Evacuation Centers
            </button>
          </div>
        </div>
      </div>
      <div className="h-screen w-full z-0">
        <GoogleMap center={defaultCoordinates} zoom={16} mapContainerStyle={{ width: "100%", height: "100%" }} options={{ zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
          {/* Markers */}
          {ecData?.map((evacuationCenter) => {
            const location = { lat: evacuationCenter.latitude, lng: evacuationCenter.longitude };
            return (
              <div key={evacuationCenter.id}>
                <MarkerF
                  position={location}
                  icon={EvacuationCenterPin}
                  clickable
                  onClick={() => setCurrent({ data: evacuationCenter, type: "Evacuation Center" })}
                  onMouseOver={() => console.log({ data: evacuationCenter, type: "Evacuation Center" })}
                  onMouseOut={() => console.log("Evac Out")}
                />
                ;
              </div>
            );
          })}
          {reportData?.map((report) => {
            const location = { lat: Number(report.latitude), lng: Number(report.longitude) };
            return (
              <div key={report.id}>
                <MarkerF
                  position={location}
                  icon={iconSwitch(report.disasterType)}
                  clickable
                  onClick={() => setCurrent({ data: report, type: "Report" })}
                  onMouseOver={() => console.log({ data: report, type: "Report" })}
                  onMouseOut={() => console.log("Out Report")}
                />
                ;
              </div>
            );
          })}
        </GoogleMap>
        {/* Hover or clicked items */}
        {Object.keys(current).length === 0 ? (
          <div className="absolute flex w-screen bottom-[5%] justify-center">
            <h1 className="text-lg font-medium text-secondary-green">Click on a marker to view details</h1>
          </div>
        ) : current?.type === "Evacuation Center" ? (
          <div className="absolute flex w-screen bottom-[5%] justify-center">
            <div className="bg-safe-white p-8 z-10 text-center rounded-2xl shadow-md">
              <div className="flex justify-end -mt-6 -mr-6">
                <IoCloseOutline onClick={() => setCurrent({})} className="h-8 w-8 text-primary-gray cursor-pointer transition hover:text-primary-green active:text-secondary-green" />
              </div>
              <h1 className="text-xl font-medium text-primary-green">
                {current?.data?.evacuationCenterName} <span className="text-primary-gray font-normal">in</span> {current?.data?.city}
              </h1>
              <h2 className="text-sm text-safe-black">{current?.data?.location}</h2>
              <h2 className="text-sm text-primary-gray">
                Coordinates: {current?.data?.latitude}, {current?.data?.longitude}
              </h2>
            </div>
          </div>
        ) : (
          <div className="absolute flex w-screen bottom-[5%] justify-center">
            <div className="bg-safe-white p-8 z-10 text-center rounded-2xl shadow-md">
              <div className="flex justify-end -mt-6 -mr-6">
                <IoCloseOutline onClick={() => setCurrent({})} className="h-8 w-8 text-primary-gray cursor-pointer transition hover:text-primary-green active:text-secondary-green" />
              </div>
              <h1 className="text-xl font-medium text-primary-green">
                {current?.data?.disasterType} Report <span className="font-normal text-primary-gray">by</span> {current?.data?.fullName}
              </h1>
              <h2 className="text-sm text-safe-black">{current?.data?.address}</h2>
              <h2 className="text-sm text-primary-gray">
                Coordinates: {current?.data?.latitude}, {current?.data?.longitude}
              </h2>
              <div className="flex flex-col mt-2">
                <h2 className="text-sm text-safe-black">Report Date: {current?.data?.date}</h2>
                <h2 className="text-sm text-safe-black">
                  Report Stats: {current?.data?.upvotes} upvotes and {current?.data?.comments} comments
                </h2>
                <h2 className="text-sm text-safe-black">Report Description: {current?.data?.description}</h2>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-safe-gray w-full py-2 flex flex-row md:hidden">
        <ul className="flex flex-row-reverse mx-auto gap-4">
          <li>
            <Link to="/">
              <img src={DoraHomeIcon} alt="DORAv4 Home Button" className="w-16 h-16" />
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/evacuation" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
              {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
              <HiOfficeBuilding className="h-16 w-16 mx-auto" />
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/reports" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
              {/* <img src="src\assets\evacuation_center_icon.svg" alt="Evacuation Center Icon" className="mx-auto" /> */}
              <HiFolder className="h-16 w-16 mx-auto " />
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/map" className="text-primary-green transition active:text-secondary-green">
              {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
              <FaMapMarked className="h-16 w-16 mx-auto" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Map;
