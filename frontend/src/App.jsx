import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import { useState } from 'react'

export default function App() {

  const[isSidebarVisible,setIsSidebarVisible] = useState(true);

  return(
    <>
      <Navbar setVisibility={setIsSidebarVisible}/>
      <div className="flex h-screen bg-gray-100">
      {isSidebarVisible && <Sidebar/>}
      <Outlet/>
      </div>
    </>
  );
}
