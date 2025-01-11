import React from 'react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import Posts from '../components/subcomponents/Posts';
import UserSearchResults from './UserSearchResults';

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const results = location.state?.results || [];
  const isUserSearch = searchQuery.startsWith('@user:');
  const isTagSearch = searchQuery.startsWith('#tag:');

  // Function to extract multiple tags from the search query
  const extractTags = (query) => {
    const tagString = query.replace('#tag:', '').trim();
    // Split by commas or spaces, filter out empty strings, and trim whitespace
    return tagString.split(/[,\s]+/).filter(tag => tag.length > 0);
  };

  const fuse = new Fuse(results, {
    keys: isTagSearch ? ['tags'] : ['content', 'tags', 'username'],
    threshold: 0.9,
    includeScore: true,
    // Enable AND logic for matching all tags
    useExtendedSearch: true
  });

  let searchResults;
  if (isUserSearch) {
    searchResults = results; // Direct results from user search API
  } else if (isTagSearch) {
    const tags = extractTags(searchQuery);
    
    if (tags.length > 0) {
      // Filter posts that contain ALL specified tags
      searchResults = results.filter(post => 
        tags.every(tag => 
          post.tags.some(postTag => 
            postTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    } else {
      searchResults = results.filter(post => post.tags.length > 0);
    }
  } else {
    searchResults = searchQuery
      ? fuse.search(searchQuery).map(result => result.item)
      : results;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isUserSearch 
            ? `User results for "${searchQuery.replace('@user:', '')}"` 
            : isTagSearch
              ? `Tag search results for "${searchQuery.replace('#tag:', '').split(/[,\s]+/).join(', ')}"` 
              : `Search results for "${searchQuery}"`}
        </h1>
      </div>

      {isUserSearch ? (
        <UserSearchResults users={searchResults} />
      ) : (
        searchResults.length > 0 && (
          <Posts posts={searchResults} />
        )
      )}

      {searchResults.length === 0 && (
        <div className="text-center text-gray-600">
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchPage;