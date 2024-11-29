import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

export default function App() {
  return(
    <>
      <Navbar/>
      <div className="flex h-screen bg-gray-100">
      <Sidebar/>
      <Outlet/>
      </div>
    </>
  );
}
