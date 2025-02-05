import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

//Code is good, AI overwrote the code i already wrote.

export default async function getEmbedController(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).set('Content-Type', 'application/json').json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are accepted'
    });
  }
  const url = req.body?.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing or invalid URL parameter'
    });
  }

  try {
    const axiosInstance = axios.create({
      timeout: 5000,  // 5 seconds timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://github.com/dhaiwat10/react-link-preview)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    // Fetch URL content
    const response = await axiosInstance.get(url);
    
    // Parse HTML
    const $ = cheerio.load(response.data);
    const metaTags = [];

    $('meta').each((i, element) => {
      const property = $(element).attr('property') || $(element).attr('name');
      const content = $(element).attr('content');
      
      if (property && content) {
        metaTags.push({
          property: property.toLowerCase(),
          content: content
        });
      }
    });

    return res.status(200).set('Content-Type', 'application/json').json({ metaTags });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Handle different error types
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.statusText || 'Failed to process URL';

    return res.status(statusCode).json({
      error: errorMessage,
      message: 'Could not retrieve link metadata'
    });
  }
}
