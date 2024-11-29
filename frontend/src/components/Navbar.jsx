import React from 'react';
import { Link,NavLink } from 'react-router-dom';
import { Search, User } from 'lucide-react';

const Navigation = ({setVisibility}) => {
  let pathList = ['/', '/login', '/register'];

  function checkLoginOrRegistration(path){
    if(path === '/login' || path ==='/register'){
      setVisibility(false)
    }else{
      setVisibility(true)
    }
  }
  
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif text-gray-800">
            KUConnect
          </Link>

          {/* Search Bar */}
          <div className="w-full max-w-md mx-32">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors font-serif"
              />
            </div>
          </div>

          {/* Navigation Links and Profile */}
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6 items-center">
              {pathList.map((path) => {
                const label = path.slice(1) || 'Home';
                return (
                  <NavLink 
                    key={path} 
                    to={path} 
                    onClick={()=>{checkLoginOrRegistration(path)}}
                    className={({isActive})=>
                        `${isActive ? 'text-cyan-600': 'text-gray-800'}
                              relative font-serif
                              px-4 py-2 transition-all duration-150 
                              hover:text-cyan-600 group`
                    }
                  >
                    <span className="relative z-10">
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </span>
                    <span 
                      className="absolute inset-0 bg-cyan-500 opacity-0 
                                rounded-full -z-10 
                                group-hover:opacity-5 
                                transition-opacity duration-1000 
                                scale-0 group-hover:scale-150"
                    />
                  </NavLink>
                );
              })}
            </nav>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Profile"
            >
              <User className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

