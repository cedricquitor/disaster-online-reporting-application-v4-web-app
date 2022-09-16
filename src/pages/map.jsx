import React from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { FaMapMarked } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Map = () => {
  const { testContext, logout } = useAuthContext();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAaerEd8Q4K2BQgRVHh4kVXE9YKolhQ5xI",
  });

  const navigate = useNavigate();

  // Center of map
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

  if (!isLoaded) {
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
                <img src={DoraHomeIcon} alt="DORAv4 Home Button" />
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
      <div className="h-screen w-full">
        <GoogleMap center={defaultCoordinates} zoom={16} mapContainerStyle={{ width: "100%", height: "100%" }} options={{ zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
          {/* Markers */}
          <Marker position={defaultCoordinates} icon={DoraHomeIcon} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
