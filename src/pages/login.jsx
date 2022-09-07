import React from "react";
import DoraLogo from "../assets/dora_logo.svg";
import { HiMail, HiKey } from "react-icons/hi";

const Login = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-bg-color">
      {/* Logo */}
      <div className="bg-safe-white px-5 py-8 rounded-2xl mb-8">
        <img src={DoraLogo} alt="DORAv4 Logo" />
      </div>
      {/* Login */}
      <div className="bg-safe-white p-6 px-10 pb-10 rounded-2xl">
        <h1 className="text-safe-black text-2xl font-bold text-center">
          Welcome to DORA, <br />
          Administrator
        </h1>
        <div className="flex flex-col mb-8">
          {/* Username Form Control*/}
          <div className="-mb-2">
            <label htmlFor="email" className="relative top-9 left-3">
              {/* <img src="src\assets\email_icon.svg" alt="Mail icon" /> */}
              <HiMail className="h-6 w-6 text-secondary-gray" />
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="w-full px-10 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
              placeholder="Email Address"
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="relative top-9 left-3">
              {/* <img src="src\assets\password_icon.svg" alt="Mail icon" /> */}
              <HiKey className="h-6 w-6 text-secondary-gray" />
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-10 py-3 rounded-2xl text-sm bg-safe-gray border-2 border-secondary-gray placeholder-primary-gray focus:outline-none focus:border-primary-green focus:bg-safe-white"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <button className="w-full bg-primary-green py-3 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">Log in</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
