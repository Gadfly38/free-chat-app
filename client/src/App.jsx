import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FilesPage from "./pages/FilesPage";
import ChatPage from "./pages/ChatPage";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./pages/SettingsPage";
import UpgradePlanPage from "./pages/UpgradePlanPage";

const DashboardLayout = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="md:flex-1 w-full">
        <Outlet /> {/* This is where child routes will render */}
      </div>
    </div>
  );
};

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/auth/login" element={<LoginPage />} />
        <Route path="/app/auth/register" element={<RegisterPage />} />

        {/* Protected routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/files" element={<FilesPage />} />
          <Route path="/app/chat" element={<ChatPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
          <Route path="/app/payment" element={<UpgradePlanPage />} />
        </Route>
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);

export default App;
