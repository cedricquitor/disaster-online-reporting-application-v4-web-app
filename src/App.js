import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Evacuation from "./pages/evacuation";
import Reports from "./pages/reports";
import Map from "./pages/map";
import Sandbox from "./pages/sandbox";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/evacuation" element={<Evacuation />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/map" element={<Map />} />
      <Route path="/sandbox" element={<Sandbox />} />
    </Routes>
  );
}

export default App;
