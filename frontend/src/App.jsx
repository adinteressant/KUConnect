import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import LoginPage from './components/LoginPage.jsx';
import Home from './components/Home.jsx';
import RegisterPage from "./components/RegisterPage.jsx";
import HomePage from "./components/HomePage.jsx";

export default function App() {
  return(
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/homepage">HomePage</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/homepage" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}