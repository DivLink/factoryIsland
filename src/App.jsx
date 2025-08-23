// App.jsx
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/authcontext"; // ✅ Use context instead

import Hero from "./pages/hero";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import AdminDashboard from "./pages/admindashboard";

function App() {
  const { user } = useAuth(); // ✅ Now access user via context

  return (
    <Routes>
      <Route path="/" element={<Hero currentUser={user} />} />
      <Route path="/dashboard" element={<Dashboard currentUser={user} />} />
      <Route path="/profile" element={<Profile currentUser={user} />} />
      <Route path="/admindashboard" element={<AdminDashboard currentUser={user} />} />
    </Routes>
  );
}

export default App;
