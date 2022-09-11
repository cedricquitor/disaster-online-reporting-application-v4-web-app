import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Sandbox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState(false);

  // Use UserAuth Contest
  const { testContext, createUser } = useAuthContext();

  // Navigate
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(email, password);
      toast.success(`Successfully created an admin account: ${email}.`);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="bg-bg-color">
        <div className="h-screen flex flex-col gap-4 justify-center items-center">
          <h1>Super Admin Sign up</h1>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="text" name="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Name</label>
              <input type="text" name="password" onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">City</label>
              <input type="text" name="password" onChange={(e) => setCity(e.target.value)} />
            </div>
            <button className="bg-primary-green text-safe-white">Sign up</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Sandbox;
