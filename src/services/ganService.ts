import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://localhost:5000';

/**
 * Process a sketch through the GAN model
 */
export const processSketchWithGAN = async (
  file: File
): Promise<{ 
  success: boolean; 
  imageData?: Blob; 
  error?: string;
  resultUrl?: string;
}> => {
  try {
    // Create form data to send the file
    const formData = new FormData();
    formData.append('sketch', file);
    
    // Send the request to the API
    const response = await axios.post(
      `${API_BASE_URL}/api/process-sketch`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1 minute timeout for processing
      }
    );
    
    if (response.status === 200 && response.data.success) {
      // Get the full URL for the generated image
      const resultUrl = `${API_BASE_URL}${response.data.resultUrl}`;
      
      // Fetch the actual image data
      const imageResponse = await axios.get(resultUrl, {
        responseType: 'blob'
      });
      
      return {
        success: true,
        imageData: imageResponse.data,
        resultUrl: resultUrl
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Failed to process sketch'
      };
    }
  } catch (error: any) {
    console.error('Error processing sketch with GAN:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to process sketch'
    };
  }
}; 