import React from "react";
import LoadingIllu from "../assets/loading_illu.svg";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center my-16">
      <img src={LoadingIllu} className="h-[25%] w-[25%]" alt="Loading Illustration" />
      <h1 className="my-4 text-5xl font-medium text-safe-black">Fetching data...</h1>
    </div>
  );
};

export default Loading;
