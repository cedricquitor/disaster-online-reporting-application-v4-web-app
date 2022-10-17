import React from "react";
import { Link } from "react-router-dom";
import PageNotFoundIllu from "../assets/page_not_found_illu.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={PageNotFoundIllu} className="h-[80%] w-[80%] md:h-[50%] md:w-[50%] lg:h-[35%] lg:w-[35%]" alt="Page Not Found Illustration" />
      <h1 className="my-4 text-4xl md:text-5xl font-medium text-primary-green">There's nothing here...</h1>
      <p className="text-primary-gray text-base md:text-sm text-center">
        Uh oh, we can't seem to find the page you're looking for. Maybe the page you're looking for is <span className="text-secondary-green">not found</span> or <span className="text-secondary-green">never existed</span>.
      </p>
      <Link to="/" className="border-2 border-primary-green mt-10 px-10 py-2 rounded-full font-bold text-xl text-primary-green shadow-lg transition hover:bg-secondary-green hover:text-safe-white">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
