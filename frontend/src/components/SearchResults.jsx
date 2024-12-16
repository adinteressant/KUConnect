import {useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { posts, searchTag } = location.state || { posts: [], searchTag: '' };
  const [userProfile, setUserProfile] = useState({});
  const [showCommentBox, setShowCommentBox] = useState(false);


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-serif mb-6">
        Search Results for Tag: <span className="text-cyan-600">#{searchTag}</span>
      </h2>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">
          No posts found with the tag "{searchTag}".
        </div>
      ) : (
        <div className="mt-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300"
            >
              <Link 
                to={post.username === userProfile.username ? '/myprofile' : `/${post.username}`}
                className="flex items-center mb-2"
              >
                <img 
                  src={`/api/get-pfp?id=${post.pfp_id}`}
                  className="h-8 w-8 rounded-full object-cover mr-2"
                  alt={`${post.username}'s profile`}
                />
                <div className="text-gray-800 font-semibold">{post.username}</div>
              </Link>

              <div className="text-gray-600 text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}, {new Date(post.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>

              <p className="mt-2 text-gray-800">{post.content}</p>

              {post.tags.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Tags: {post.tags.join(', ')}
                </div>
              )}

              <hr className='mt-2'/>
              
              <div className='mt-2 flex items-center gap-4'>
                {post.likes.length > 0 && (
                  <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                    {(post.likes.length < 3
                      ? `Liked by ${post.likes.map(user => user.username).join(', ')}`
                      : `Liked by ${post.likes.map(user => user.username).slice(-2).join(', ')} and ${post.likes.length-2} more`
                    )}
                  </button>
                )}

                <div className='ml-auto flex items-center gap-4'>
                  {post.comments.length > 0 && (
                    <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                      {post.comments.length} comments
                    </button>
                  )}

                  {post.shares > 0 && (
                    <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                      {post.shares} shares
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {showCommentBox && (<div className="mt-4">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                    <button
                      className="bg-cyan-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      disabled
                    >
                      Comment
                    </button>
                  </div>)}
        </div>
      )}
    </div>
  );
};

export default SearchResults;