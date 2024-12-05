import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import { useState } from "react";

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [paddingValue, setPaddingValue] = useState('pl-64')

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
