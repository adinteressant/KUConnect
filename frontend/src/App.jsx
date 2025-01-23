import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Sidebar from "./components/Sidebar.jsx"
import { useTheme } from "./components/context/themeContext.jsx"
import { useState, useEffect } from "react"
import SplashScreen from "./components/SplashScreen.jsx"

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [paddingValue, setPaddingValue] = useState("pl-64")
  const location = useLocation()

  const [searchTrait,setSearchTrait] = useState("")
  const [userPosts,setUserPosts] = useState([])
  const [userProfile,setUserProfile] = useState({})
  const [load, setLoad] = useState(true)

  useEffect(() => {
    // Hide sidebar for login and register pages
    if (location.pathname==="/" ||location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/verifyotp")) {
      setIsSidebarVisible(false)
      setPaddingValue("")
    } else {
      setIsSidebarVisible(true)
      setPaddingValue("pl-[55px] pt-[64px]")
      document.body.classList.toggle('overflow-hidden', true)
    }
  }, [location.pathname])
      
  const {theme, toggleTheme} = useTheme()
    useEffect(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }, [theme])

  return (
    load?
    <SplashScreen setLoad={setLoad}/>
    :
    (<div className = {`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Navbar */}
      {isSidebarVisible&&<Navbar setVisibility={setIsSidebarVisible} setPadding={setPaddingValue} searchTrait={searchTrait} setSearchTrait={setSearchTrait} userProfile={userProfile} setUserProfile={setUserProfile}/>}

      {/* Main Layout */}
      <div className={`flex`}>
        {/* Sidebar */}
        {isSidebarVisible && <Sidebar userPosts={userPosts} userProfile={userProfile} setUserProfile={setUserProfile} />}

        {/* Content Area */}
        <div className={`flex-grow flex flex-col min-h-screen max-h-screen ${paddingValue}`}>
          <Outlet context={{ searchTrait, setSearchTrait ,userPosts,setUserPosts,userProfile,setUserProfile,setIsSidebarVisible}} />
        </div>
      </div>
    </div>)
  )
}
