// pseudoController.js

const { gatherImages } = require('../dataServices/imageService');

const displayImages = () => {
    const images = gatherImages(); // Call the service function to get image data
    console.log("Retrieved Images:", images);
    // Further logic to process images or simulate a response can be added here
};

displayImages(); // Simulate calling this function when a route is hit
