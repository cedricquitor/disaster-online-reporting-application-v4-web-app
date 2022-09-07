import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Evacuation from "./pages/evacuation";
import Reports from "./pages/reports";
import Map from "./pages/map";
import Sandbox from "./pages/sandbox";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/evacuation" element={<Evacuation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/map" element={<Map />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
