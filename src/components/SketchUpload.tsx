import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadSketch } from '../services/sketchService';
import { useNavigate } from 'react-router-dom';
import { Box, Image, Text, Flex, Alert, AlertIcon, FormLabel, Textarea, Progress, useColorModeValue } from '@chakra-ui/react';

interface SketchUploadProps {
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: string) => void;
}

export interface SketchUploadRef {
  clear: () => void;
  upload: () => Promise<void>;
  hasFile: () => boolean;
}

// Change to forwardRef to expose methods to parent
const SketchUpload = forwardRef<SketchUploadRef, SketchUploadProps>(({ 
  onUploadStart, 
  onUploadComplete, 
  onUploadError 
}, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Theme values
  const dropZoneBg = useColorModeValue("gray.50", "gray.700");
  const dropZoneTextColor = useColorModeValue("gray.500", "gray.400");
  const dropZoneIconColor = useColorModeValue("gray.400", "gray.500");
  const previewTextColor = useColorModeValue("gray.600", "gray.300");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const textareaBg = useColorModeValue("white", "gray.700");
  const textareaBorderColor = useColorModeValue("gray.200", "gray.600");
  const textareaFocusBorderColor = useColorModeValue("blue.500", "blue.300");
  const progressTextColor = useColorModeValue("gray.600", "gray.300");

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clear: handleClear,
    upload: handleUpload,
    hasFile: () => !!file
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!selectedFile.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        setError('Please upload a sketch image (JPEG, PNG, or GIF)');
        return;
      }

      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Maximum file size is 5MB');
        return;
      }

      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      if (!droppedFile.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        setError('Please upload a sketch image (JPEG, PNG, or GIF)');
        return;
      }

      // Check file size (max 5MB)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('Maximum file size is 5MB');
        return;
      }

      setFile(droppedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file || !user) {
      if (!user) {
        throw new Error('You must be logged in to upload sketches');
      }
      if (!file) {
        throw new Error('No file selected');
      }
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Call the parent's upload start callback
      if (onUploadStart) {
        onUploadStart();
      }
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      // Upload file and process with GAN model
      const sketchData = await uploadSketch(
        file, 
        user.id,
        prompt || `Sketch - ${file.name.split('.')[0]}`
      );
      
      if (!sketchData) {
        throw new Error('Failed to upload and process sketch');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Call the parent's upload complete callback
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      // Reset the form after successful upload
      setTimeout(() => {
        // Navigate to the sketch detail page
        navigate(`/sketches/${sketchData.id}`);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error uploading sketch:', error.message);
      
      // Set local error
      setError(error.message || 'An error occurred during upload');
      
      // Call the parent's upload error callback
      if (onUploadError) {
        onUploadError(error.message || 'An error occurred during upload');
      }
      
      setUploading(false);
      setUploadProgress(0);
      
      // Re-throw the error to be caught by the caller
      throw error;
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box width="full">
      {/* Drag and drop area */}
      <Box
        width="full"
        border="0"
        borderRadius="md"
        textAlign="center"
        cursor="pointer"
        bg={preview ? "white" : dropZoneBg}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <Box position="relative">
            <Image
              src={preview}
              alt="Sketch"
              maxH="300px"
              mx="auto"
              objectFit="contain"
            />
            <Text mt={2} fontSize="sm" color={previewTextColor}>
              {file?.name} ({(file?.size ? file.size / 1024 : 0).toFixed(2)} KB)
            </Text>
          </Box>
        ) : (
          <Flex flexDir="column" alignItems="center" py={6} gap={2}>
            <Box as="svg" w={12} h={12} color={dropZoneIconColor} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z" />
            </Box>
            <Text fontSize="sm" color={dropZoneTextColor}>
              Drag & drop your sketch here or click to browse
            </Text>
            <Text fontSize="xs" color={dropZoneIconColor}>
              Supports JPEG, PNG, GIF (Max: 5MB)
            </Text>
          </Flex>
        )}
      </Box>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif"
        style={{ display: 'none' }}
      />
      
      {/* Error message */}
      {error && (
        <Alert status="error" mt={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      {/* Optional prompt */}
      {preview && (
        <Box mt={6}>
          <FormLabel htmlFor="prompt" fontSize="sm" fontWeight="medium" color={labelColor} mb={1}>
            Name (will be displayed on dashboard)
          </FormLabel>
          <Textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a name for your process/image"
            size="md"
            borderRadius="md"
            bg={textareaBg}
            borderColor={textareaBorderColor}
            _hover={{ borderColor: textareaFocusBorderColor }}
            _focus={{ borderColor: textareaFocusBorderColor }}
            maxLength={500}
          />
        </Box>
      )}
      
      {/* Progress bar */}
      {uploading && (
        <Box width="full" mt={6}>
          <Progress 
            value={uploadProgress} 
            size="sm" 
            colorScheme="blue"
            borderRadius="full"
          />
          <Text fontSize="xs" textAlign="right" mt={1} color={progressTextColor}>
            {uploadProgress}%
          </Text>
        </Box>
      )}
    </Box>
  );
});

export default SketchUpload; 