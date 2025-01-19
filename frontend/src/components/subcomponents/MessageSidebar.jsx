import React, {useState} from 'react';
import Conversations from './Conversations.jsx';
import { Search } from 'lucide-react';
import { useGetConversations } from '../hooks/useGetConversations.js'

export default function MessageSidebar() {
  const  {loading,conversations} = useGetConversations()
  const [convos,setConvos] = useState([])
  const [searchValue,setSearchValue] = useState('')
  const [initValue,setInitValue] = useState(0)

  const handleChange = (e) => {
    const value = e.target.value; // Current input value
    setSearchValue(value); // Update the search value state
    if (!value) {
      setConvos(conversations);
    } else {
      const filteredConvos = conversations.filter((conversation) =>
        conversation.username.toLowerCase().includes(value.toLowerCase()) 
      );
      setInitValue(1);
      setConvos(filteredConvos); 
    }
  };
  

  return (
    <div className="dark:bg-slate-800 bg-white w-[264px]">
      <div className="p-4 fixed overflow-y-auto">
        {/* Search Section */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            onChange={handleChange}
            className="w-full px-4 py-2 pr-10 text-sm rounded-lg border dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 border-gray-200 dark:focus:border-slate-950 dark:focus:ring-slate-950 focus:border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all placeholder:text-gray-400"
          />
          <label 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md "
          >
            <Search size={18} className="text-cyan-600" />
          </label>
        </div>
        
        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />
        
        {/* Conversations List Container */}
        <div className="h-[calc(100vh-12rem)] dark:text-slate-100">
        <Conversations conversations={initValue ? convos : conversations} loading={loading}/>
        </div>
      </div>
    </div>
  );
}