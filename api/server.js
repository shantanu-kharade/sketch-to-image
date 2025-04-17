const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Create uploads and results directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const resultsDir = path.join(__dirname, 'results');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Configure multer with storage settings
const upload = multer({ storage });

// Serve static files from the results directory
app.use('/results', express.static(resultsDir));

// Route to handle sketch uploads and processing
app.post('/api/process-sketch', upload.single('sketch'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputFile = req.file.path;
    const outputFile = path.join(resultsDir, `${path.basename(inputFile, path.extname(inputFile))}.png`);

    // Get path to Python interpreter in the virtual environment
    const pythonPath = process.platform === 'win32' 
      ? path.join(__dirname, '..', 'gan_model', 'ganenv', 'Scripts', 'python.exe')
      : path.join(__dirname, '..', 'gan_model', 'ganenv', 'bin', 'python');

    // Run the GAN model script
    const pythonProcess = spawn(pythonPath, [
      path.join(__dirname, '..', 'gan_model', 'gan_acces.py'),
      inputFile,
      outputFile
    ]);

    let errorOutput = '';
    
    // Collect error output
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Python stderr: ${data}`);
    });

    // Handle process completion
    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ 
          error: 'Failed to process the sketch',
          details: errorOutput
        });
      }

      // Success - return the URL to the generated image
      const resultUrl = `/results/${path.basename(outputFile)}`;
      
      // Check if the output file exists
      if (!fs.existsSync(outputFile)) {
        return res.status(500).json({
          error: 'Generated image file not found',
          details: 'The GAN model did not produce an output file'
        });
      }

      return res.json({ 
        success: true, 
        resultUrl,
        message: 'Sketch processed successfully'
      });
    });

    // Handle any errors during processing
    pythonProcess.on('error', (error) => {
      console.error('Error running Python process:', error);
      return res.status(500).json({
        error: 'Failed to run GAN model',
        details: error.message
      });
    });
  } catch (error) {
    console.error('Error processing sketch:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 