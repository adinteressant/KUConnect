import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import { useState } from "react";

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <>
      {/* Navbar */}
      <Navbar setVisibility={setIsSidebarVisible} />

      {/* Main Layout */}
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        {isSidebarVisible && <Sidebar />}

        {/* Content Area */}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
}
