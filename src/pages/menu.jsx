import React, { useState, useEffect, useRef } from "react";
import { FaMapMarked } from "react-icons/fa";
import { HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { db } from "../configs/firebase";
import { onValue, ref } from "firebase/database";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Menu = () => {
  // Instantiate AuthContext for use
  const { user } = useAuthContext();

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  // State manager
  const [isLoading, setIsLoading] = useState(false);
  const [areThereTokens, setAreThereTokens] = useState(false);

  // Push notif state manager
  const [isSendPushNotifVisible, setIsSendPushNotifVisible] = useState(false);
  const [userTokens, setUserTokens] = useState([]);

  // Get user tokens from realtime database
  const getUserTokens = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/Tokens");

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const tokens = snapshot.val();
        const tokensList = [];
        for (let id in tokens) {
          tokensList.push(tokens[id].token);
        }

        setUserTokens(tokensList);
        setAreThereTokens(true);
        console.log(tokensList);

        setIsLoading(false);
      } else {
        // If there are no user tokens available
        setAreThereTokens(false);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getUserTokens();
  }, []);

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

    const data = {
      registration_ids: userTokens,
      notification: {
        title: pushNotifTitleRef.current.value,
        body: pushNotifBodyTextRef.current.value,
      },
    };

    const url = "https://fcm.googleapis.com/fcm/send";

    if (pushNotifTitleRef.current.value && pushNotifBodyTextRef.current.value) {
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "key=AAAAVh7Sz58:APA91bHSgorqf8ukz4jLwum0PBulpNHrGtkwr2-d1Pz6PfB3bolhBh28XEjx7b1UCAq98vhOuBwcwdHCmjJDf2yD-ZiDj4TpGtfp3X3SOz4ToJJmRM_6j_PN2n6CP43jcZZdNnjE7nlo",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success("Push notification successfully sent, server responded with HTTP 200");
          } else {
            toast.info(`Server responded with HTTP ${response.status}`);
          }

          console.log(data);
          // Close modal
          handleOnClose();
        })
        .catch((error) => {
          console.log(error);
          toast.error("An error on sending push notif has occured");
        });
    } else {
      toast.error("Please fill up all input fields");
    }
  };

  // Refs
  const pushNotifTitleRef = useRef();
  const pushNotifBodyTextRef = useRef();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-bg-color">
      <div className="flex flex-col gap-4 bg-safe-white mb-8 px-6 py-6 rounded-2xl w-[440px]">
        <div className="flex flex-col">
          <p className="mb-2 text-2xl font-bold text-primary-green">Welcome back to DORAv4!</p>
          <p className="text-2xl font-bold text-primary-green">What's the task today?</p>
          <p className="text-sm text-primary-gray">Administrators are reponsible of managing the evacuation centers and ensuring the integrity of the reports by making sure that all reports follow the guidelines</p>
        </div>
        {/* Menu Items */}
        <Link to="/evacuation" className="w-full rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-secondary-green text-xl font-bold">Manage Evacuation Center</p>
              <p className="text-base text-primary-gray">Add or update Evacuation Center details</p>
            </div>
            <HiOfficeBuilding className="h-8 w-8 my-auto text-secondary-green" />
          </div>
        </Link>
        <Link to="/reports" className="w-full rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-secondary-green text-xl font-bold">Manage Reports</p>
              <p className="text-base text-primary-gray">Validate the integrity of the reports</p>
            </div>
            <HiFolder className="h-8 w-8 my-auto text-secondary-green" />
          </div>
        </Link>
        <Link to="/map" className="w-full rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-secondary-green text-xl font-bold">View Map</p>
              <p className="text-base text-primary-gray">Check the status of the map</p>
            </div>
            <FaMapMarked className="h-8 w-8 my-auto text-secondary-green" />
          </div>
        </Link>
        <button onClick={handleSendPushNotifModal} className="w-full bg-primary-green mt-2 py-3 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
          Send push notif to users
        </button>
      </div>
      <Modal visible={isSendPushNotifVisible} onClose={handleOnClose}>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium text-center text-primary-green">Send a push notification</h1>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="pushnotiftitle" className="relative text-safe-black">
                Push Notification Title
              </label>
              <input
                id="pushnotiftitle"
                name="pushnotiftitle"
                type="text"
                className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                placeholder="Push Notification Title"
                ref={pushNotifTitleRef}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="pushnotifbodytext" className="relative text-safe-black">
                Body Text
              </label>
              <input
                id="pushnotifbodytext"
                name="pushnotifbodytext"
                type="text"
                className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                placeholder="Body Text"
                ref={pushNotifBodyTextRef}
              />
            </div>
          </div>
          <button onClick={() => sendPushNotif()} className="w-full bg-primary-green mt-6 py-3 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
            Send push notif
          </button>
          {areThereTokens ? null : <p className="mt-2 text-sm text-center text-[#b91c1c]">There are no users currently logged in to receive a push notification</p>}
        </div>
      </Modal>
    </div>
  );
};

export default Menu;
