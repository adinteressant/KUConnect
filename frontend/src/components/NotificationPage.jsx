import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationPage = () => {
  const [userProfile, setUserProfile] = useState({tags:[]});
  const [userPosts, setUserPosts] = useState([]);
  const [userFilteredPosts, setFilteredPosts] = useState([]);

  // Fetch user profile
  useEffect(() => {

    fetch('/api/get-user-profile',)
      .then((response) => response.json())
      .then((data) => setUserProfile(data))
      .catch((e) => {
        if (e.name !== 'AbortError') {
          console.error('Error fetching user profile:', e);
        }
      });

  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/get-posts', {
        });
        setUserPosts(res.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching posts:', error);
        }
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on tags
  useEffect(() => {
    const tags = userProfile.tags || []; 
    const filteredPosts = userPosts.filter(post => 
      post.tags?.some(tag => tags.includes(tag))
    );

    setFilteredPosts(filteredPosts);
  }, [userProfile.tags, userPosts]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-full h-full max-h-full">
      <h1 className="text-4xl font-serif text-gray-800 mb-6">Notifications</h1>
      {userFilteredPosts.length === 0 ? (
        <p className="text-gray-600">No notifications yet</p>
      ) : (
        <div className="space-y-4">
          {userFilteredPosts.map((post, index) => (
            <div key={post.id || index} className="bg-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    A new post by {post.username}!
                  </h3>
                  <p className="text-gray-600">{post.content}</p>
                </div>
                <div className="text-gray-400">{post.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
