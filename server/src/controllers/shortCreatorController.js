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
    const outputPath = 'public/generated/videos/short.mp4';
    try {
        if (!imagesCache || imagesCache.length === 0) {
            throw new Error('Images not gathered yet or cache is empty');
        }

        const imagePaths = imagesCache.map(img => img.path); // Assuming imagesCache is an array of objects with a 'path' key

        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '../services/videoServices/createShort.py');
            const data = JSON.stringify({ image_paths: imagePaths, output_path: outputPath });
            const process = spawn('python3', [scriptPath, data]);

            let scriptOutput = ''; // To capture JSON output from stdout
            let scriptErrors = ''; // To capture error messages from stderr

            process.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(output); // Print real-time output from the Python script
                if (output.includes('JSON_OUTPUT_START')) {
                    // Start capturing JSON output after the delimiter
                    scriptOutput = output.split('JSON_OUTPUT_START')[1].trim();
                }
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
                    try {
                        const result = JSON.parse(scriptOutput);

                        if (result.error) {
                            reject(result.error);
                        } else {
                            console.log(result)
                            resolve(result.video_path);
                            console.log(scriptOutput);
                        }

                    } catch (err) {
                        reject(`Error parsing JSON output from Python script: ${err.message}`);
                    }
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
