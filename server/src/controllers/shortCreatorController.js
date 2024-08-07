const { gatherImages } = require('../services/imageServices/getImages');
const { spawn } = require('child_process');
const path = require('path');

let imagesCache = null;

async function gatherImagesHandler() {
    try {
        const images = await gatherImages();
        imagesCache = images;
        console.log("Images cached:", images);
        return imagesCache;
    } catch (error) {
        console.error('Error gathering images:', error);
        throw error;
    }
}

async function createShortHandler() {
    const outputPath = 'uploads/generated/videos/short.mp4';
    try {
        if (!imagesCache || imagesCache.length === 0) {
            throw new Error('Images not gathered yet or cache is empty');
        }

        const imagePaths = imagesCache.map(img => img.path); // Assuming imagesCache is an array of objects with a 'path' key

        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '../services/videoServices/createShort.py');
            const data = JSON.stringify({ image_paths: imagePaths, output_path: outputPath });
            const process = spawn('python3', [scriptPath, data]);

            let scriptErrors = ''; // To capture error messages from stderr

            process.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(output); // Print real-time output from the Python script
            });

            process.stderr.on('data', (data) => {
                const errorOutput = data.toString();
                console.log(errorOutput); // Print real-time error output from the Python script
                scriptErrors += errorOutput;
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python script stderr:', scriptErrors); // Log stderr content
                    reject(`Python script exited with code ${code}: ${scriptErrors}`);
                } else {
                    resolve(outputPath)
                }
            });
        });

    } catch (error) {
        console.error('Error creating video:', error);
        throw error; // Or you might want to handle it differently depending on your error handling strategy
    }
}

module.exports = {
    gatherImagesHandler,
    createShortHandler,
};
