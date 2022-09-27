import React, { useState, useEffect, useRef } from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { FaMapMarked } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { geocodeByAddress } from "react-google-places-autocomplete";
import { getLatLng } from "react-places-autocomplete";
import { onValue, ref, set } from "firebase/database";
import { db } from "../configs/firebase";
import Loading from "../components/Loading";

const Evacuation = () => {
  // State managers
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [current, setCurrent] = useState({});

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  // Instantiate AuthContext for use
  const { testContext, logout } = useAuthContext();

  // Modal states and functions
  const [isAddEcModalVisible, setIsAddEcModalVisible] = useState(false);
  const [isViewEcModalVisible, setIsViewEcModalVisible] = useState(false);
  const [isEditEcModalVisible, setIsEditEcModalVisible] = useState(false);
  const [isDeleteEcModalVisible, setIsDeleteEcModalVisible] = useState(false);

  // Close modal handler
  const handleOnClose = () => {
    setIsAddEcModalVisible(false);
    setIsViewEcModalVisible(false);
    setIsEditEcModalVisible(false);
    setIsDeleteEcModalVisible(false);
  };

  // Add evacuation center modal handler
  const handleAddEcModal = () => setIsAddEcModalVisible(true);

  // View evacuation center modal handler
  const handleViewEcModal = (evacuationCenterItem) => {
    setCurrent(evacuationCenterItem);
    setIsViewEcModalVisible(true);
  };

  // Edit evacuation center modal handler
  const handleEditEcModal = (evacuationCenterItem) => {
    setCurrent(evacuationCenterItem);
    setIsEditEcModalVisible(true);
  };

  // Delete evacuation center modal handler
  const handleDeleteEcModal = (evacuationCenterItem) => {
    setCurrent(evacuationCenterItem);
    setIsDeleteEcModalVisible(true);
  };

  // Refs
  const locationRef = useRef();
  const ecNameRef = useRef();
  const cityRef = useRef();

  // Logout handler from AuthContext
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add evacuation center handler from modal
  const handleAddEc = async () => {
    // Check if all input fields have value
    if (ecNameRef.current.value && cityRef.current.value && locationRef.current.value) {
      // If all input fields have value, insert item to real-time database
      try {
        // Get geocode using the input in location textbox
        const geocode = await geocodeByAddress(locationRef.current.value);
        const { lat, lng } = await getLatLng(geocode[0]);

        // Add evacuation center details to database
        set(ref(db, `/EvacuationCenters/${geocode[0].place_id}`), {
          evacuationCenterId: geocode[0].place_id,
          evacuationCenterName: ecNameRef.current.value,
          city: cityRef.current.value,
          location: locationRef.current.value,
          latitude: lat,
          longitude: lng,
        }).then(() => toast.success(`Added ${geocode[0].place_id} to database successfully`));
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      console.log("No value!");
      toast.error("Please fill up all input fields");
    }

    // Close modal after adding the evacuation center
    setIsAddEcModalVisible(false);
  };

  // Query evacuation centers
  const getEvacuationCenters = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/EvacuationCenters");
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setData(snapshot.val());
        setIsLoading(false);
      } else {
        console.error("No data");
      }
    });
  };

  // Fetch evacuation centers at page load
  useEffect(() => {
    getEvacuationCenters();
  }, []);

  return (
    <div className="bg-bg-color flex items-start">
      {/* Navigation */}
      <aside className="flex flex-col justify-between h-screen">
        {/* Upper Part */}
        <div className="h-[80%] w-24 bg-safe-gray rounded-br-2xl">
          <div className="overflow-y-auto py-4 px-4">
            <ul className="space-y-2">
              <li>
                <Link to="/">
                  <img src={DoraHomeIcon} alt="DORAv4 Home Button" />
                </Link>
              </li>
              <li className="pt-48">
                <Link to="/evacuation" className="text-primary-green transition active:text-secondary-green">
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
                <Link to="/map" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
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
      {/* Headings */}
      <div className="container py-6 px-4">
        <h1 className="text-primary-green text-4xl font-medium mb-4">Evacuation Centers</h1>
        <div className="flex flex-row justify-between">
          {/* Search */}
          <div className="flex gap-4">
            <a href="#" className="bg-primary-green px-[.6rem] py-2 rounded-xl shadow-lg transition hover:bg-secondary-green">
              <HiSearch className="text-safe-white h-8 w-8" />
            </a>
            <input
              id="search"
              name="search"
              type="text"
              className="w-[16rem] px-4 py-2 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
              placeholder="Search parameters"
            />
          </div>
          <div className="flex gap-4">
            <a onClick={() => console.log(data)} href="#" className="bg-primary-green px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
              Archive
            </a>
            <a href="#" onClick={handleAddEcModal} className="bg-primary-green px-8 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
              Add EC
            </a>
          </div>
        </div>
        {/* Table Content Here */}
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col w-11/12 xl:w-10/12 2xl:w-5/6 mx-auto mt-8">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-primary-gray sm:rounded-lg">
                  <table className="min-w-full divide-y divide-secondary-green">
                    <thead className="bg-primary-green">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
                          City
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-safe-white divide-y divide-primary-gray">
                      {Object.values(data).map((evacuationCenter) => {
                        const { evacuationCenterId, evacuationCenterName, location, city } = evacuationCenter;
                        return (
                          <tr key={evacuationCenterId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-secondary-green">{evacuationCenterName}</div>
                                  <div className="text-sm text-primary-gray">{location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-safe-black">{city}</div>
                            </td>
                            <td className="py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex gap-4">
                                <button onClick={() => console.log("Test")} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  View
                                </button>
                                <button onClick={() => console.log("Test")} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  Edit
                                </button>
                                <button onClick={() => console.log("Test")} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Add Evacuation Center Modal */}
                  <Modal visible={isAddEcModalVisible} onClose={handleOnClose}>
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-medium text-center text-primary-green">Add Evacuation Center</h1>
                      <div className="mt-6">
                        <div className="flex">
                          <div className="flex flex-col w-[80%]">
                            <label htmlFor="ecname" className="relative text-safe-black">
                              Evacuation Center Name
                            </label>
                            <input
                              id="ecname"
                              name="ecname"
                              type="text"
                              className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                              placeholder="Evacuation Center Name"
                              ref={ecNameRef}
                            />
                          </div>
                          <div className="flex flex-col ml-4">
                            <label htmlFor="city" className="relative text-safe-black">
                              City
                            </label>
                            <input
                              id="city"
                              name="city"
                              type="text"
                              className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                              placeholder="City"
                              ref={cityRef}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label htmlFor="location" className="relative text-safe-black">
                            Location
                          </label>
                          <Autocomplete>
                            <input
                              id="location"
                              name="location"
                              type="text"
                              className="w-full px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                              placeholder="Location"
                              ref={locationRef}
                            />
                          </Autocomplete>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center pb-2">
                      <button onClick={handleOnClose} className="border-2 border-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                        Close
                      </button>
                      <button onClick={handleAddEc} className="bg-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
                        Confirm
                      </button>
                    </div>
                  </Modal>
                  {/* View Evacuation Center */}
                  <Modal>
                    <p>View Evacuation Center</p>
                  </Modal>
                  {/* Edit Evacuation Center */}
                  <Modal>
                    <p>Edit Evacuation Center</p>
                  </Modal>
                  {/* Delete Evacuation Center */}
                  <Modal>
                    <p>Delete Evacuation Center</p>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evacuation;
