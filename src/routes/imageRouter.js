const express = require('express');
const { displayImages } = require('../controllers/imageController');

const router = express.Router();

// GET route for /api/images
router.get('/images', (req, res) => {
    try {
        const images = displayImages();
        console.log('Sending response:', images); // Log the response being sent
        res.json(images); // Send the images as a JSON response
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ error: 'Failed to retrieve images' });
    }
});



module.exports = router;
