import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, uploadUserAvatar, getUserProfile, UserProfile } from '../services/userService';
import Footer from '../components/Footer';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Avatar,
  useToast,
  Container,
  Flex,
  Divider,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  useColorModeValue,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  Stack,
  StackDivider,
  SimpleGrid,
  Spinner,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon, SettingsIcon, LockIcon } from '@chakra-ui/icons';

const ProfilePage: React.FC = () => {
  const { user, userProfile, refreshUserProfile, updateUserPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(userProfile?.username || '');
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [editMode, setEditMode] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileStats, setProfileStats] = useState({
    sketches: 0,
    generatedImages: 0,
    accountAge: 0
  });
  
  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const toast = useToast();
  
  // Color tokens
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.900');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');

  useEffect(() => {
    // Reset form values when userProfile changes
    if (userProfile) {
      setUsername(userProfile.username || '');
      setFullName(userProfile.full_name || '');
      setBio(userProfile.bio || '');
      
      // Calculate account age in days
      if (userProfile.created_at) {
        const createdDate = new Date(userProfile.created_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setProfileStats(prev => ({
          ...prev,
          accountAge: diffDays
        }));
      }
    }
  }, [userProfile]);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleProfileUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!user) return;
    
    // Validate username (optional)
    if (username.trim() && username.trim().length < 3) {
      toast({
        title: 'Invalid username',
        description: 'Username must be at least 3 characters long.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    try {
      // Prepare the update data - ensure all fields are included even if empty
      await updateUserProfile(user.id, {
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim(),
        avatar_url: userProfile?.avatar_url || undefined
      });
      
      // Refresh the profile context
      await refreshUserProfile();
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setEditMode(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'There was an error updating your profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    // Reset to original values
    setUsername(userProfile?.username || '');
    setFullName(userProfile?.full_name || '');
    setBio(userProfile?.bio || '');
    setEditMode(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, or GIF).',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 2MB.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      setAvatarLoading(true);
      try {
        const avatarUrl = await uploadUserAvatar(user.id, file);
        
        if (!avatarUrl) {
          throw new Error('Failed to get avatar URL after upload');
        }

        // Force refresh the profile to get the new avatar
        await refreshUserProfile();
        
        // Force re-render of the avatar
        const timestamp = Date.now();
        if (userProfile) {
          userProfile.avatar_url = `${avatarUrl}?t=${timestamp}`;
        }
        
        toast({
          title: 'Avatar updated',
          description: 'Your profile picture has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error: any) {
        console.error('Error uploading avatar:', error);
        toast({
          title: 'Upload failed',
          description: error.message || 'There was an error uploading your avatar. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Basic validation
    if (!currentPassword) {
      toast({
        title: 'Current password required',
        description: 'Please enter your current password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'New password must be at least 6 characters long.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'New password and confirmation do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setPasswordLoading(true);
    try {
      const { success, error } = await updateUserPassword(currentPassword, newPassword);
      
      if (success) {
        toast({
          title: 'Password updated',
          description: 'Your password has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Reset form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Hide password section after successful update
        setShowPasswordSection(false);
      } else {
        toast({
          title: 'Update failed',
          description: error?.message || 'There was an error updating your password. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'There was an error updating your password. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1">
        <Container maxW="container.lg" py={10}>
          <Tabs variant="enclosed" colorScheme="blue" size="md">
            <TabList>
              <Tab fontWeight="medium">
                <Flex align="center">
                  <Box mr={2}>
                    <svg width="1em" height="1em" viewBox="0 0 496 512">
                      <path 
                        fill="currentColor" 
                        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z" 
                      />
                    </svg>
                  </Box>
                  <Text>Profile</Text>
                </Flex>
              </Tab>
              <Tab fontWeight="medium">
                <Flex align="center">
                  <Box mr={2}>
                    <svg width="1em" height="1em" viewBox="0 0 512 512">
                      <path 
                        fill="currentColor" 
                        d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z" 
                      />
                    </svg>
                  </Box>
                  <Text>Activity</Text>
                </Flex>
              </Tab>
              <Tab fontWeight="medium">
                <Flex align="center">
                  <SettingsIcon mr={2} />
                  <Text>Settings</Text>
                </Flex>
              </Tab>
            </TabList>

            <TabPanels mt={4}>
              {/* Profile Tab */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {/* Left Column - Avatar and Quick Info */}
                  <Card bg={bgColor} boxShadow="md" borderRadius="lg" overflow="hidden">
                    <CardBody p={0}>
                      <Box 
                        position="relative" 
                        height="120px" 
                        bg="blue.500" 
                        bgGradient="linear(to-r, primary.500, secondary.500)"
                      />
                      
                      <Box 
                        position="relative" 
                        mt="-50px" 
                        textAlign="center" 
                        px={6} 
                        pb={6}
                      >
                        <Box position="relative" display="inline-block">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/jpeg,image/png,image/gif"
                            style={{ display: 'none' }}
                          />
                          <Avatar 
                            size="xl" 
                            src={userProfile?.avatar_url ? `${userProfile.avatar_url}?t=${Date.now()}` : undefined}
                            name={userProfile?.full_name || userProfile?.username || user.email}
                            border="4px solid white"
                            position="relative"
                            key={userProfile?.avatar_url} 
                            ignoreFallback={true}
                            onClick={handleAvatarClick}
                            cursor="pointer"
                          />
                          {avatarLoading ? (
                            <Spinner 
                              position="absolute" 
                              right="0" 
                              bottom="0" 
                              size="sm" 
                              bg="white" 
                              p={1} 
                              borderRadius="full" 
                            />
                          ) : (
                            <IconButton
                              aria-label="Change profile picture"
                              icon={
                                <svg width="1em" height="1em" viewBox="0 0 512 512">
                                  <path 
                                    fill="currentColor" 
                                    d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z" 
                                  />
                                </svg>
                              }
                              size="sm"
                              colorScheme="blue"
                              position="absolute"
                              right="0"
                              bottom="0"
                              borderRadius="full"
                              onClick={handleAvatarClick}
                            />
                          )}
                        </Box>
                        
                        <VStack mt={4} spacing={1}>
                          <Heading size="md">{userProfile?.full_name || userProfile?.username || 'Set Your Name'}</Heading>
                          {userProfile?.username && (
                            <Text color="gray.500" fontSize="sm">@{userProfile.username}</Text>
                          )}
                          <Badge colorScheme="blue" mt={2} px={2} py={1} borderRadius="full">
                            {profileStats.accountAge > 0 
                              ? `Member for ${profileStats.accountAge} days` 
                              : 'New Member'}
                          </Badge>
                        </VStack>
                      </Box>
                    </CardBody>
                  </Card>

                  {/* Right Column - Profile Info */}
                  <Card gridColumn={{ md: "2 / span 2" }} bg={bgColor} boxShadow="md" borderRadius="lg">
                    <CardHeader bg={headerBg} p={4} borderBottom="1px" borderColor={borderColor}>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Profile Information</Heading>
                        {!editMode ? (
                          <IconButton
                            aria-label="Edit profile"
                            icon={<EditIcon />}
                            size="sm"
                            onClick={() => setEditMode(true)}
                            variant="ghost"
                          />
                        ) : (
                          <HStack>
                            <IconButton
                              aria-label="Cancel"
                              icon={<CloseIcon />}
                              size="sm"
                              onClick={cancelEdit}
                              variant="ghost"
                              colorScheme="red"
                            />
                            <IconButton
                              aria-label="Save changes"
                              icon={<CheckIcon />}
                              size="sm"
                              onClick={() => handleProfileUpdate()}
                              isLoading={loading}
                              colorScheme="green"
                            />
                          </HStack>
                        )}
                      </Flex>
                    </CardHeader>
                    
                    <CardBody p={6}>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleProfileUpdate(e);
                      }}>
                        <Stack divider={<StackDivider />} spacing={4}>
                          <Box>
                            <FormControl>
                              <FormLabel fontWeight="bold">Username</FormLabel>
                              {editMode ? (
                                <>
                                  <Input 
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    bg="white"
                                    borderColor={borderColor}
                                  />
                                  <Text fontSize="xs" color="gray.500" mt={1}>
                                    Your username will be displayed publicly on your profile and in the header.
                                  </Text>
                                </>
                              ) : (
                                <Text>{userProfile?.username || 'Not set'}</Text>
                              )}
                            </FormControl>
                          </Box>
                          
                          <Box>
                            <FormControl>
                              <FormLabel fontWeight="bold">Full Name</FormLabel>
                              {editMode ? (
                                <Input 
                                  placeholder="Your full name"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  bg="white"
                                  borderColor={borderColor}
                                />
                              ) : (
                                <Text>{userProfile?.full_name || 'Not set'}</Text>
                              )}
                            </FormControl>
                          </Box>
                          
                          <Box>
                            <FormControl>
                              <FormLabel fontWeight="bold">Bio</FormLabel>
                              {editMode ? (
                                <Textarea 
                                  placeholder="Tell us about yourself"
                                  value={bio}
                                  onChange={(e) => setBio(e.target.value)}
                                  rows={4}
                                  bg="white"
                                  borderColor={borderColor}
                                />
                              ) : (
                                <Text>{userProfile?.bio || 'No bio added yet.'}</Text>
                              )}
                            </FormControl>
                          </Box>
                          
                          <Box>
                            <FormLabel fontWeight="bold">Email</FormLabel>
                            <Flex align="center">
                              <Text mr={2}>{user.email}</Text>
                              <Tooltip label="Email verified">
                                <Badge colorScheme="green">Verified</Badge>
                              </Tooltip>
                            </Flex>
                          </Box>
                          
                          <Box>
                            <FormLabel fontWeight="bold">Account Created</FormLabel>
                            <Text>{new Date(user.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'
                            })}</Text>
                          </Box>
                        </Stack>
                        
                        {editMode && (
                          <HStack justifyContent="flex-end" pt={6} display={{ base: 'flex', md: 'flex' }}>
                            <Button 
                              onClick={cancelEdit}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleProfileUpdate()}
                              colorScheme="blue"
                              isLoading={loading}
                            >
                              Save Changes
                            </Button>
                          </HStack>
                        )}
                      </form>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                
                {/* Password Change Card */}
                {showPasswordSection && (
                  <Card bg={bgColor} boxShadow="md" borderRadius="lg" mt={6} className="password-change-card">
                    <CardHeader bg={headerBg} p={4} borderBottom="1px" borderColor={borderColor}>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Change Password</Heading>
                        <IconButton
                          aria-label="Close"
                          icon={<CloseIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPasswordSection(false)}
                        />
                      </Flex>
                    </CardHeader>
                    
                    <CardBody p={6}>
                      <form onSubmit={handlePasswordUpdate}>
                        <Stack divider={<StackDivider />} spacing={4}>
                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">Current Password</FormLabel>
                            <Input 
                              type={showPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter your current password"
                            />
                          </FormControl>
                          
                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">New Password</FormLabel>
                            <Input 
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter your new password"
                            />
                          </FormControl>
                          
                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">Confirm New Password</FormLabel>
                            <Input 
                              type={showPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm your new password"
                            />
                          </FormControl>
                          
                          <Box>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowPassword(!showPassword)}
                              mb={4}
                            >
                              {showPassword ? "Hide" : "Show"} Passwords
                            </Button>
                            
                            <Text fontSize="sm" color="gray.500">
                              Password must be at least 6 characters long.
                            </Text>
                          </Box>
                        </Stack>
                        
                        <Flex justifyContent="flex-end" mt={6}>
                          <Button 
                            type="submit"
                            colorScheme="blue"
                            isLoading={passwordLoading}
                          >
                            Update Password
                          </Button>
                        </Flex>
                      </form>
                    </CardBody>
                  </Card>
                )}
              </TabPanel>

              {/* Activity Tab */}
              <TabPanel>
                <Card bg={bgColor} boxShadow="md" borderRadius="lg">
                  <CardHeader bg={headerBg} p={4} borderBottom="1px" borderColor={borderColor}>
                    <Heading size="md">Recent Activity</Heading>
                  </CardHeader>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <Text>Your recent sketches and generated images will appear here.</Text>
                      <Box p={8} textAlign="center">
                        <Button 
                          colorScheme="blue" 
                          onClick={() => navigate('/dashboard')}
                        >
                          Go to Dashboard
                        </Button>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel>
                <Card bg={bgColor} boxShadow="md" borderRadius="lg">
                  <CardHeader bg={headerBg} p={4} borderBottom="1px" borderColor={borderColor}>
                    <Heading size="md">Account Settings</Heading>
                  </CardHeader>
                  <CardBody p={6}>
                    <Stack divider={<StackDivider />} spacing={4}>
                      <Box>
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="bold">Change Password</Text>
                            <Text fontSize="sm" color="gray.500">Update your account password</Text>
                          </Box>
                          <Button 
                            leftIcon={<LockIcon />} 
                            variant="outline"
                            onClick={() => {
                              // Switch to profile tab (index 0) and show password section
                              const tabsEl = document.querySelector('[role="tablist"]');
                              if (tabsEl) {
                                const tabButtons = tabsEl.querySelectorAll('[role="tab"]');
                                if (tabButtons && tabButtons.length > 0) {
                                  (tabButtons[0] as HTMLElement).click();
                                  setShowPasswordSection(true);
                                  
                                  // Give time for tab to render, then scroll to password section
                                  setTimeout(() => {
                                    const passwordCard = document.querySelector('.password-change-card');
                                    if (passwordCard) {
                                      passwordCard.scrollIntoView({ behavior: 'smooth' });
                                    }
                                  }, 100);
                                }
                              }
                            }}
                          >
                            Change Password
                          </Button>
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="bold" color="red.500">Delete Account</Text>
                            <Text fontSize="sm" color="gray.500">Permanently delete your account and all data</Text>
                          </Box>
                          <Button colorScheme="red" variant="outline" onClick={onOpen}>
                            Delete Account
                          </Button>
                        </Flex>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
        
        {/* Delete Account Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? This will permanently delete your account and all associated data.
                This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" ml={3}>
                  Delete Account
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
      
      <Footer />
    </Flex>
  );
};

export default ProfilePage; 