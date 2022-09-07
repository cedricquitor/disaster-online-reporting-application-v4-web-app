import React from "react";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import { HiSearch, HiFolder, HiOfficeBuilding } from "react-icons/hi";
import { IoLogOut } from "react-icons/io5";

const Evacuation = () => {
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
                <a href="#">
                  {/* <img src="src\assets\reports_icon.svg" alt="Reports Icon" className="mx-auto" /> */}
                  <HiFolder className="h-12 w-12 mx-auto text-secondary-gray" />
                </a>
              </li>
              <li className="pt-6">
                <a href="#">
                  {/* <img src="src\assets\evacuation_center_icon.svg" alt="Evacuation Center Icon" className="mx-auto" /> */}
                  <HiOfficeBuilding className="h-12 w-12 mx-auto text-secondary-gray" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Part */}
        <div className="h-[15%] w-24 bg-safe-gray rounded-tr-2xl">
          <a href="#">
            {/* <img src="src/assets/logout_btn.svg" alt="Logout Button" className="mx-auto mt-8" /> */}
            <IoLogOut className="h-12 w-12 mt-8 mx-auto text-secondary-gray" />
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
            <a href="#" className="bg-primary-green px-10 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
              Archive
            </a>
            <a href="#" className="bg-primary-green px-8 py-2 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">
              Add EC
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evacuation;
