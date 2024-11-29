import { BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from "./components/RegisterPage.jsx";
import HomePage from "./components/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return(
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
