import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronDown, LogOut, LogIn, UserPlus, UserCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from './context/themeContext';

// Separate the theme slider into its own component
const SliderToggle = React.memo(({ selected, setSelected, toggleTheme, isLoading }) => {
  const handleThemeToggle = useCallback(() => {
    const newTheme = selected === "dark" ? "light" : "dark";
    setSelected(newTheme);
    toggleTheme();
  }, [selected, setSelected, toggleTheme]);

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleThemeToggle}
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
              damping: 25,
              duration: isLoading ? 0 : undefined
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: isLoading ? 0 : 0.2 }}
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
});

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
    <div className="w-full max-w-md mx-32">
      <div className="relative card-wrapper">
        <div className='animate-slide opacity-0 mt-2 text-center text-gray-400 text-xl absolute'>Welcome Aboard!</div> 
        <Search className="absolute left-3 animate-fade top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-100 h-5 w-5" />
        <form onSubmit={onSearch}>   
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
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isAuthenticated ? (
          <img
            src={`/api/get-pfp?id=${userProfile?.pfp_id || 5}`}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <User className="h-8 w-8" />
        )}
        <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-14 w-48 shadow-lg rounded-lg border dark:bg-slate-800 dark:border-slate-700 border-gray-200 bg-gray-100 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isAuthenticated ? (
            <>
              <Link
                to={`/${userProfile?.username}`}
                className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-t-md transition-colors"
              >
                <UserCircle className="h-4 w-4 mr-2" /> My Profile
              </Link>
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-b-md transition-colors text-left"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-4 py-2 dark:hover:bg-slate-900 hover:bg-gray-200 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-900 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
});

const Navigation = ({ setVisibility, setPadding, searchTrait, setSearchTrait, userProfile, setUserProfile }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState(theme || 'light');

  useEffect(() => {
    setSelected(theme);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [theme]);

  useEffect(() => {
    const checkAuthentication = async () => {
      const localAuth = localStorage.getItem('isAuthenticated') === 'true';    
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 ">
          <Link to="/home" className={`text-2xl font-serif ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            KUConnect
          </Link>

          {/* Search */}
          <SearchBar
            searchTrait={searchTrait}
            setSearchTrait={setSearchTrait}
            onSearch={handleSearch}
          />

          {/* Theme Toggle */}
          <SliderToggle
            selected={selected}
            setSelected={setSelected}
            toggleTheme={toggleTheme}
            isLoading={isLoading}
          />

          {/* User Menu */}
          <UserDropdown
            isAuthenticated={isAuthenticated}
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Navigation);