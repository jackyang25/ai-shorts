#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Update package list and install FFmpeg
echo "Installing FFmpeg..."
brew install ffmpeg

# Set up your Python environment
echo "Setting up Python virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

