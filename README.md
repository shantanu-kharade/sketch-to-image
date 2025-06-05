# Sketch-to-Image GAN Application

This application allows users to upload face sketches and generates realistic face images using a GAN (Generative Adversarial Network) model.

## Features

- User authentication
- Sketch upload
- GAN-based image generation
- Image history and management
- User dashboard

## Requirements

- Node.js 14+
- Python 3.7+
- PyTorch
- Supabase account (for storage and database)

## Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/sketch-to-image.git
cd sketch-to-image
```

2. **Install frontend dependencies:**

```bash
npm install
```

3. **Set up Python environment for GAN model:**

```bash
# Create a virtual environment (if not already created)
cd gan_model
python -m venv ganenv

# Activate the environment
# On Windows:
ganenv\Scripts\activate

# On macOS/Linux:
# source ganenv/bin/activate

# Install requirements
pip install torch torchvision matplotlib pillow
```

4. **Configure environment variables:**

Copy `.env.example` to `.env` and update with your Supabase credentials.

```bash
cp .env.example .env
```

## Running the Application

1. **Start the development server (both frontend and backend):**

```bash
npm run dev
```

This will start:
- React frontend on http://localhost:3000
- Express API backend on http://localhost:5000

2. **Using the application:**

- Create an account or login
- Upload a sketch from the Upload page
- Wait for the GAN model to process the sketch
- View the generated image on the sketch detail page

## Project Structure

- `/src` - React frontend
- `/api` - Express backend
- `/gan_model` - GAN model and Python scripts
- `/public` - Static assets

## GAN Model

The GAN model used in this project is a U-Net style architecture with residual blocks. The model is trained to convert face sketches to realistic face images.

Key files:
- `gan_model/gan_acces.py` - Main script for running the GAN model
- `gan_model/model_epoch_100.pth` - Pre-trained model weights


