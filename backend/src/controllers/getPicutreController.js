import fs from 'fs';
import path from 'path';

export default function getPictureController(req, res) {
  // Centralized image mapping with type safety
  const PROFILE_PICTURES = {
    '1': '1.webp',
    '2': '2.webp',
    '3': '3.webp',
    '4': '4.webp',
    '5': '5.webp',
  };

  try {
    // Validate input
    const imageId = req.query.id;
    if (!imageId) {
      return res.status(400).json({
        error: 'Missing image ID',
        message: 'An image ID must be provided'
      });
    }

    // Check if requested image exists
    const imageName = PROFILE_PICTURES[imageId];
    if (!imageName) {
      return res.status(404).json({
        error: 'Image not found',
        message: `No image found for ID: ${imageId}`
      });
    }

    // Construct absolute file path with safety checks
    const imagePath = path.resolve(
      __dirname,
      "public/",
      imageName
    );
    //AI GENERATED CODE, IT IS. GUYS, IT WAS WRITTEN BY ME BUT REFACTORED BY AI, FOR BETTER LOOKS --shri
    if (!fs.existsSync(imagePath)) {
      console.error(`Image file missing: ${imagePath}`);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Image file could not be found'
      });
    }

    // Set appropriate headers and send file
    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=86400'); // 24-hour caching
    res.sendFile(imagePath);

  } catch (error) {
    // Centralized error handling
    console.error('Error in getPictureController', {
      error: error.message,
      stack: error.stack,
      imageId: req.query.id
    });

    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing the request'
    });
  }
}
