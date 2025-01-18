import React, { useEffect, useState } from 'react';
import axios from 'axios';
import formatTimeAgo from '../utils/generateTimeAgo.js';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NotificationPage = () => {
  const [userProfiletags, setUserProfile] = useState({tags:[]});
  const {userProfile, setUserProfile:setUserProfileFunc} = useOutletContext();
  const [incomingRequests,setIncomingRequests] = useState([]);
  const {userPosts, setUserPosts} = useOutletContext()
  const [userFilteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    async function clearNotification() {
      try {
        const response = await axios.post(
          '/api/clear-notifications/',
          {
            user_id: userProfile.user_id,
          },
          {
            withCredentials: true,
          }
        );
        console.log("Clear notifications response:", response);
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Error in clearing notifications", e);
        }
      }
    }
    clearNotification();
  },[,]);
  // Fetch user profile
  useEffect(() => {
    fetch('/api/get-user-profile',)
      .then((response) => response.json())
      .then((data) => {setUserProfile(data); setUserProfileFunc(data);})
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

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const res = await axios.get(`/api/view-incoming-requests?user_id=${userProfile.user_id}`, {withCredentials:true});
        console.log(res.data);
        const res_data = res.data.incoming.length?res.data.incoming:[];
        setIncomingRequests(res_data);
        console.log("Incoming Requests for:",userProfile.user_id,incomingRequests);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching posts:', error);
        }
      }
    };
    fetchIncomingRequests();
  }, []);


  // Filter posts based on tags
  useEffect(() => {
    const tags = userProfiletags.tags || []; 
    const filteredPosts = userPosts.filter(post => 
      post.tags?.some(tag => tags.includes(tag))
    );
    setFilteredPosts(filteredPosts);
  }, [userProfiletags.tags,userPosts]);




  return (
    <div className=" p-8 rounded-lg w-full max-w-full h-full max-h-full">
      <h1 className="text-4xl font-serif dark:text-gray-300 text-gray-800 mb-6">Notifications</h1>
      {userFilteredPosts.length === 0 ? (
        <p className="dark:text-gray-500 text-gray-600">No notifications yet</p>
      ) : (
        <div className="space-y-4">
          {userFilteredPosts.map((post, index) => (
            <div key={post.id || index} className="dark:bg-slate-800 bg-gray-200 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <Link 
                            to={`/post/${post._id}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold dark:text-gray-300 text-gray-800">
                    A new post by {post.username}!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{post.content}</p>
                </div>
                <div className="text-gray-400 dark:text-gray-500">{formatTimeAgo(post.createdAt)}</div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
