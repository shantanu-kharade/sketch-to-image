import { supabase } from '../supabase';

// User profile interface
export interface UserProfile {
  id: string;              // Matches auth.users.id
  username?: string;       // Optional username
  full_name?: string;      // Full name of the user
  avatar_url?: string;     // Profile picture URL
  bio?: string;            // User biography/description
  email: string;           // Email address (from auth)
  created_at?: string;     // Account creation date
  updated_at?: string;     // Last update date
  preferences?: any;       // JSON field for user preferences
}

/**
 * Create a new user profile after signup
 */
export const createUserProfile = async (
  userId: string,
  email: string,
  fullName?: string
): Promise<UserProfile | null> => {
  try {
    const newProfile: Partial<UserProfile> = {
      id: userId,
      email,
      full_name: fullName || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Use the RPC function to get user profile
    const { data, error } = await supabase
      .rpc('get_user_profile', {
        user_id: userId
      });

    if (error) {
      throw error;
    }

    return data[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Update a user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    // Create a clean copy of updates
    const cleanUpdates: Partial<UserProfile> = { ...updates };
    
    // Make sure to update the updated_at timestamp
    const updatedProfile: Partial<UserProfile> = {
      ...cleanUpdates,
      updated_at: new Date().toISOString()
    };

    // Check if username is changing and is not undefined
    if (updatedProfile.username !== undefined) {
      // Check if the username is already taken (only if it has content)
      if (updatedProfile.username && updatedProfile.username.trim() !== '') {
        const { data: existingUser, error: checkError } = await supabase
          .from('user_management.user_profiles')
          .select('id')
          .eq('username', updatedProfile.username)
          .neq('id', userId)
          .single();

        if (!checkError && existingUser) {
          throw new Error('Username is already taken. Please choose a different one.');
        }
      }
    }

    // Update the profile using the RPC function
    const { data, error } = await supabase
      .rpc('update_user_profile', {
        user_id: userId,
        new_username: updatedProfile.username,
        new_full_name: updatedProfile.full_name,
        new_bio: updatedProfile.bio,
        new_avatar_url: updatedProfile.avatar_url
      });

    if (error) {
      console.error('Supabase error updating profile:', error);
      throw new Error(error.message || 'Error updating profile');
    }

    return data[0] || null;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Upload a user avatar image
 */
export const uploadUserAvatar = async (
  userId: string,
  file: File
): Promise<string | null> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '0',
        upsert: true // Overwrite any existing file with same name
      });

    if (uploadError) {
      console.error('Error uploading avatar to storage:', uploadError);
      throw new Error(uploadError.message || 'Error uploading avatar');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get avatar public URL');
    }

    // Update user profile with new avatar URL using RPC function
    const { error: updateError } = await supabase.rpc('update_user_profile', {
      user_id: userId,
      new_username: undefined,
      new_full_name: undefined,
      new_bio: undefined,
      new_avatar_url: urlData.publicUrl
    });

    if (updateError) {
      console.error('Error updating profile with avatar:', updateError);
      throw new Error('Failed to update profile with new avatar URL');
    }

    // Force refresh the avatar URL by adding a timestamp
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

/**
 * Delete a user's account and all associated data
 */
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    // Delete user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    // Delete user sketches (this would cascade delete from the sketches table)
    // But we'll handle file deletion from storage manually
    const { data: sketches } = await supabase
      .from('sketches')
      .select('original_url')
      .eq('user_id', userId);

    if (sketches && sketches.length > 0) {
      // Extract file paths from URLs and delete from storage
      const filePaths = sketches.map(sketch => {
        const url = sketch.original_url;
        const path = url.split('/').slice(-2).join('/');
        return path;
      });

      // Delete files from storage
      await supabase.storage
        .from('sketches')
        .remove(filePaths);
    }

    // Delete user auth account (must be done by the user or from server-side)
    // Note: This cannot be done from client-side with anon key due to security
    // This is just for example - in production this would be handled via a server function
    /* 
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      throw authError;
    }
    */

    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    return false;
  }
};

/**
 * Update a user's password
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // First verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getUser()).data.user?.email || '',
      password: currentPassword,
    });

    if (signInError) {
      return { 
        success: false, 
        error: new Error('Current password is incorrect') 
      };
    }

    // If current password is correct, update to the new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { 
      success: false, 
      error: error as Error 
    };
  }
}; 