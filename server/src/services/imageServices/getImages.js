// /src/services/dataServices/imageService.js

const fs = require('fs');
const path = require('path');

// Function to gather all images in the assets/images directory
const gatherImages = () => {
    const imagesDir = 'uploads/generated/images'
    try {
        const files = fs.readdirSync(imagesDir);
        return files.map(file => ({
            name: file,
            path: path.join(imagesDir, file) // Return the full path to the image
        }));
    } catch (error) {
        console.error('Failed to read images directory:', error);
        return [];
    }
};

module.exports = {
    gatherImages
};
