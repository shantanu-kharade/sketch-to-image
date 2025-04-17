import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import Footer from '../components/Footer';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Spinner, 
  Center,
} from '@chakra-ui/react';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    // Get the URL hash and handle the callback
    const handleAuthCallback = async () => {
      try {
        // If we have a hash in the URL, process it
        if (window.location.hash) {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error processing auth callback:', error.message);
            navigate('/login');
            return;
          }
          
          if (data.session) {
            // If verification successful, redirect to dashboard
            navigate('/dashboard');
          } else {
            // Otherwise redirect to login
            navigate('/login');
          }
        } else if (session) {
          // If already logged in, redirect to dashboard
          navigate('/dashboard');
        } else {
          // If no hash and not logged in, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, session]);

  return (
    <Box minH="100vh" position="relative" pb="200px">
      <Container maxWidth="container.md" py={10}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>Verifying your account</Heading>
          <Text mb={8}>Please wait while we verify your authentication...</Text>
          <Center>
            <Spinner color="blue.500" borderWidth="4px" speed="0.65s" size="xl" />
          </Center>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default AuthCallbackPage; 