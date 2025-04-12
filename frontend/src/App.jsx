import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import HomePage from "./pages/Home";
import TravelWall from "./components/my-travel-wall"; // ✅ Import the component
import Chat from './pages/Chat';
import AIItineraryPlanner from "./components/AIItineraryPlanner";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/register" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Main app pages */}
        <Route path="/Home" element={<HomePage />} />
        <Route path="/team-chat" element={<Chat />} />
        <Route path="/my-travel-wall" element={<TravelWall />} /> {/* ✅ New route */}
        <Route path="/itinerary" element={<AIItineraryPlanner />} /> {/* new route */}
        {/* Catch-all for undefined routes */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;



