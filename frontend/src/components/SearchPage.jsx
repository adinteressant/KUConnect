import React from 'react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import Posts from '../components/subcomponents/Posts';
import UserSearchResults from './UserSearchResults';

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const results = location.state?.results || [];
  const isUserSearch = searchQuery.startsWith('#user:');
  const isTagSearch = searchQuery.startsWith('#tag:');

  const fuse = new Fuse(results, {
    keys: isTagSearch ? ['tags'] : ['content', 'tags', 'username'],
    threshold: 0.3,
    includeScore: true
  });

  let searchResults;
  if (isUserSearch) {
    searchResults = results; // Direct results from user search API
  } else if (isTagSearch) {
    const tagQuery = searchQuery.replace('#tag:', '').trim();
    searchResults = tagQuery 
      ? fuse.search(tagQuery).map(result => result.item)
      : results.filter(post => post.tags.length > 0);
  } else {
    searchResults = searchQuery 
      ? fuse.search(searchQuery).map(result => result.item)
      : results;
      console.log(searchResults)
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900">
              {isUserSearch 
                ? `User results for "${searchQuery.replace('#user:', '')}"` 
                : isTagSearch 
                  ? `Tag search results for "${searchQuery.replace('#tag:', '')}"` 
                  : `Search results for "${searchQuery}"`}
            </h2>
          </div>

          {isUserSearch ? (
            <UserSearchResults users={searchResults} />
          ) : (
            searchResults.length > 0 && (
              <Posts posts={searchResults} setPosts={() => {}} />
            )
          )}
        </div>
      </main>
    </div>
  );
};
export default SearchPage;
