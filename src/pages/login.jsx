import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

// Image assets
import DoraLogo from "../assets/dora_logo.svg";
import { HiMail, HiKey } from "react-icons/hi";
import { useEffect } from "react";

const Login = () => {
  // State handlers
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Use UserAuth Contest
  const { auth, signIn, user } = useAuthContext();

  // Instantiate useLocation to get current URL
  const location = useLocation();

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      console.log("Login");
      navigate("/");
      toast.success("Logged in successfully");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  if (user) {
    return <Navigate to="/" state={location} replace />;
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-bg-color">
      {/* Logo */}
      <div className="bg-safe-white px-5 py-8 rounded-2xl mb-8">
        <img src={DoraLogo} alt="DORAv4 Logo" />
      </div>
      {/* Login */}
      <div className="bg-safe-white p-6 px-10 pb-10 rounded-2xl">
        <form onSubmit={handleSubmit}>
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <button className="w-full bg-primary-green py-3 rounded-full font-bold text-xl text-safe-white shadow-lg transition hover:bg-secondary-green">Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
