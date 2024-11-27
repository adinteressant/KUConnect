import React from 'react';
import { 
  Home as HomeIcon, 
  MessageCircle as MessagesIcon, 
  Users as FriendsIcon, 
  Bell as NotificationsIcon, 
  Search as SearchIcon 
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <div className="mb-8">
          <h1 className="text-3xl  font-serif  text-cyan-600 mb-6">KUConnect</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
              <HomeIcon className="mr-3 text-cyan-600" />
              <span>Home</span>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
              <MessagesIcon className="mr-3 text-cyan-600" />
              <span>Messages</span>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
              <FriendsIcon className="mr-3 text-cyan-600" />
              <span>Friends</span>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
              <NotificationsIcon className="mr-3 text-cyan-600" />
              <span>Notifications</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="relative flex-1 max-w-md mx-4">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full p-2 pl-8 border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            <SearchIcon className="absolute left-2 top-3 text-gray-400" />
          </div>
          <div className="flex items-center">
            <div className="ml-4">
              <img 
                src="/api/placeholder/40/40" 
                alt="Profile" 
                className="rounded-full w-10 h-10"
              />
            </div>
          </div>
        </header>

        {/* Content Feed */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Post Creation Area */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea 
                placeholder="What's on your mind?" 
                className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
              <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2">
                Post
              </button>
            </div>

            {/* Example Post */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User" 
                  className="rounded-full w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-serif">John Doe</h3>
                  <p className="text-gray-500 text-sm">2 hours ago</p>
                </div>
              </div>
              <p>Just had an amazing day exploring the city!</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;