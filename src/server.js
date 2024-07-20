const express = require('express');
const imageRouter = require('./routes/imageRouter'); // Adjust the path if necessary

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Use the image router for the /api path
app.use('/api', imageRouter);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Function to close the server
const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    server.close((err) => {
        if (err) {
            console.error('Error shutting down:', err);
            process.exit(1); // Exit with error
        }
        console.log('Server closed');
        process.exit(0); // Exit without error
    });
};

// Listen for termination signals (e.g., Ctrl+C in the terminal)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);