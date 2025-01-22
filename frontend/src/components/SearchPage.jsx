import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import Posts from '../components/subcomponents/Posts';
import UserSearchResults from './UserSearchResults';

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const results = location.state?.results || [];
  const isUserSearch = searchQuery.startsWith('@user:');
  const isTagSearch = searchQuery.startsWith('#tag:');
  const isClick = location.state?.isClick || false;
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
    <div className="flex flex-col dark:text-slate-200 p-4 overflow-y-auto">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold">
          {isUserSearch 
            ? `User results for "${searchQuery.replace('@user:', '')}"` 
            : isTagSearch
            ? isClick
              ? `#${searchQuery.replace('#tag:', '')}`
              : `Tag search results for "${searchQuery.replace('#tag:', '').split(/[,\s]+/).join(', ')}"` 
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
        <div className="text-center dark:text-slate-300 text-gray-600 mt-4">
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchPage;