import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronDown, LogOut, LogIn, UserPlus, UserCircle, Settings } from 'lucide-react';
import axios from 'axios';
import useAuthenticatedState from '../zustand/useAuthenticatedState';

// Separate search component
const SearchBar = React.memo(({ searchTrait, setSearchTrait, onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState(['#tag', '@user']);

  const handleInputChange = useCallback((e) => {
    const input = e.target.value;
    
    // Toggle dropdown based on input
    if (input === '#') {
      setShowDropdown(true);
      setDropdownOptions(['#tag']);
    } else if (input === '@') {
      setShowDropdown(true);
      setDropdownOptions(['@user']);
    } else if (searchTrait.startsWith('@user:') || searchTrait.startsWith('#tag:')) {
      setShowDropdown(false);
    } else {
      setShowDropdown(false);
    }

    if (searchTrait.startsWith('@user:')) {
      setSearchTrait('@user:' + input);
    } else if (searchTrait.startsWith('#tag:')) {
      setSearchTrait('#tag:' + input);
    } else {
      setSearchTrait(input);
    }
  }, [searchTrait, setSearchTrait]);

  const handleFocus = () => {
    // Show dropdown only when focused and searchTrait is empty
    if (!searchTrait) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    // Hide the dropdown when focus is lost, unless there's text in the input or a valid trait
    setTimeout(() => {
      if (!searchTrait) {
        setShowDropdown(false);
      }
    }, 200);
  };

  useEffect(() => {
    // Show dropdown only when the input is empty during focus
    if (!searchTrait && showDropdown) {
      setShowDropdown(true);
    }
  }, [searchTrait, showDropdown]);

  return (
    <div className="w-full ml-4 max-w-[600px]">
      <div className="relative card-wrapper">
    {/*<div className='animate-slide opacity-0 mt-2 text-center text-gray-400 text-xl absolute'>Welcome Aboard!</div>*/} 
        <Search className="absolute left-3  top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-100 h-5 w-5" />
        <form onSubmit={onSearch}>   
          <div className="w-full  dark:text-white placeholder:text-gray-400 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 card-content pl-10 pr-4 py-2 rounded-full bg-gray-100 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:bg-white transition-all duration-700 flex items-center gap-2 ">
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && 
                    (searchTrait === '@user:' || searchTrait === '#tag:')) {
                  setSearchTrait('');
                  setShowDropdown(true); // Ensure dropdown appears when cleared
                }
              }}
            />
          </div>
        </form>

        {showDropdown && (
          <div className="absolute left-0 top-12 dark:bg-slate-800 bg-gray-100 border border-gray-200 rounded-lg shadow-lg w-full z-50">
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
  );
});


// User dropdown component
const UserDropdown = React.memo(({ isAuthenticated, userProfile, onLogout }) => { 
  const [isOpen, setIsOpen] = useState(false);
  let timeout = null;
  const navigate = useNavigate();

  const handleDropdownOpen = () => {
    if (timeout) clearTimeout(timeout);
    setIsOpen(true);
  };

  const handleDropdownClose = (e) => {
    timeout = setTimeout(() => {
      if (!e.relatedTarget?.closest('.dropdown-area')) {
        setIsOpen(false);
      }
    }, 300);
  };

  return (
          <div className="flex items-center space-x-7 mx-4">
            {/* Dropdown Section */}
            <div
              className="relative dropdown-area"
              onMouseEnter={handleDropdownOpen}
              onMouseLeave={handleDropdownClose}
            >
              <button className="p-2 rounded-full hover:transition-colors flex items-center">
        {isAuthenticated ? (
          <img
            src={`/api/get-pfp?id=${userProfile?.pfp_id || 5}`}
            alt="Profile"
            className="h-8 min-w-8 rounded-full object-cover"
          />
        ) : (
          <User className="h-8 w-8" />
        )}
        <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
      </button>

      {isOpen && (
                <div
                  className="absolute right-0 top-14 w-48 shadow-lg rounded-lg border dark:bg-slate-800 dark:border-slate-700 border-gray-200 bg-gray-100 z-50 dropdown-area"
                  onMouseEnter={handleDropdownOpen}
                  onMouseLeave={handleDropdownClose}
                >
                  {isAuthenticated && (
                    <>
                      <Link
                        to={`/${userProfile.username}`}
                        // onClick={() => checkLoginOrRegister(`/${userProfile.username}`)}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-t-md transition-colors"
                      >
                        <UserCircle className="h-4 w-4 mr-2" /> My Profile
                      </Link>
                      <Link
                        to={`/settings`}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-t-md transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Link>
                      <button
                        onClick={onLogout}
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
                        // onClick={() => checkLoginOrRegister('/login')}
                        className="flex items-center px-4 py-2 dark:hover:bg-slate-900 hover:bg-gray-200 transition-colors hover:rounded-t-md"
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Login
                      </Link>
                      <Link
                        to="/register"
                        // onClick={() => checkLoginOrRegister('/register')}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-b-md transition-colors"
                      >
                        <UserPlus className="h-4 w-4 mr-2" /> Register
                      </Link>
                    </>
                  )}
              </div>
      )}
    </div>
    </div>
  );
});

const Navigation = ({ setVisibility, setPadding, searchTrait, setSearchTrait, userProfile, setUserProfile }) => {
  const {isAuthenticated, setIsAuthenticated} = useAuthenticatedState();
  const navigate = useNavigate();
  // const { theme, toggleTheme } = useTheme();
  // // const [selected, setSelected] = useState(theme || 'light');

  // // useEffect(() => {
  // //   setSelected(theme);
  // //   const timer = setTimeout(() => setIsLoading(false), 100);
  // //   return () => clearTimeout(timer);
  // // }, [theme]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check Google Login
        const googleResponse = await fetch('/api/google/status', { credentials: 'include' });
        const googleUserInfo = await googleResponse.json();
        
        if (googleUserInfo?.email) {
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
          return; 
        }
      } catch (error) {
        console.error('Error checking Google login status:', error);
      }
  
      try {
        // If Google login fails, check JWT auth
        const jwtResponse = await fetch('/api/verify', { credentials: 'include' });
  
        if (jwtResponse.ok) {
          const jwtData = await jwtResponse.json();
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
        } else {
          // Set to false only if both Google and JWT authentication fail
          localStorage.setItem('isAuthenticated', 'false');
          setIsAuthenticated(false);
          localStorage.setItem('isLoggedIn', 'false');
        }
      } catch (error) {
        console.error('Error checking manual login status:', error);
        localStorage.setItem('isAuthenticated', 'false');
        setIsAuthenticated(false);
        localStorage.setItem('isLoggedIn', 'false');
      }
    };
  
    checkAuthentication();
  
    const intervalId = setInterval(() => {
      console.log('Checking authentication status...');
      checkAuthentication();
    }, 2 * 60 * 60 * 1000); // Recheck every 2 hours
  
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);
  

  const handleSearch = useCallback(async (e) => {
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
      } else if (trimmedQuery.startsWith('#tag:')) {
        response = await axios.get(`/api/posts/search/tag?query=${trimmedQuery.replace('#tag:', '')}`);
      } else {
        response = await axios.get(`/api/posts/search/content?query=${trimmedQuery}`);
      }

      console.log(trimmedQuery)
      console.log(response.data)

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
  }, [searchTrait, navigate, setSearchTrait]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get('/api/user-logout', { withCredentials: true });
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('authUser');
      localStorage.setItem('isLoggedIn', false);
      setIsAuthenticated(false);
      setVisibility(false);
      setPadding('');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [navigate, setVisibility, setPadding]);

  return (
    <div className="w-full border-b dark:border-b-slate-800 fixed z-20 dark:bg-slate-800 bg-white dark:text-gray-100 top-0">
      <div className="w-full">
        <div className="flex items-center h-16">
          <div className="w-56">
            <Link to="/home">
            <img src="../public/logo/KUConnect.svg" className="object-contain max-h-12 min-w-[60px] mx-4 inline-block"/>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 flex ml-4 justify-center">
            <SearchBar
              searchTrait={searchTrait}
              setSearchTrait={setSearchTrait}
              onSearch={handleSearch}
            />
          </div>

          <div className="w-56 flex items-center justify-end gap-6 mr-4">
            {/* User Menu */}
            <UserDropdown
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navigation);
