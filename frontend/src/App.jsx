import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from './components/LoginPage.jsx'
import Home from './components/Home.jsx'
export default function App() {
  return(
  <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>
    </BrowserRouter>
  </>
  );
}
