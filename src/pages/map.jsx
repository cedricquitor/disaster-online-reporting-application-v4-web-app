import React from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { FaMapMarked } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import googleMapReact from "google-map-react";
import { toast } from "react-toastify";

const Map = () => {
  const { testContext, logout } = useAuthContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-bg-color flex items-start">
      {/* Navigation */}
      <aside className="flex flex-col justify-between h-screen">
        {/* Upper Part */}
        <div className="h-[80%] w-24 bg-safe-gray rounded-br-2xl">
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
        <div className="h-[15%] w-24 bg-safe-gray rounded-tr-2xl">
          <a href="#" onClick={() => handleLogout()} className="text-secondary-gray transition hover:text-primary-green active:text-secondary-green">
            {/* <img src="src/assets/logout_btn.svg" alt="Logout Button" className="mx-auto mt-8" /> */}
            <IoLogOut className="h-12 w-12 mt-8 mx-auto" />
          </a>
        </div>
      </aside>
      {/* Main Content Area */}
      <h1>Map</h1>
    </div>
  );
};

export default Map;
