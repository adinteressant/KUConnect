import React from 'react';
import Conversations from './Conversations.jsx';
import { Search } from 'lucide-react';

export default function MessageSidebar() {
  return (
    <div className="fixed top-14 bottom-0 w-72 border-r border-cyan-600/20 bg-white shadow-lg">
      <div className="p-4">
        {/* Search Section */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pr-10 text-sm rounded-lg border border-cyan-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all placeholder:text-gray-400"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-cyan-50 transition-colors"
          >
            <Search size={18} className="text-cyan-600" />
          </button>
        </div>
        
        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />
        
        {/* Conversations List Container */}
        <div className="h-[calc(100vh-12rem)] overflow-y-auto">
          <Conversations />
        </div>
      </div>
    </div>
  );
}