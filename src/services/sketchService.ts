import { supabase } from '../supabase';
import { processSketchWithGAN } from './ganService';

// Define types for sketch data
export interface SketchData {
  id?: string;
  user_id: string;
  original_url: string;
  processed_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at?: string;
  prompt?: string;
}

/**
 * Upload a sketch image to Supabase storage
 */
export const uploadSketchImage = async (
  file: File,
  userId: string
): Promise<{ url: string; filePath: string } | null> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('sketches')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('sketches')
      .getPublicUrl(filePath);
    
    return { 
      url: data.publicUrl,
      filePath 
    };
  } catch (error) {
    console.error('Error uploading sketch:', error);
    return null;
  }
};

/**
 * Save sketch metadata to the database
 */
export const saveSketchData = async (
  sketchData: SketchData
): Promise<SketchData | null> => {
  try {
    const { data, error } = await supabase
      .from('sketches')
      .insert(sketchData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving sketch data:', error);
    return null;
  }
};

/**
 * Get all sketches for a user
 */
export const getUserSketches = async (userId: string): Promise<SketchData[]> => {
  try {
    const { data, error } = await supabase
      .from('sketches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user sketches:', error);
    return [];
  }
};

/**
 * Get a specific sketch by ID
 */
export const getSketchById = async (sketchId: string): Promise<SketchData | null> => {
  try {
    const { data, error } = await supabase
      .from('sketches')
      .select('*')
      .eq('id', sketchId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching sketch:', error);
    return null;
  }
};

/**
 * Delete a sketch and its file from storage
 */
export const deleteSketch = async (sketchId: string, filePath: string): Promise<boolean> => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('sketches')
      .remove([filePath]);
    
    if (storageError) {
      throw storageError;
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('sketches')
      .delete()
      .eq('id', sketchId);
    
    if (dbError) {
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting sketch:', error);
    return false;
  }
};

/**
 * Upload a processed image to Supabase storage
 */
export const uploadProcessedImage = async (
  imageData: Blob,
  userId: string,
  sketchId: string
): Promise<{ url: string; filePath: string } | null> => {
  try {
    // Create a unique file name for the processed image
    const fileName = `processed_${sketchId}_${Date.now()}.png`;
    const filePath = `${userId}/processed/${fileName}`;
    
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('sketches')
      .upload(filePath, imageData, {
        contentType: 'image/png'
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('sketches')
      .getPublicUrl(filePath);
    
    return { 
      url: data.publicUrl,
      filePath 
    };
  } catch (error) {
    console.error('Error uploading processed image:', error);
    return null;
  }
};

/**
 * Send a sketch for processing
 */
export const processSketch = async (
  sketchId: string, 
  originalFile: File,
  userId: string,
  prompt?: string
): Promise<boolean> => {
  try {
    // Update status to processing
    const { error: updateError } = await supabase
      .from('sketches')
      .update({ 
        status: 'processing',
        prompt: prompt || null
      })
      .eq('id', sketchId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Process the sketch with our GAN model
    const ganResult = await processSketchWithGAN(originalFile);
    
    if (!ganResult.success || !ganResult.imageData) {
      // Update status to failed if GAN processing failed
      await supabase
        .from('sketches')
        .update({ status: 'failed' })
        .eq('id', sketchId);
      
      throw new Error(ganResult.error || 'GAN processing failed');
    }
    
    // Upload the processed image to Supabase Storage
    const uploadResult = await uploadProcessedImage(ganResult.imageData, userId, sketchId);
    
    if (!uploadResult) {
      throw new Error('Failed to upload processed image');
    }
    
    // Update the sketch record with the processed image URL
    const { error: finalUpdateError } = await supabase
      .from('sketches')
      .update({ 
        status: 'completed',
        processed_url: uploadResult.url  // Use the Supabase storage URL
      })
      .eq('id', sketchId);
    
    if (finalUpdateError) {
      throw finalUpdateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error processing sketch:', error);
    return false;
  }
};

/**
 * Upload a sketch - combines uploadSketchImage and saveSketchData
 */
export const uploadSketch = async (
  file: File,
  userId: string,
  name: string
): Promise<SketchData | null> => {
  try {
    // First upload the image
    const uploadResult = await uploadSketchImage(file, userId);
    
    if (!uploadResult) {
      throw new Error('Failed to upload image');
    }
    
    // Then save the sketch data
    const sketchData: SketchData = {
      user_id: userId,
      original_url: uploadResult.url,
      status: 'pending',
      prompt: name  // This field is used as the sketch name on the dashboard
    };
    
    const savedSketch = await saveSketchData(sketchData);
    if (!savedSketch) {
      throw new Error('Failed to save sketch data');
    }
    
    // Process the sketch with our GAN model
    await processSketch(savedSketch.id!, file, userId, name);
    
    return savedSketch;
  } catch (error) {
    console.error('Error in uploadSketch:', error);
    return null;
  }
}; 