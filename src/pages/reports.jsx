import React, { useState } from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { IoLogOut } from "react-icons/io5";
import { FaMapMarked } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { db } from "../configs/firebase";
import { onValue, ref, remove, set } from "firebase/database";
import ReactPaginate from "react-paginate";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import NoResultsFound from "../components/NoResultsFound";
import TruncateText from "../components/TruncateText";

const Reports = () => {
  // State managers
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [current, setCurrent] = useState([]);

  // Search query state and possible search query items
  const [searchQuery, setSearchQuery] = useState("");
  const searchQueryItems = ["disasterType", "address", "description", "fullName", "date"];

  // Search button handler
  const handleSearch = () => {
    if (!searchQuery) {
      setData(tempData);
    } else {
      const filtered = tempData.filter((report) => searchQueryItems.some((item) => report[item].toLowerCase().includes(searchQuery)));
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
  const [isViewReportModalVisible, setIsViewReportModalVisible] = useState(false);
  const [isArchiveReportModalVisible, setIsArchiveReportModalVisible] = useState(false);
  const [isDeleteReportModalVisible, setIsDeleteReportModalVisible] = useState(false);

  // Close modal handler
  const handleOnClose = () => {
    setIsViewReportModalVisible(false);
    setIsArchiveReportModalVisible(false);
    setIsDeleteReportModalVisible(false);

    // Uncomment after testing to erase the state and avoid leak
    // setCurrent({});
  };

  // View report modal handler
  const handleViewReportModal = (reportItem) => {
    setCurrent(reportItem);
    setIsViewReportModalVisible(true);
  };

  // Archive report modal handler
  const handleArchiveReportModal = (reportItem) => {
    setCurrent(reportItem);
    setIsArchiveReportModalVisible(true);
  };

  // Delete report modal handler
  const handleDeleteReportModal = (reportItem) => {
    setCurrent(reportItem);
    setIsDeleteReportModalVisible(true);
  };

  // Archive report function
  const handleArchiveReport = () => {
    // Write current report item to ArchivedReports collection
    set(ref(db, `/ArchivedReports/${current.reportId}`), {
      address: current.address,
      comments: current.comments,
      date: current.date,
      description: current.description,
      disasterType: current.disasterType,
      fullName: current.fullName,
      latitude: current.latitude,
      longitude: current.longitude,
      profilePicture: current.profilePicture,
      reportId: current.reportId,
      reportPicture: current.reportPicture,
      upvotes: current.upvotes,
      userId: current.userId,
      Upvotes: current.Upvotes ? current.Upvotes : null,
      Comments: current.Comments ? current.Comments : null,
    }).catch((error) => toast.error(error.message));
    // Delete current evacuation item from EvacuationCenters collection
    remove(ref(db, `/Reports/${current.reportId}`))
      .then(() => toast.success(`Archived ${current.disasterType} report successfully`))
      .then(() => handleOnClose())
      .catch((error) => toast.error(error.message));
  };

  // Delete report function
  const handleDeleteReport = () => {
    remove(ref(db, `/Reports/${current.reportId}`))
      .then(() => toast.success(`Deleted ${current.disasterType} report successfully`))
      .then(() => handleOnClose())
      .catch((error) => toast.error(error.message));
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
        setData(reportsList);
        setTempData(reportsList);
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

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch reports at page load
  useEffect(() => {
    getReports();
  }, []);

  // Pagination states
  const [pageNumber, setPageNumber] = useState(0);
  const reportPerPage = 6;
  const pagesVisited = pageNumber * reportPerPage;
  const pageCount = Math.ceil(data.length / reportPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="bg-bg-color flex flex-col md:flex-row items-start overflow-auto h-screen justify-between md:justify-start">
      {/* Navigation */}
      <aside className="hidden md:flex flex-col justify-between h-screen">
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
                <Link to="/evacuation" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
                  {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
                  <HiOfficeBuilding className="h-12 w-12 mx-auto" />
                </Link>
              </li>
              <li className="pt-6">
                <Link to="/reports" className="text-primary-green transition focus:text-secondary-green">
                  {/* <img src="src\assets\evacuation_center_icon.svg" alt="Evacuation Center Icon" className="mx-auto" /> */}
                  <HiFolder className="h-12 w-12 mx-auto" />
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
          <a href="#" onClick={() => handleLogout()} className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
            {/* <img src="src/assets/logout_btn.svg" alt="Logout Button" className="mx-auto mt-8" /> */}
            <IoLogOut className="h-12 w-12 mt-8 mx-auto" />
          </a>
        </div>
      </aside>
      {/* Main Content Area */}
      {/* Headings */}
      <div className="container py-6 px-4">
        <h1 className="text-primary-green text-4xl font-medium mb-4">Disaster Reports</h1>
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
                className="w-[20rem] md:w-[16rem] px-4 py-2 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
                placeholder="Search parameters"
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                value={searchQuery}
              />
              <p onClick={() => handleResetSearch()} className="text-secondary-gray text-sm relative -left-12 my-auto cursor-pointer transition hover:text-primary-gray">
                Reset
              </p>
            </div>
          </div>
        </div>
        {/* Tables Area */}
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
                          Disaster
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-safe-white divide-y divide-primary-gray">
                      {/* Filter and map report items */}
                      {data.slice(pagesVisited, pagesVisited + reportPerPage).map((report) => {
                        const { reportId, disasterType, address, description, fullName, date } = report;
                        return (
                          <tr key={reportId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-secondary-green">{disasterType}</div>
                                  <div className="text-sm text-primary-gray">
                                    <TruncateText length={30}>{address}</TruncateText>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-safe-black">
                                <TruncateText length={30}>{description}</TruncateText>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-safe-black">{fullName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-safe-black">{date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex gap-4">
                                <button onClick={() => handleViewReportModal(report)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  View
                                </button>
                                <button onClick={() => handleArchiveReportModal(report)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  Archive
                                </button>
                                <button onClick={() => handleDeleteReportModal(report)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* View Report Modal */}
                  <Modal visible={isViewReportModalVisible} onClose={handleOnClose}>
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl font-medium text-primary-green">{current.disasterType}</h1>
                      <p className="text-sm text-primary-gray">ID: {current.reportId}</p>
                    </div>
                    <div className="flex flex-col mt-4">
                      <h2 className="text-sm text-safe-black">{current.address}</h2>
                      <h2 className="text-sm text-primary-gray">
                        Coordinates: {current.latitude}, {current.longitude}
                      </h2>
                    </div>
                    <div className="flex flex-col mt-4">
                      <div className="flex justify-between">
                        <div className="flex">
                          <img src={current.profilePicture} className="h-8 w-8 rounded-full my-auto" alt="Disaster Report poster's profile image" />
                          <p className="ml-2 my-auto text-safe-black">{current.fullName}</p>
                        </div>
                        <h2 className="my-auto text-safe-black">{current.date}</h2>
                      </div>
                      <img src={current.reportPicture} className="w-full h-full mt-2 rounded-xl" alt="Disaster Report's attached image" />
                      <p className="mt-2 text-safe-black">Report Description: {current.description}</p>
                      <p className="text-safe-black">
                        Report has {current.upvotes} upvotes and {current.comments} comments
                      </p>
                      <div className="flex gap-4 justify-center pb-2">
                        <button onClick={handleOnClose} className="border-2 border-primary-green mt-8 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                          Close
                        </button>
                        <button onClick={() => handleDeleteReport()} className="bg-primary-green mt-8 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
                          Delete
                        </button>
                      </div>
                    </div>
                  </Modal>
                  {/* Archive Report Center */}
                  <Modal visible={isArchiveReportModalVisible} onClose={handleOnClose}>
                    <p className="text-xl text-center text-safe-black">
                      Are you sure you want to archive a <span className="text-primary-green">{current.disasterType}</span> report on <span className="text-primary-green">{current.date}</span> with ID of{" "}
                      <span className="text-primary-green">{current.reportId}</span>?
                    </p>
                    <div className="flex gap-4 justify-center pb-2">
                      <button onClick={handleOnClose} className="border-2 border-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                        Close
                      </button>
                      <button onClick={() => handleArchiveReport()} className="bg-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
                        Confirm
                      </button>
                    </div>
                  </Modal>
                  {/* Delete Report Modal */}
                  <Modal visible={isDeleteReportModalVisible} onClose={handleOnClose}>
                    <p className="text-xl text-center text-safe-black">
                      Are you sure you want to delete a <span className="text-primary-green">{current.disasterType}</span> report on <span className="text-primary-green">{current.date}</span> with ID of{" "}
                      <span className="text-primary-green">{current.reportId}</span>?
                    </p>
                    <div className="flex gap-4 justify-center pb-2">
                      <button onClick={handleOnClose} className="border-2 border-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
                        Close
                      </button>
                      <button onClick={() => handleDeleteReport()} className="bg-primary-green mt-6 px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
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
      <div className="bg-safe-gray w-full py-2 mt-8 flex flex-row md:hidden">
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
            <Link to="/reports" className="text-primary-green transition active:text-secondary-green">
              {/* <img src="src\assets\evacuation_center_icon.svg" alt="Evacuation Center Icon" className="mx-auto" /> */}
              <HiFolder className="h-16 w-16 mx-auto " />
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/map" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
              {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
              <FaMapMarked className="h-16 w-16 mx-auto" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
