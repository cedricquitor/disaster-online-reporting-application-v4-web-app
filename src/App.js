import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Evacuation from "./pages/evacuation";
import Reports from "./pages/reports";
import Map from "./pages/map";
import Sandbox from "./pages/sandbox";

// React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Menu from "./pages/menu";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/evacuation" element={<Evacuation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/map" element={<Map />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
