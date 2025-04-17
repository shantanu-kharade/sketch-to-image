const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Path to test sketch
const testSketchPath = path.join(__dirname, '..', 'gan_model', 'test1.jpg');
const outputPath = path.join(__dirname, 'test-output.png');

console.log('Starting GAN test...');
console.log(`Input sketch: ${testSketchPath}`);
console.log(`Output will be saved to: ${outputPath}`);

// Check if the test sketch exists
if (!fs.existsSync(testSketchPath)) {
  console.error(`Error: Test sketch not found at ${testSketchPath}`);
  process.exit(1);
}

console.log('Running Python process...');

// Get path to Python interpreter in the virtual environment
const pythonPath = process.platform === 'win32' 
  ? path.join(__dirname, '..', 'gan_model', 'ganenv', 'Scripts', 'python.exe')
  : path.join(__dirname, '..', 'gan_model', 'ganenv', 'bin', 'python');

// Run the GAN model script
const pythonProcess = spawn(pythonPath, [
  path.join(__dirname, '..', 'gan_model', 'gan_acces.py'),
  testSketchPath,
  outputPath
], { stdio: 'pipe' });

// Collect output
pythonProcess.stdout.on('data', (data) => {
  console.log(`Python stdout: ${data.toString()}`);
});

// Collect error output
pythonProcess.stderr.on('data', (data) => {
  console.error(`Python stderr: ${data.toString()}`);
});

// Handle process completion
pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
  
  if (code !== 0) {
    console.error('GAN test failed');
    process.exit(1);
  }

  if (fs.existsSync(outputPath)) {
    console.log('GAN test completed successfully');
    console.log(`Check the output image at: ${outputPath}`);
    const stats = fs.statSync(outputPath);
    console.log(`Output file size: ${stats.size} bytes`);
  } else {
    console.error(`Output file was not created at ${outputPath}`);
    process.exit(1);
  }
}); 