import React, { useState } from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { db } from "../configs/firebase";
import { child, get, onValue, ref } from "firebase/database";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

const Reports = () => {
  const { testContext, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState([]);

  const navigate = useNavigate();

  // Modal states and functions
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOnClose = () => setIsModalVisible(false);
  const handleViewReport = (reportItem) => {
    setCurrent(reportItem);
    setIsModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Query reports
  const getReports = () => {
    setIsLoading(true);
    const dbRef = ref(db, "Reports/");
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

  // Fetch reports at page load
  useEffect(() => {
    getReports();
    console.log(Object.values(data));
  }, []);

  return (
    <div className="bg-bg-color flex items-start overflow-auto">
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
                <Link to="/evacuation" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
                  {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
                  <HiFolder className="h-12 w-12 mx-auto" />
                </Link>
              </li>
              <li className="pt-6">
                <Link to="/reports" className="text-primary-green transition focus:text-secondary-green">
                  {/* <img src="src\assets\evacuation_center_icon.svg" alt="Evacuation Center Icon" className="mx-auto" /> */}
                  <HiOfficeBuilding className="h-12 w-12 mx-auto" />
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
            <a onClick={() => console.log(Object.values(data))} href="#" className="bg-primary-green px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
              Archive
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
                      {Object.values(data).map((report) => {
                        const { reportId, disasterType, address, description, fullName, date } = report;
                        return (
                          <>
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
                              <td className="py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex gap-4">
                                  <button onClick={() => handleViewReport(report)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                    View
                                  </button>
                                  <button onClick={() => console.log(report)} className="text-primary-gray font-medium transition hover:text-primary-green active:text-secondary-green">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <Modal visible={isModalVisible} onClose={handleOnClose}>
                              <div className="flex flex-col items-center">
                                <h1 className="text-2xl font-medium text-primary-green">{current.disasterType}</h1>
                                <p className="text-sm text-primary-gray">{current.reportId}</p>
                              </div>
                              <div>
                                <h2>{current.address}</h2>
                                <h2>{current.date}</h2>
                              </div>
                              <div className="flex">
                                <img src={current.profilePicture} className="h-8 w-8 rounded-full my-auto" alt="Poster's Profile Image" />
                                <p className="my-auto">{current.fullName}</p>
                              </div>
                            </Modal>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
