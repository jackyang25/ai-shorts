// imageController.js

const { gatherImages } = require('../services/dataServices/getImages');
const { spawn } = require('child_process');
const path = require('path');


// In-memory cache to store images (for demonstration purposes)
let imagesCache = null;

async function gatherImagesHandler() {
    try {
        const images = await gatherImages();  // Always fetch new images
        imagesCache = images; // Update the cache with new images
        console.log("Images cached:", images);
        return imagesCache;
    } catch (error) {
        console.error('Error gathering images:', error);
        throw error;
    }
}


// Asynchronous function to create a video from images
async function createShortHandler() {

    const outputPath = 'output/video.mp4'; // Define the path where the video will be saved
    try {
        if (!imagesCache) {
            throw new Error('Images not gathered yet');
        }

        // Call the Python script to create the video
        return new Promise((resolve, reject) => {

            const scriptPath = path.join(__dirname, '../services/videoServices/createShort.py');
            const data = JSON.stringify({ image_paths: imagesCache, output_path: outputPath });
            const process = spawn('python3', [scriptPath, data]);


            process.stdout.on('data', (data) => {
                const result = JSON.parse(data.toString());
                resolve(result.video_path);
            });

            process.stderr.on('data', (data) => {
                reject(data.toString());
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    reject(`Python script exited with code ${code}`);
                }
            });
        });

    } catch (error) {
        console.error('Error creating video:', error);
        throw error;
    }
}




// Export the handlers
module.exports = {
    gatherImagesHandler,
    createShortHandler,
};
