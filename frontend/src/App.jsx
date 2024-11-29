import { BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from "./components/RegisterPage.jsx";
import HomePage from "./components/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import MessagePage from "./components/MessagePage.jsx";
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
