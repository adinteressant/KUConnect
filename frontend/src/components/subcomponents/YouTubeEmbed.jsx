import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import axios from 'axios';

//Shriharsh's code too slow,no fuck you.


 const YouTubeEmbed = React.memo(({ videoUrl:url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/get-embed', { url });
        
        const metadata = {};
        response.data?.metaTags?.forEach(tag => {
          console.log(tag);
          const property = tag.property?.replace('og:', '');
          if (property && tag.content) {
            metadata[property] = tag.content;
          }
        });

        setPreview(metadata);
        setError(null);
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError('Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchMetadata();
    }
  }, [url]);

  if (loading) {
    return (
      <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-slate-800 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !preview) {
    return null;
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 block border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
    >
      <div className="p-4">
        {preview.title && (
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            {preview.title}
          </h3>
        )}
        {preview.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {preview.description}
          </p>
        )}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 truncate">
          {url}
        </div>
      </div>
      {preview.image && (
        <div className="border-t dark:border-slate-700">
          <img 
            src={preview.image} 
            alt={preview.title || 'Link preview'} 
            className="w-full h-48 object-cover"
          />
        </div>
      )}
    </a>
  );
 });

//const YouTubeEmbed = ({ videoUrl }) => {
//    const [videoId, setVideoId] = useState(null);
//
//    useEffect(() => {
//        const extractVideoId = (url) => {
//            const regexes = [
//                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
//                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
//                /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/
//            ]
//
//            for (const regex of regexes) {
//                const match = url.match(regex);
//                if (match) return match[1];
//            }
//
//            return null;
//        };
//
//        setVideoId(extractVideoId(videoUrl))
//    }, [videoUrl])
//
//    if (!videoId) return null;
//
//    return (
//        <div className="h-[400px] mt-1">
//            <iframe
//                className='w-full h-full rounded-lg'
//                src={`https://www.youtube.com/embed/${videoId}`}
//                title="Youtube Video Player"
//                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                allowFullScreen
//                style={{ paddingBottom: '-10px' }}
//            />
//        </div>
//    )
//}
//
export default YouTubeEmbed
