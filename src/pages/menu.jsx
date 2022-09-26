import React from "react";
import { FaMapMarked } from "react-icons/fa";
import { HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-bg-color">
      <div className="flex flex-col gap-4 bg-safe-white mb-8 px-5 py-8 rounded-2xl">
        {/* First 2 Top */}
        <div className="flex flex-row gap-4">
          {/* Left */}
          <Link to="/evacuation" className="w-[12rem] h-[12rem] rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
            <div className="flex justify-between">
              <p className="w-[50%] text-secondary-green text-xl font-bold">Manage Evacuation Center</p>
              <HiOfficeBuilding className="h-8 w-8 text-secondary-green" />
            </div>
            <p className="mt-2 text-base text-primary-gray">Add or update Evacuation Center details</p>
          </Link>
          {/* Right */}
          <Link to="/reports" className="w-[12rem] h-[12rem] rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
            <div className="flex justify-between">
              <p className="w-[50%] text-secondary-green text-xl font-bold">Manage Reports</p>
              <HiFolder className="h-8 w-8 text-secondary-green" />
            </div>
            <p className="mt-2 text-base text-primary-gray">Validate the integrity of the reports</p>
          </Link>
        </div>
        {/* Last 2 Bottom */}
        <div className="flex flex-row gap-4">
          {/* Left */}
          <Link to="map" className="w-[12rem] h-[12rem] rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
            <div className="flex justify-between">
              <p className="w-[50%] text-secondary-green text-xl font-bold">View Map</p>
              <FaMapMarked className="h-8 w-8 text-secondary-green" />
            </div>
            <p className="mt-2 text-base text-primary-gray">Check the status of the map</p>
          </Link>
          {/* Right */}
          <div className="w-[12rem] h-[12rem] rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
            <div className="flex justify-between">
              <p className="w-[50%] text-secondary-green text-xl font-bold">View Users</p>
              <HiFolder className="h-8 w-8 text-secondary-green" />
            </div>
            <p className="mt-2 text-base text-primary-gray">Manage the app's users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
