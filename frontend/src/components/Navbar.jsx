import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Search, User, ChevronDown, LogOut, LogIn, UserPlus, UserCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from './context/themeContext';

const Navigation = ({ setVisibility, setPadding,searchTrait,setSearchTrait, userProfile,setUserProfile}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') == 'true');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState(['#tag', '@user'])
  //const dropdownOptions = ['#tag', '@user'];
  const navigate = useNavigate();
  let timeout = null;
  const {theme, toggleTheme} = useTheme();
  const [selected, setSelected] = useState(() => {
    const savedTheme = localStorage.getItem('darkmode');
    return savedTheme || theme || 'light';
  });

  useEffect(() => {
    setSelected(theme);
  }, [theme]);
  
const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

  // const sliderVariants = {
  //   light: {
  //     x: 0,
  //     backgroundColor: "#6366f1",
  //     transition: {
  //       type: "spring",
  //       stiffness: 300,
  //       damping: 20
  //     }
  //   },
  //   dark: {
  //     x: "100%",
  //     backgroundColor: "#7c3aed",
  //     transition: {
  //       type: "spring",
  //       stiffness: 300,
  //       damping: 20
  //     }
  //   }
  // };

  // const iconVariants = {
  //   active: {
  //     scale: 1.2,
  //     rotate: 0,
  //     transition: {
  //       type: "spring",
  //       stiffness: 300,
  //       damping: 15
  //     }
  //   },
  //   inactive: {
  //     scale: 1,
  //     rotate: -30,
  //     transition: {
  //       type: "spring",
  //       stiffness: 300,
  //       damping: 15
  //     }
  //   }
  // };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const SliderToggle = ({ selected, setSelected }) => {
    return (
      <div className="relative flex items-center">
        <button
          onClick={() => {
            setSelected(selected === "dark" ? "light" : "dark");
            toggleTheme();
          }}
          className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center"
              initial={{ x: selected === "dark" ? "0rem" : "2rem" }}
              animate={{ x: selected === "dark" ? "2rem" : "0rem" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {selected === "dark" ? (
                    <FiMoon className="w-4 h-4 text-white" />
                  ) : (
                    <FiSun className="w-4 h-4 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    );
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const localAuth = localStorage.getItem('isAuthenticated') == 'true';    
      if (localAuth) {
        setIsAuthenticated(true);
      } else {
        try {
          const response = await fetch('/api/google/status', { credentials: 'include' });
          const googleUserInfo = await response.json();
          if (googleUserInfo?.email) {
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error checking Google login status:', error);
        }
      }
    };

    checkAuthentication();
  
    //fetch('/api/get-user-profile')
    //  .then((response) => response.json())
    //  .then((data) => {
    //    setUserProfile(data); // Ensure user_id is fetched and set properly
    //  })
    //  .catch((e) => {
    //    console.error('Error fetching user profile:', e);
    //  });
  }, []);

  const checkLoginOrRegister = (path) => {
    if (path === '/login' || path === '/register' || path.startsWith('/verifyotp')) {
      setVisibility(false);
      setPadding('');
    } else {
      setVisibility(true);
      setPadding('pl-64');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/user-logout', { withCredentials: true });
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('authUser')
      localStorage.setItem('isLoggedIn',false)
      setIsAuthenticated(false);
      setVisibility(false);
      setPadding('');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDropdownOpen = () => {
    if (timeout) clearTimeout(timeout);
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = (e) => {
    timeout = setTimeout(() => {
      if (!e.relatedTarget?.closest('.dropdown-area')) {
        setIsDropdownOpen(false);
      }
    }, 300);
  };


  //Navbar handle search
  const handleSearch = async (e) => {
  e.preventDefault();
  const trimmedQuery = searchTrait.trim();
  
  if (!trimmedQuery) {
    alert('Please enter something to search');
    return;
  }

  try {
    let response;
    if (trimmedQuery.startsWith('@user:')) {
      response = await axios.get(`/api/users/search?query=${trimmedQuery.replace('@user:', '')}`);
      console.log(response)
    } else if (trimmedQuery.startsWith('#tag:')) {
      response = await axios.get(`/api/posts/search/tag?query=${trimmedQuery.replace('#tag:', '')}`);
    } else {
      response = await axios.get(`/api/posts/search/content?query=${trimmedQuery}`);
    }

    navigate('/search', {
      state: {
        results: response.data,
        searchQuery: trimmedQuery
      }
    });
    
    setSearchTrait('');
  } catch (error) {
    console.error('Error searching:', error);
    alert('An error occurred while searching');
  }
};
  

  return (
    <div className="w-full border-b dark:border-b-slate-800 fixed z-20  dark:bg-slate-800 bg-white dark:text-gray-100 top-0 ">

      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex items-center justify-between h-16 ">
          <Link to="/home" className={`text-2xl font-serif ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            KUConnect
          </Link>

          <div className="w-full max-w-md mx-32">
    <div className='animate-slide opacity-0 mt-2 text-center text-gray-400 text-xl absolute'>Welcome Aboard!</div> 
            <div className="relative card-wrapper">
    <div className='card-content'>
              <Search className="absolute left-3 animate-fade top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-100 h-5 w-5" />
              <form onSubmit={handleSearch}>   
                <div className="animate-fade w-full dark:text-white placeholder:text-gray-400 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 card-content pl-10 pr-4 py-2 rounded-full bg-gray-100 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:bg-white transition-all duration-700 flex items-center gap-2 ">
                  {searchTrait.startsWith('@user:') && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm whitespace-nowrap">
                      @user:
                    </span>
                  )}
                  {searchTrait.startsWith('#tag:') && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm whitespace-nowrap">
                      #tag:
                    </span>
                  )}
                  <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 bg-transparent dark:text-gray-100 focus:outline-none"
                    value={
                      searchTrait.startsWith('@user:')
                        ? searchTrait.slice(6) 
                        : searchTrait.startsWith('#tag:')
                        ? searchTrait.slice(5) 
                        : searchTrait

                    }

                    onFocus={() => setShowDropdown(true)}
                    onBlur={(e) => {
                      // Small delay to allow clicking on dropdown items
                      setTimeout(() => {
                        setShowDropdown(false);
                        setDropdownOptions(['#tag', '@user'])
                      }, 200);
                    }}


                    onChange={(e) => {
                      const input = e.target.value;

                      if(input === '#'){
                        setShowDropdown(true)
                        setDropdownOptions(['#tag']); // Only show tag option
                      }
                      else if (input === '@') {
                        setShowDropdown(true);
                        setDropdownOptions(['@user']); // Only show user option
                      }
                      else {
                        setShowDropdown(false);
                      }
        
                      // If there's input and we have a prefix, append the input to the prefix
                      if (searchTrait.startsWith('@user:')) {
                        setSearchTrait('@user:' + input);
                        setShowDropdown(false);
                      }
                      else if (searchTrait.startsWith('#tag:')) {
                        setSearchTrait('#tag:' + input);
                        setShowDropdown(false);
                      }
                      // Otherwise just set the input directly
                      else {
                        setSearchTrait(input);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace when only prefix remains
                      if (e.key === 'Backspace' && 
                          (searchTrait === '@user:' || searchTrait === '#tag:')) {
                        setSearchTrait('');
                        setShowDropdown(false)
                      }
                    }}
                  />
              </div>
              </form>
    </div>
            {showDropdown && (
                <div className="absolute left-0 top-12 dark:bg-slate-800 bg-gray-200 border border-gray-200 rounded-lg shadow-lg w-full z-50">
                  {dropdownOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:cursor-pointer dark:text-gray-100 text-gray-700"
                      onMouseDown={() => {
                        setSearchTrait(option + ':');
                        setShowDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <SliderToggle selected={selected} setSelected={setSelected} className = "flex space-x-7"/>

          <div className="flex items-center space-x-7">
            {/* Dropdown Section */}
            <div
              className="relative dropdown-area"
              onMouseEnter={handleDropdownOpen}
              onMouseLeave={handleDropdownClose}
            >
              <button className="p-2 rounded-full hover:transition-colors flex items-center">
    {isAuthenticated?<img
            src={`/api/get-pfp?id=${userProfile.pfp_id?userProfile.pfp_id:5}`}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />:<User
            className="h-8 w-8 rounded-full object-cover"
      />}

                <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-14 w-48 shadow-lg rounded-lg border dark:bg-slate-800 dark:border-slate-700 border-gray-200 bg-gray-100 z-50 dropdown-area"
                  onMouseEnter={handleDropdownOpen}
                  onMouseLeave={handleDropdownClose}
                >
                  {isAuthenticated && (
                    <>
                      <Link
                        to={`/${userProfile.username}`}
                        onClick={() => checkLoginOrRegister(`/${userProfile.username}`)}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-t-md transition-colors"
                      >
                        <UserCircle className="h-4 w-4 mr-2" /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-b-md transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <Link
                        to="/login"
                        onClick={() => checkLoginOrRegister('/login')}
                        className="flex items-center px-4 py-2 dark:hover:bg-slate-800 hover:bg-gray-200 transition-colors"
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => checkLoginOrRegister('/register')}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 mr-2" /> Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
