import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadSketch } from '../services/sketchService';
import { useAuth } from '../context/AuthContext';

const SketchUploadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type (only images)
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to upload sketches');
      return;
    }
    
    if (!file) {
      setError('Please select a sketch to upload');
      return;
    }
    
    if (!name.trim()) {
      setError('Please provide a name for your sketch');
      return;
    }
    
    try {
      setLoading(true);
      await uploadSketch(file, user.id, name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error uploading sketch:', error);
      setError('Failed to upload sketch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Sketch</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Sketch Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="sketch" className="block text-gray-700 mb-2">
            Upload Sketch
          </label>
          <input
            type="file"
            id="sketch"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
            ref={fileInputRef}
            required
          />
          
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={preview} 
                alt="Sketch Preview" 
                className="max-w-xs h-48 object-contain border border-gray-200 rounded"
              />
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md ${
              loading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Sketch'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SketchUploadForm; 