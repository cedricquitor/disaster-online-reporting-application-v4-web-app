import React from "react";
import NoResultsIllu from "../assets/no_results_illu.svg";

const NoResultsFound = ({ resetQuery }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen -mt-36">
      <img src={NoResultsIllu} className="h-[80%] w-[80%] md:h-[50%] md:w-[50%] lg:h-[35%] lg:w-[35%]" alt="Page Not Found Illustration" />
      <h1 className="my-4 text-4xl md:text-5xl font-medium text-primary-green">No results found...</h1>
      <p className="text-primary-gray text-base md:text-sm text-center">
        You can query any of the table's attributes such as <span className="text-secondary-green">Location</span>, <span className="text-secondary-green">City</span>, <span className="text-secondary-green">Disaster</span>,{" "}
        <span className="text-secondary-green">Description</span>, <span className="text-secondary-green">Name</span>, <span className="text-secondary-green">Date</span>, and etc.
      </p>
      <button onClick={() => resetQuery()} className="border-2 border-primary-green mt-10 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
        Reset search query
      </button>
    </div>
  );
};

export default NoResultsFound;
