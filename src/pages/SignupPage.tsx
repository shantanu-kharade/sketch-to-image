import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Heading, Flex } from '@chakra-ui/react';
import SignUp from '../components/SignUp';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const SignupPage = () => {
  const { user, loading } = useAuth();

  // If already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1">
        <Container maxW="container.md" py={10}>
          <Box textAlign="center" mb={8}>
            <Heading as="h1" size="xl">Create an Account</Heading>
            <Heading as="h2" size="md" fontWeight="normal" mt={2}>
              Sign up to start creating sketch-to-image transformations
            </Heading>
          </Box>
          
          <SignUp />
        </Container>
      </Box>
      
      <Footer />
    </Flex>
  );
};

export default SignupPage; 