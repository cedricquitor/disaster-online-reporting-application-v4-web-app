import React, { useState, useEffect } from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import EvacuationCenterPin from "../assets/pins/evacuation_center_pin.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { FaMapMarked } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, Marker } from "@react-google-maps/api";
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

  // Loading state manager
  const [isLoading, setIsLoading] = useState(false);

  // Instantiate AuthContext for use
  const { testContext, logout } = useAuthContext();

  // List of libraries to inject to JavaScript API Loader
  const [libraries] = useState(["places"]);

  const navigate = useNavigate();

  // Center of map (Currently UST's location)
  const defaultCoordinates = { lat: 14.609817753661206, lng: 120.98943292296173 };

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

  return (
    <div className="bg-bg-color flex items-start">
      {/* Navigation */}
      <aside className="flex flex-col justify-between h-screen fixed z-10">
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
      <div className="absolute flex w-screen top-[5%] justify-center">
        <div className="bg-bg-color p-8 z-10">
          <h1>Sort Evacuation Center by City</h1>
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
                  onClick={() => console.log(evacuationCenter)}
                  onMouseOver={() => console.log({ current: evacuationCenter, type: "Evacuation Center" })}
                  onMouseOut={() => console.log("Out Evac")}
                />
                ;
              </div>
            );
          })}
          {reportData?.map((report) => {
            const location = { lat: Number(report.latitude), lng: Number(report.longitude) };
            return (
              <div key={report.id}>
                <MarkerF position={location} icon={DoraHomeIcon} clickable onClick={() => console.log(report)} onMouseOver={() => console.log({ current: report, type: "Report" })} onMouseOut={() => console.log("Out Report")} />;
              </div>
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
