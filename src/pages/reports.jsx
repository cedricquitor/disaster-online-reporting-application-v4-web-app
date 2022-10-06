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
import { onValue, ref, remove } from "firebase/database";
import ReactPaginate from "react-paginate";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

const Reports = () => {
  // State managers
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [current, setCurrent] = useState([]);

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  // Instantiate AuthContext for use
  const { testContext, logout } = useAuthContext();

  // Modal states and functions
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Close modal handler
  const handleOnClose = () => {
    setIsViewModalVisible(false);
    setIsDeleteModalVisible(false);

    // Uncomment after testing to erase the state and avoid leak
    // setCurrent({});
  };

  // View report modal handler
  const handleViewReportModal = (reportItem) => {
    setCurrent(reportItem);
    setIsViewModalVisible(true);
  };

  // Delete report modal handler
  const handleDeleteReportModal = (reportItem) => {
    setCurrent(reportItem);
    setIsDeleteModalVisible(true);
  };

  // Delete report function
  const handleDeleteReport = () => {
    remove(ref(db, `/Reports/${current.reportId}`))
      .then(() => toast.success(`Deleted ${current.disasterType} report with ID of ${current.reportId} successfully`))
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
        console.log(reportsList);

        // For Pagination
        setCurrentData(reportsList.slice(itemOffset, itemOffset + itemsPerPage));
        setPageCount(Math.ceil(reportsList.length / itemsPerPage));

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

  // Pagination States
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  // Items per page
  const itemsPerPage = 2;

  // Pagination
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentData(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

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
            <a
              onClick={() => (current.length === 0 ? console.log("No current found!", current) : console.log("Current: ", current))}
              href="#"
              className="bg-primary-green px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green"
            >
              Archive
            </a>
            <a onClick={() => console.log(currentData)} href="#" className="bg-primary-green px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
              Test Data
            </a>
          </div>
        </div>
        {/* Tables Area */}
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
                      {currentData.map((report) => {
                        const { reportId, disasterType, address, description, fullName, date } = report;
                        return (
                          <tr key={reportId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-secondary-green">{disasterType}</div>
                                  <div className="text-sm text-primary-gray">{address}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-safe-black">{description}</div>
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
                  <Modal visible={isViewModalVisible} onClose={handleOnClose}>
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
                  {/* Delete Report Modal */}
                  <Modal visible={isDeleteModalVisible} onClose={handleOnClose}>
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
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Prev"
              renderOnZeroPageCount={null}
              containerClassName="w-fit mt-4 py-3 mx-auto p-2 rounded-lg flex gap-4 bg-safe-white shadow"
              pageLinkClassName="outline outline-secondary-gray rounded-md px-2 py-1 text-primary-gray transition hover:outline-primary-gray active:outline-secondary-green"
              activeLinkClassName="outline-primary-green hover:outline-primary-green"
              nextClassName="text-sm my-auto text-primary-gray transition hover:text-primary-green active:text-secondary-green"
              previousClassName="text-sm my-auto text-primary-gray transition hover:text-primary-green active:text-secondary-green"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
