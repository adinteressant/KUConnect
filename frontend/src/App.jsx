import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import { useState, useEffect } from "react";
import { startsWith } from "lodash";

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [paddingValue, setPaddingValue] = useState("pl-64");

  const location = useLocation();

  useEffect(() => {
    // Hide sidebar for login and register pages
    if (location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/verifyotp")) {
      setIsSidebarVisible(false);
      setPaddingValue("");
    } else {
      setIsSidebarVisible(true);
      setPaddingValue("pl-64");
    }
  }, [location.pathname]);

  return (
    <>
      {/* Navbar */}
      <Navbar setVisibility={setIsSidebarVisible} setPadding={setPaddingValue} />

      {/* Main Layout */}
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        {isSidebarVisible && <Sidebar />}

        {/* Content Area */}
        <div className={`flex-grow pt-14 ${paddingValue}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}
