import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js'; 

const NotificationPage = () => {
 
  const [userProfile, setUserProfile] = useState({});
  const [userPosts,setUserPosts] = useState([]);
  const [userFilteredPosts,setFilteredPosts] = useState([]);

  useEffect(() => {
    fetch('/api/get-user-profile')
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data);
        console.log(userProfile);
      })
      .catch((e) => {
        console.error('Error fetching user profile:', e);
      });
  }, []);
  
  useEffect(()=>{
    const tags = userProfile.tags;
    const filteredPosts = tags.map((userProfileTag)=>
    userPosts.tags.includes(userProfileTag)
    ) 
    //console.log(filteredPosts);  
    //console.log(userPosts);
  },[userProfile])    

  useEffect(()=>{
    const fetchFunction = (async()=>{
      const res = await axios.get('/api/get-posts');
      setUserPosts(res.data);
    })();
  },[])


  return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-full h-full max-h-full">
        <h1 className="text-4xl font-serif text-gray-800 mb-6">Notifications</h1>
        {
          userFilteredPosts.map( (post)=>
            (
        <div className="space-y-4">
          <div className="bg-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
              A new post by {post.username}!
              </h3>
                <p className="text-gray-600">
              {post.content}  
              </p>
              </div>
              <div className="text-gray-400">12:00 AM</div>
            </div>
          </div>    
        </div>
            )
          )
        }
      </div>
  );
};

export default NotificationPage;
