// imageController.js

const { gatherImages } = require('../services/dataServices/imageService');

const displayImages = () => {
    try {
        const images = gatherImages();
        console.log("Retrieved Images:", images); // Log the retrieved images
        return images;
    } catch (error) {
        console.error('Error displaying images:', error);
        throw error;
    }
};
module.exports = {
    displayImages
};
