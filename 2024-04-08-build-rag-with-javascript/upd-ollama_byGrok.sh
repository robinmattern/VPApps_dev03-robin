#!/bin/bash

# Script to update Ollama and download models

# Function to check if Ollama is running
check_ollama_status() {
    echo "Checking if Ollama is running..."
    if ollama list >/dev/null 2>&1; then
        echo "Ollama is running."
        return 0
    else
        echo "Ollama is not running or not responding."
        return 1
    fi
}

# Function to start Ollama
start_ollama() {
    echo "Attempting to start Ollama..."
    # Adjust this command based on how Ollama is installed on your system
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start ollama
    elif command -v service >/dev/null 2>&1; then
        sudo service ollama start
    else
        echo "Cannot start Ollama: systemctl or service not found. Please start it manually."
        exit 1
    fi

    # Wait a few seconds and check again
    sleep 3
    if check_ollama_status; then
        echo "Ollama started successfully."
    else
        echo "Failed to start Ollama. Please check your installation."
        exit 1
    fi
}

# Function to update Ollama
update_ollama() {
    echo "Updating Ollama..."
    # Assuming Ollama provides a binary or install script; adjust this command as needed
    # For example, if it's installed via a script or package manager:
    curl -fsSL https://ollama.com/install.sh | sh
    if [ $? -eq 0 ]; then
        echo "Ollama updated successfully."
    else
        echo "Failed to update Ollama."
        exit 1
    fi
}

# Function to download models
download_models() {
    echo "Downloading specified models..."
    # List of models to download (customize this as needed)
    MODELS=("llama3" "mistral" "phi")

    for model in "${MODELS[@]}"; do
        echo "Pulling model: $model"
        ollama pull "$model"
        if [ $? -eq 0 ]; then
            echo "Successfully downloaded $model."
        else
            echo "Failed to download $model."
        fi
    done
}

# Main script logic
echo "Starting Ollama update and model download script..."

# Check if Ollama is running; start it if not
if ! check_ollama_status; then
    start_ollama
fi

# Update Ollama
update_ollama

# Download models
download_models

# Verify installed models
echo "Listing installed models:"
ollama list

echo "Script completed."