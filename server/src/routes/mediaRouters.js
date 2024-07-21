const express = require('express');
const router = express.Router();
const { gatherImagesHandler, createShortHandler } = require('../controllers/shortCreatorController');

// GET route for /api/images
router.get('/images', async (req, res) => {
    try {
        const images = await gatherImagesHandler(); // Use await to handle the asynchronous function
        console.log('Sending response:', images); // Log the response being sent
        res.json(images); // Send the images as a JSON response
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ error: 'Failed to retrieve images' });
    }
});

// POST route to create short from images
router.post('/create-short', async (req, res) => {
    try {
        const videoPath = await createShortHandler();
        console.log('Video created at:', videoPath); // Log the video path
        res.json({ videoPath });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
