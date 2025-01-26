import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { meta } from "@eslint/js";

async function scrapeMetaTags(url) {
    try {
        const response = await axios.post('/api/get-embed',{ url });
        const metaTags = response.data?.metaTags;
        let metaTagsSimplified = {};
      //convert {property:og_value,content:value} into {og_value,value}
        metaTags.forEach((metaTag)=> {
          metaTagsSimplified[`${metaTag.property}`] = `${metaTag.content}` 
        });
        return metaTagsSimplified;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return [];
    }
}

const YouTubeEmbed = ({ videoUrl }) => {
    const [videoId, setVideoId] = useState(null);
    const [metaData,setMetaData] = useState([]);
    useEffect(() => {
        const extractVideoId = (url) => {
            const regexes = [
                /(((https?:\/\/)|(www\.))[^\s]+)/g,
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
                /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/
            ]

            for (const regex of regexes) {
                const match = url.match(regex);
                if (match) return match[1];
            }

            return null;
        };

        setVideoId(extractVideoId(videoUrl))

    }, [videoUrl])

  useEffect(()=>{
  async function execute(){
    setMetaData(await scrapeMetaTags(videoUrl))
    }execute()
  },[videoUrl])

    

    return (
    <div className="py-2">
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
      {metaData['og:image']?<img 
            src={metaData['og:image'] || ""}
            width={metaData['og:image:width']}
            height={metaData['og:image:height']}
            alt="Thumbnail" 
            className="w-16 h-16 rounded-lg object-cover"
          />:<div></div>
      }
          
          <div>
            <a 
              href={metaData['og:url']} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 font-semibold text-lg hover:underline"
            >
              {metaData['og:title'] || ""}
            </a>
            <div className="text-gray-400 text-sm mt-1">
              {metaData['og:description']|| ""}
            </div>
            <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
              <span>{metaData['og:site_name'] || ""}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default YouTubeEmbed
