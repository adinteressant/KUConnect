import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Search, User, ChevronDown, LogOut, LogIn, UserPlus, UserCircle } from 'lucide-react';
import axios from 'axios';

const Navigation = ({ setVisibility, setPadding,searchTrait,setSearchTrait, userProfile,setUserProfile}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') == 'true');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownOptions = ['#tag', '@user'];
  const navigate = useNavigate();
  let timeout = null;
  
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
  
    fetch('/api/get-user-profile')
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data); // Ensure user_id is fetched and set properly
      })
      .catch((e) => {
        console.error('Error fetching user profile:', e);
      });}, []);

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
    <div className="w-full bg-white shadow-sm fixed z-20 top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-serif text-gray-800">
            KUConnect
          </Link>

          <div className="w-full max-w-md mx-32">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <form onSubmit={handleSearch}>
                <div className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:bg-white transition-colors flex items-center gap-2">
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
                    className="flex-1 bg-transparent focus:outline-none"
                    value={
                      searchTrait.startsWith('@user:')
                        ? searchTrait.slice(6)
                        : searchTrait.startsWith('#tag:')
                        ? searchTrait.slice(5)
                        : searchTrait
                    }
                    onChange={(e) => {
                      const input = e.target.value;
                      
                      if(input === '#' || input === '@'){
                        setShowDropdown(true);
                      }
                      else{
                        setShowDropdown(false);
                      }
        
                      // If there's input and we have a prefix, append the input to the prefix
                      if (searchTrait.startsWith('@user:')) {
                        setSearchTrait('@user:' + input);
                      }
                      else if (searchTrait.startsWith('#tag:')) {
                        setSearchTrait('#tag:' + input);
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
                      }
                    }}
                  />
                </div>
              </form>
              {showDropdown && (
                <div className="absolute left-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-full z-50">
                  {dropdownOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
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

          <div className="flex items-center space-x-6">
            {/* Dropdown Section */}
            <div
              className="relative dropdown-area"
              onMouseEnter={handleDropdownOpen}
              onMouseLeave={handleDropdownClose}
            >
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center">
    {isAuthenticated?<img
            src={`/api/get-pfp?id=${userProfile.pfp_id}`}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />:<User
            className="h-8 w-8 rounded-full object-cover"
      />}

                <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-14 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 dropdown-area"
                  onMouseEnter={handleDropdownOpen}
                  onMouseLeave={handleDropdownClose}
                >
                  {isAuthenticated && (
                    <>
                      <Link
                        to={`/${userProfile.username}`}
                        onClick={() => checkLoginOrRegister(`/${userProfile.username}`)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <UserCircle className="h-4 w-4 mr-2" /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-left"
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
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => checkLoginOrRegister('/register')}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
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
