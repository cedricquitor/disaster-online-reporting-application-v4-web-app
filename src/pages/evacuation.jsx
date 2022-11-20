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
import { onValue, ref, remove, set } from "firebase/database";
import { db } from "../configs/firebase";
import Loading from "../components/Loading";
import ReactPaginate from "react-paginate";
import NoResultsFound from "../components/NoResultsFound";
import TruncateText from "../components/TruncateText";

const Evacuation = () => {
  // State managers
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([].slice(0, 8));
  const [tempData, setTempData] = useState([].slice(0, 8));
  const [current, setCurrent] = useState({});

  // Search query state and possible search query items
  const [searchQuery, setSearchQuery] = useState("");
  const searchQueryItems = ["evacuationCenterName", "location", "city"];

  // Search button handler
  const handleSearch = () => {
    if (!searchQuery) {
      setData(tempData);
    } else {
      const filtered = tempData.filter((evacuationCenter) => searchQueryItems.some((item) => evacuationCenter[item].toLowerCase().includes(searchQuery)));
      setData(filtered);

      if (data.length > 6) {
        setPageNumber(0);
      }
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setData(tempData);
      console.log("Setting to temp");
    }
  }, [searchQuery]);

  const handleResetSearch = () => {
    setSearchQuery("");
    setData(tempData);
  };

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  // Instantiate AuthContext for use
  const { testContext, logout } = useAuthContext();

  // Modal states and functions
  const [isAddEcModalVisible, setIsAddEcModalVisible] = useState(false);
  const [isViewEcModalVisible, setIsViewEcModalVisible] = useState(false);
  const [isEditEcModalVisible, setIsEditEcModalVisible] = useState(false);
  const [isArchiveEcModalVisible, setIsArchiveEcModalVisible] = useState(false);

  // Close modal handler
  const handleOnClose = () => {
    setIsAddEcModalVisible(false);
    setIsViewEcModalVisible(false);
    setIsEditEcModalVisible(false);
    setIsArchiveEcModalVisible(false);

    // Uncomment after testing to erase the state and avoid leak
    // setCurrent({});
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
    setEditEcName(evacuationCenterItem.evacuationCenterName);
    setEditEcCity(evacuationCenterItem.city);
    setEditEcLocation(evacuationCenterItem.location);
  };

  // Archive evacuation center modal handler
  const handleArchiveEcModal = (evacuationCenterItem) => {
    setCurrent(evacuationCenterItem);
    setIsArchiveEcModalVisible(true);
  };

  // Archive evacuation center handler from modal
  const handleArchiveEc = () => {
    // Write current evacuation item to ArchivedEvacuationCenters collection
    set(ref(db, `/ArchivedEvacuationCenters/${current.evacuationCenterId}`), {
      evacuationCenterId: current.evacuationCenterId,
      evacuationCenterName: current.evacuationCenterName,
      city: current.city,
      location: current.location,
      latitude: current.latitude,
      longitude: current.longitude,
    }).catch((error) => toast.error(error.message));
    // Delete current evacuation item from EvacuationCenters collection
    remove(ref(db, `/EvacuationCenters/${current.evacuationCenterId}`))
      .then(() => toast.success(`Archived ${current.evacuationCenterName} successfully`))
      .then(() => handleOnClose())
      .catch((error) => toast.error(error.message));
  };

  // Edit evacuation center handler from modal
  const handleEditEc = async () => {
    // Check if all edit input fields have value
    if (editEcName && editEcCity && editEcLocation) {
      // If all input fields is filled replace the value on the realtime database with the current value
      try {
        // Remove realtime database values
        remove(ref(db, `/EvacuationCenters/${current.evacuationCenterId}`)).catch((error) => toast.error(error.message));

        // Get current value's geocode, lat, and lng
        const geocode = await geocodeByAddress(editEcLocation);
        const { lat, lng } = await getLatLng(geocode[0]);

        // Write new evacuation center details to database
        set(ref(db, `/EvacuationCenters/${geocode[0].place_id}`), {
          evacuationCenterId: geocode[0].place_id,
          evacuationCenterName: editEcName,
          city: editEcCity,
          location: editEcLocation,
          latitude: lat,
          longitude: lng,
        })
          .then(() => toast.success("Updated evacuation center successfully"))
          .then(() => handleOnClose());
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please fill up all input fields");
    }
  };

  // Refs
  const ecLocationRef = useRef();
  const [addEcName, setAddEcName] = useState("");
  const [addEcCity, setAddEcCity] = useState("");

  // Edit evacuation center states
  const [editEcLocation, setEditEcLocation] = useState("");
  const [editEcName, setEditEcName] = useState("");
  const [editEcCity, setEditEcCity] = useState("");

  // Add evacuation center handler from modal
  const handleAddEc = async () => {
    // Check if all input fields have value
    if (addEcName && addEcCity && ecLocationRef.current.value) {
      // If all input fields have value, insert item to real-time database
      try {
        // Get geocode using the input in location textbox
        const geocode = await geocodeByAddress(ecLocationRef.current.value).catch((error) => toast.error(error));
        const { lat, lng } = await getLatLng(geocode[0]);

        // Add evacuation center details to database
        set(ref(db, `/EvacuationCenters/${geocode[0].place_id}`), {
          evacuationCenterId: geocode[0].place_id,
          evacuationCenterName: addEcName,
          city: addEcCity,
          location: ecLocationRef.current.value,
          latitude: lat,
          longitude: lng,
        }).then(() => toast.success(`Added ${addEcName} to evacuation center database successfully`));
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
        const ec = snapshot.val();
        const ecList = [];
        for (let id in ec) {
          ecList.push({ id, ...ec[id] });
        }
        setData(ecList);
        setTempData(ecList);
        console.log(ecList);

        // After getting data, set loading to false
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

  // Pagination states
  const [pageNumber, setPageNumber] = useState(0);
  const ecPerPage = 6;
  const pagesVisited = pageNumber * ecPerPage;
  const pageCount = Math.ceil(data.length / ecPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  // const displayEc = data.slice(pagesVisited, pagesVisited + ecPerPage)

  return (
    <div className="bg-bg-color flex items-start overflow-auto">
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
            <a href="#" onClick={() => handleSearch()} className="bg-primary-green px-[.6rem] py-2 rounded-xl shadow-lg transition hover:bg-secondary-green">
              <HiSearch className="text-safe-white h-8 w-8" />
            </a>
            <div className="flex">
              <input
                id="search"
                name="search"
                type="text"
                className="w-[16rem] px-4 py-2 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                placeholder="Search parameters"
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                value={searchQuery}
              />
              <p onClick={() => handleResetSearch()} className="text-secondary-gray text-sm relative -left-12 my-auto cursor-pointer transition hover:text-primary-gray">
                Reset
              </p>
            </div>
          </div>
          <a href="#" onClick={handleAddEcModal} className="bg-primary-green px-8 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
            Add Evac Center
          </a>
        </div>
        {/* Table Content Here */}
        {isLoading ? (
          <Loading />
        ) : data.length === 0 ? (
          <NoResultsFound resetQuery={handleResetSearch} />
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
                      {data.slice(pagesVisited, pagesVisited + ecPerPage).map((evacuationCenter) => {
                        const { evacuationCenterId, evacuationCenterName, location, city } = evacuationCenter;
                        return (
                          <tr key={evacuationCenterId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-secondary-green">{evacuationCenterName}</div>
                                  <div className="text-sm text-primary-gray">
                                    <TruncateText length={75}>{location}</TruncateText>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-safe-black">{city}</div>
                            </td>
                            <td className="py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex gap-4">
                                <button onClick={() => handleViewEcModal(evacuationCenter)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  View
                                </button>
                                <button onClick={() => handleEditEcModal(evacuationCenter)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  Edit
                                </button>
                                <button onClick={() => handleArchiveEcModal(evacuationCenter)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  Archive
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
                      <div className="mt-6 flex flex-col gap-2">
                        <div className="flex flex-col">
                          <label htmlFor="ecname" className="relative text-safe-black">
                            Evacuation Center Name
                          </label>
                          <input
                            id="ecname"
                            name="ecname"
                            type="text"
                            className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                            placeholder="Evacuation Center Name"
                            onChange={(e) => setAddEcName(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="city" className="relative text-safe-black">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                            placeholder="City"
                            onChange={(e) => setAddEcCity(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col">
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
                              ref={ecLocationRef}
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
                  <Modal visible={isViewEcModalVisible} onClose={handleOnClose}>
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl font-medium text-primary-green">{current.evacuationCenterName}</h1>
                      <p className="text-sm text-primary-gray">
                        ID: <TruncateText length={50}>{current.evacuationCenterId}</TruncateText>
                      </p>
                    </div>
                    <div className="flex flex-col mt-4">
                      <h2 className="text-sm text-safe-black">{current.location}</h2>
                      <h2 className="text-sm text-primary-gray">
                        Coordinates: {current.latitude}, {current.longitude}
                      </h2>
                    </div>
                    <div className="flex gap-4 justify-center pb-2">
                      <button onClick={handleOnClose} className="border-2 border-primary-green mt-8 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                        Close
                      </button>
                      <button onClick={() => handleArchiveEc()} className="bg-primary-green mt-8 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
                        Archive
                      </button>
                    </div>
                  </Modal>
                  {/* Edit Evacuation Center */}
                  <Modal visible={isEditEcModalVisible} onClose={handleOnClose}>
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-medium text-center text-primary-green">Edit {current.evacuationCenterName}</h1>
                      <p className="text-sm text-center text-primary-gray">ID: {current.evacuationCenterId}</p>
                      <div className="mt-6 flex flex-col gap-2">
                        <div className="flex flex-col">
                          <label htmlFor="ecname" className="relative text-safe-black">
                            Evacuation Center Name
                          </label>
                          <input
                            id="ecname"
                            name="ecname"
                            type="text"
                            className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                            placeholder="Evacuation Center Name"
                            value={editEcName}
                            onChange={(e) => setEditEcName(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="city" className="relative text-safe-black">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            className="w-[100%] px-4 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                            placeholder="City"
                            value={editEcCity}
                            onChange={(e) => setEditEcCity(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col">
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
                              value={editEcLocation}
                              onChange={(e) => setEditEcLocation(e.target.value)}
                            />
                          </Autocomplete>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center pb-2">
                      <button onClick={handleOnClose} className="border-2 border-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                        Close
                      </button>
                      <button onClick={() => handleEditEc()} className="bg-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
                        Confirm
                      </button>
                    </div>
                  </Modal>
                  {/* Archive Evacuation Center */}
                  <Modal visible={isArchiveEcModalVisible} onClose={handleOnClose}>
                    <p className="text-xl text-center text-safe-black">
                      Are you sure you want to archive <span className="text-primary-green">{current.evacuationCenterName}</span> in <span className="text-primary-green">{current.city} City</span> with ID of{" "}
                      <span className="text-primary-green">{current.evacuationCenterId}</span>
                      <span className="text-primary-green">{current.reportId}</span>?
                    </p>
                    <div className="flex gap-4 justify-center pb-2">
                      <button onClick={handleOnClose} className="border-2 border-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                        Close
                      </button>
                      <button onClick={() => handleArchiveEc()} className="bg-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
                        Confirm
                      </button>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
            {/* Pagination */}
            {data.length > 6 ? (
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                previousLabel="< Prev"
                onPageChange={handlePageChange}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                // renderOnZeroPageCount={null}
                containerClassName="w-fit mt-4 py-3 mx-auto p-2 rounded-lg flex gap-4 bg-safe-white shadow"
                pageLinkClassName="outline outline-secondary-gray rounded-md px-2 py-1 text-primary-gray transition hover:outline-primary-gray active:outline-secondary-green"
                activeLinkClassName="outline-primary-green hover:outline-primary-green"
                nextClassName="text-sm my-auto text-primary-gray transition hover:text-primary-green active:text-secondary-green"
                previousClassName="text-sm my-auto text-primary-gray transition hover:text-primary-green active:text-secondary-green"
                breakClassName="text-primary-gray"
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evacuation;
