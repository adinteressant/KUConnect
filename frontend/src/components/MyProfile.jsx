import {useState, useEffect } from 'react';
import axios from 'axios';

const MyProfile = () => {
 
  
const [userProfile,setuserProfile] = useState({
  username:' ',
  role:' ',
});

useEffect(()=>{
  (async ()=>{
  try {
      const response = await axios.get('/api/get-user-profile/', {
        withCredentials: true // Sends the cookie with the request
      });
    if(!response.data){
      return
    }  

    setuserProfile((response.data));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  })();
},[]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Profile Picture */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
    {/*Placeholder for Profile Picture */}
        </div>

        {/* Name and Tagline */}
        <div className="text-center mt-4">
          <h1 className="text-4xl font-serif font-bold text-gray-800 ">{userProfile.username}</h1>
          <p className="text-gray-600 mt-2">@{userProfile.user_id}</p>
          <p className="text-gray-700 mt-2">
            Enthusiastic developer, coffee lover, and tech enthusiast.
          </p>
        </div>

        {/* Academic Info */}
        <div className="mt-6 text-left">
          <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-800">Academic Info</h2>
          <p className="text-gray-700">
            <strong>University Status: </strong> {userProfile.role}
          </p>
        </div>

        {/* Social Media Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-800">Social Media</h2>
          <div className="flex space-x-4 justify-center">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
