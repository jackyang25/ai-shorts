// /src/services/dataServices/imageService.js

const fs = require('fs');
const path = require('path');

// Function to gather all images in the assets/images directory
const gatherImages = () => {
    const imagesDir = path.join(__dirname, '../../assets/images'); // Adjust the path as necessary
    try {
        const files = fs.readdirSync(imagesDir); // Read all files in the directory
        return files.map(file => ({
            name: file,
            path: path.join(imagesDir, file)
        }));
    } catch (error) {
        console.error('Failed to read images directory:', error);
        return []; // Return an empty array or throw an error as needed
    }
};

module.exports = {
    gatherImages
};
