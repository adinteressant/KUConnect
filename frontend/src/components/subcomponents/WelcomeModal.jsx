import React from 'react';
import { X } from 'lucide-react';

const WelcomeModal = ({ email, username, onClose, pfp_id }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
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
            <span className="text-gray-500">add photo</span>
          )}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-teal-600 mb-2">Welcome to KUConnect</h2>
            <p className="text-gray-600 mb-4">You are now connected with the email: <br /> {email}<br />
            You are visible to other users with the username</p>
            <h3 className="text-xl font-semibold mb-4">{username}!</h3>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-teal-600 text-white px-8 py-2 rounded-full hover:bg-teal-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;