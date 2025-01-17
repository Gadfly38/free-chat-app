import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import UserAvatar from "@/components/UserAvatar";
import { useStore } from "@/hooks/useStore";
// import AnimatedButton from "./AnimatedButton";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.innerWidth >= 768; // Initialize true for md breakpoint and above
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [useremail, setUseremail] = useState("");
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    // setUseremail(user);
    console.log("useremail", user.email);
  }, []);

  const location = useLocation(); // Add this hook

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      dispatch(logout());
      // Redirect to login page
      navigate("/app/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div
      className={`flex min-h-screen bg-gray-100 relative transition-all duration-300 ${
        isSidebarOpen ? "w-80 " : "w-0"
      }`}
    >
      <div
        className={`absolute top-4 z-50 ${
          isSidebarOpen ? "right-4" : "-right-12"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white rounded-full p-1 shadow-md"
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>
      <div
        className={`flex flex-col  justify-between h-full pb-8 ${
          !isSidebarOpen ? "hidden" : ""
        }`}
      >
        <div className="flex flex-col justify-between h-full py-8">
          <nav className="p-4 mt-16">
            <div className="space-y-2">
              {/* <button
              className={`flex text-xl font-bold items-center gap-3 w-full p-3 rounded-lg ${
                isActive("/app/dashboard")
                  ? "bg-gray-200 text-black"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => navigate("/app/dashboard")}
            >
              Home
            </button> */}
              <button
                className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                  isActive("/app/chat")
                    ? "bg-gray-200 text-black"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => navigate("/app/chat")}
              >
                <MessageSquare size={20} />
                Chat
              </button>

              <button
                className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                  isActive("/app/files")
                    ? "bg-gray-200 text-black"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => navigate("/app/files")}
              >
                <FileText size={20} />
                Files
              </button>

              <button
                className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                  isActive("/app/settings")
                    ? "bg-gray-200 text-black"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => navigate("/app/settings")}
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </nav>

          {/* User Profile */}

          <div className="p-4 border-t">
            <div className="flex bg-white rounded-xl p-4">
              <UserAvatar name="Victor" email={user.email} />
            </div>
            <button
              className="mt-8 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-xl p-2"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
        {/* <button
          className={`flex items-center gap-3 w-full p-3 rounded-lg ${
            isActive("/app/payment")
              ? "bg-gray-200 text-black"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => navigate("/app/payment")}
        >
          <Settings size={20} />
          UpgradePlan
        </button> */}
        <button
          className="flex justify-center"
          onClick={() => navigate("/app/payment")}
        >
          <span className="relative flex justify-center ">
            <span className="absolute flex h-full w-full animate-ping rounded-2xl bg-blue-400 opacity-75"></span>
            <span className="relative flex px-4 py-2 rounded-2xl bg-blue-500 text-white">
              Upgrade Plan
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
