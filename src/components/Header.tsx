import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Flex, 
  Button, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Avatar,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Container,
  HStack,
  useColorModeValue,
  useColorMode,
  Divider
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  // Move all useColorModeValue calls to the top level
  const headerBg = useColorModeValue('light.header', 'dark.header');
  const borderColor = useColorModeValue('gray.200', 'dark.border');
  const textColor = useColorModeValue('gray.800', 'white');
  const activeNavBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');
  const logoGradient = 'linear(to-r, primary.600, secondary.600)';
  const logoBg = useColorModeValue('primary.500', 'primary.400');
  const avatarBorderColor = useColorModeValue('primary.100', 'primary.800');
  const profileIconBg = useColorModeValue('blue.100', 'blue.900');
  const logoutIconBg = useColorModeValue('red.100', 'red.900');

  // Determine if current path is active for navigation highlighting
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Box 
      className="header-blur"
      position="sticky" 
      top={0} 
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link to="/">
            <HStack spacing={2}>
              <Box 
                bg={logoBg}
                w={8} 
                h={8} 
                borderRadius="md" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Text fontSize="lg" fontWeight="extrabold" color="white">S2I</Text>
              </Box>
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                bgGradient={logoGradient}
                bgClip="text"
              >
                Sketch2Image
              </Text>
            </HStack>
          </Link>

          {/* Desktop Navigation */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            {user ? (
              <>
                <ThemeToggle />
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    bg={isActive('/dashboard') ? activeNavBg : 'transparent'}
                    color={textColor}
                    _hover={{ bg: activeNavBg }}
                  >
                    Dashboard
                  </Button>
                </Link>
                
                <Link to="/upload">
                  <Button 
                    variant="ghost" 
                    bg={isActive('/upload') ? activeNavBg : 'transparent'} 
                    color={textColor}
                    _hover={{ bg: activeNavBg }}
                  >
                    Upload Sketch
                  </Button>
                </Link>
                
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg="transparent"
                    _hover={{ bg: activeNavBg }}
                    ml={2}
                  >
                    <Flex alignItems="center">
                      <Avatar 
                        size="sm" 
                        src={userProfile?.avatar_url}
                        name={userProfile?.full_name || userProfile?.username || user.email} 
                        mr={2}
                        borderWidth="2px"
                        borderColor={avatarBorderColor}
                      />
                      <Text display={{ base: 'none', lg: 'block' }} color={textColor}>
                        {userProfile?.username || userProfile?.full_name || user.email}
                      </Text>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem 
                      icon={<Box w={4} h={4} bg={profileIconBg} borderRadius="full" />}
                      _hover={{ bg: activeNavBg }}
                      onClick={() => navigate('/profile')}
                    >
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      icon={<Box w={4} h={4} bg={logoutIconBg} borderRadius="full" />}
                      _hover={{ bg: activeNavBg }}
                      onClick={handleLogout}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login">
                  <Button variant="ghost" color={textColor} _hover={{ bg: activeNavBg }}>
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    colorScheme="primary"
                    size="sm"
                    px={6}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </HStack>

          {/* Mobile Navigation */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
            _hover={{ bg: activeNavBg }}
          />

          <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                <HStack spacing={2}>
                  <Box 
                    bg={logoBg}
                    w={6} 
                    h={6} 
                    borderRadius="md" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Text fontSize="xs" fontWeight="extrabold" color="white">S2I</Text>
                  </Box>
                  <Text fontWeight="bold">Menu</Text>
                </HStack>
              </DrawerHeader>

              <DrawerBody pt={4}>
                <VStack spacing={2} align="stretch">
                  <Flex alignItems="center" p={2} borderRadius="md" bg={activeNavBg}>
                    <ThemeToggle />
                    <Text ml={2} fontWeight="medium" fontSize="sm">
                      {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                  </Flex>
                  
                  {user ? (
                    <>
                      <Flex alignItems="center" mb={4} p={2} borderRadius="md" bg={activeNavBg}>
                        <Avatar 
                          size="sm" 
                          src={userProfile?.avatar_url}
                          name={userProfile?.full_name || userProfile?.username || user.email} 
                          mr={3}
                          borderWidth="2px"
                          borderColor={avatarBorderColor}
                        />
                        <Text fontWeight="medium" fontSize="sm">
                          {userProfile?.username || userProfile?.full_name || user.email}
                        </Text>
                      </Flex>
                      
                      <Link to="/dashboard" onClick={onClose}>
                        <Button 
                          variant="ghost" 
                          w="full" 
                          justifyContent="flex-start" 
                          borderRadius="md"
                          bg={isActive('/dashboard') ? activeNavBg : 'transparent'}
                          _hover={{ bg: activeNavBg }}
                          leftIcon={<Box w={2} h={2} bg="primary.500" borderRadius="full" />}
                        >
                          Dashboard
                        </Button>
                      </Link>
                      
                      <Link to="/upload" onClick={onClose}>
                        <Button 
                          variant="ghost" 
                          w="full" 
                          justifyContent="flex-start"
                          borderRadius="md"
                          bg={isActive('/upload') ? activeNavBg : 'transparent'}
                          _hover={{ bg: activeNavBg }}
                          leftIcon={<Box w={2} h={2} bg="secondary.500" borderRadius="full" />}
                        >
                          Upload Sketch
                        </Button>
                      </Link>
                      
                      <Link to="/profile" onClick={onClose}>
                        <Button 
                          variant="ghost" 
                          w="full" 
                          justifyContent="flex-start"
                          borderRadius="md"
                          bg={isActive('/profile') ? activeNavBg : 'transparent'}
                          _hover={{ bg: activeNavBg }}
                          leftIcon={<Box w={2} h={2} bg="blue.500" borderRadius="full" />}
                        >
                          Profile
                        </Button>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        w="full"
                        justifyContent="flex-start"
                        onClick={handleLogout}
                        leftIcon={<Box w={2} h={2} bg="red.500" borderRadius="full" />}
                        _hover={{ bg: activeNavBg }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={onClose}>
                        <Button variant="ghost" w="full" justifyContent="flex-start">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={onClose}>
                        <Button colorScheme="primary" w="full">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 