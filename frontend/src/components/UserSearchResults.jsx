import React from 'react';
import { Link } from 'react-router-dom';

const UserSearchResults = ({ users }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {users.map(user => (
        <Link 
          key={user.user_id} 
          to={`/${user.username}`}
          className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <img 
            src={`/api/get-pfp?id=${user.pfp_id}`} 
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">{user.username}</h3>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserSearchResults;