import React from 'react';
import { X } from 'lucide-react';

const WelcomeModal = ({ email, username, onClose, pfp_id }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 dark:text-slate-200 dark:hover:text-slate-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          {pfp_id ? (
            <img
              src={`/api/get-pfp?id=${pfp_id}`}
              alt="profile"
              className="w-full h-full rounded-full object-cover"
            />
        ) : (
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400 fill-current">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>          )}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-600 mb-2">Welcome to KUConnect</h2>
            <p className="text-gray-600  dark:text-slate-400 mb-4">You are now connected with the email: <br /> {email}<br />
            You are visible to other users with the username</p>
            <h3 className="text-xl font-semibold dark:text-slate-200 mb-4">{username}</h3>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-cyan-600 text-white px-8 py-2 rounded-full hover:bg-cyan-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;