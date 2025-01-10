import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import { useState, useEffect } from "react";

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [paddingValue, setPaddingValue] = useState("pl-64");
  const location = useLocation();

  const [searchTrait,setSearchTrait] = useState("");
  const [userPosts,setUserPosts] = useState([]);
  const [userProfile,setUserProfile] = useState({});

  useEffect(() => {
    // Hide sidebar for login and register pages
    if (location.pathname==="/" ||location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/verifyotp")) {
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
    {isSidebarVisible&&<Navbar setVisibility={setIsSidebarVisible} setPadding={setPaddingValue} searchTrait={searchTrait} setSearchTrait={setSearchTrait} userProfile={userProfile} setUserProfile={setUserProfile}/>}

      {/* Main Layout */}
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        {isSidebarVisible && <Sidebar userPosts={userPosts} userProfile={userProfile} setUserProfile={setUserProfile} />}

        {/* Content Area */}
        <div className={`flex-grow pt-14 ${paddingValue}`}>
          <Outlet context={{ searchTrait, setSearchTrait ,userPosts,setUserPosts,userProfile,setUserProfile,setIsSidebarVisible}} />
        </div>
      </div>
    </>
  );
}
