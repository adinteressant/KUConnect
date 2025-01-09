import React from 'react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import Posts from '../components/subcomponents/Posts';

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const posts = location.state?.posts || [];
  const isTagSearch = location.state?.isTagSearch || false;
  
  const fuse = new Fuse(posts, {
    keys: isTagSearch ? ['tags'] : ['content', 'tags', 'username'],
    threshold: 0.3,
    includeScore: true
  });

  let searchResults;

  if (isTagSearch) {
    // For tag search, strip the "#tag:" prefix
    const tagQuery = searchQuery.replace('#tag:', '').trim();
    // If tagQuery is empty, show all posts with tags
    searchResults = tagQuery 
      ? fuse.search(tagQuery).map(result => result.item)
      : posts.filter(post => post.tags.length > 0); // Show posts with tags if tag query is empty
  } else {
    // Regular search
    searchResults = searchQuery 
      ? fuse.search(searchQuery).map(result => result.item)
      : posts; // If searchQuery is empty, return all posts
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900">
              {searchResults.length > 0 
                ? `${isTagSearch ? 'Tag search' : 'Search'} results for "${searchQuery.replace('#tag:', '')}"`
                : `No ${isTagSearch ? 'tags' : 'results'} found for "${searchQuery.replace('#tag:', '')}"`}
            </h2>
          </div>

          {searchResults.length > 0 && (
            <Posts posts={searchResults} setPosts={() => {}} />
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
