import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeMetaTags(url) {
    try {
        const response = await axios.post('/api/get-embed',{ url });
        const metaTags = response;
        return metaTags;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return [];
    }
}

const YouTubeEmbed = ({ videoUrl }) => {
    const [videoId, setVideoId] = useState(null);

    useEffect(() => {
        const extractVideoId = (url) => {
            const regexes = [
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
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
    console.log(await scrapeMetaTags("https://github.com"))
    }execute()
  },[])

    if (!videoId) return null;

    return (
        <div className="h-[400px]">
            <iframe
                className='w-full h-full rounded-lg'
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Youtube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ paddingBottom: '-10px' }}
            />
        </div>
    )
}

export default YouTubeEmbed
