import React from "react";
import { useState, useEffect } from "react";

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

    if (!videoId) return null;

    return (
        <div className="youtube-embed">
            <iframe
                width="640"
                height="400"
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