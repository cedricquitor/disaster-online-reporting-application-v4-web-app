import { useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { FaMapMarked } from "react-icons/fa";
import { HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useAuthContext } from "../contexts/AuthContext";

const Menu = () => {
  // Instantiate AuthContext for use
  const { user } = useAuthContext();

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  // Push notif state manager
  const [isSendPushNotifVisible, setIsSendPushNotifVisible] = useState(false);
  const [userTokens, setUserTokens] = useState([]);

  // Close modal handler
  const handleOnClose = () => {
    setIsSendPushNotifVisible(false);
  };

  // Send push notif modal handler
  const handleSendPushNotifModal = () => {
    setIsSendPushNotifVisible(true);
  };

  // Sends a push notif to users via POST HTTP request
  const sendPushNotif = () => {
    console.log("Test");
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-bg-color">
      <div className="flex flex-col gap-4 bg-safe-white mb-8 px-6 py-6 rounded-2xl w-[440px]">
        <div className="flex flex-col">
          <p className="mb-2 text-2xl font-bold text-primary-green">Welcome back to DORAv4!</p>
          <p className="text-2xl font-bold text-primary-green">What's the task today?</p>
          <p className="text-sm text-primary-gray">Administrators are reponsible of managing the evacuation centers and ensuring the integrity of the reports by making sure that all reports follow the guidelines</p>
        </div>
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
        <button onClick={handleSendPushNotifModal} className="w-full bg-primary-green mt-2 py-3 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
          Send push notif to users
        </button>
      </div>
      <Modal visible={isSendPushNotifVisible} onClose={handleOnClose}>
        <h1>Send Push Notif</h1>
      </Modal>
    </div>
  );
};

export default Menu;
