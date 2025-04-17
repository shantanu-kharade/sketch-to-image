import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
} from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      // Show success message
      alert('Login successful');
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      alert(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Stack gap={4} align="center" width="100%">
        <Heading as="h1" size="lg">Log In</Heading>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack gap={4} width="100%">
            <div style={{ width: '100%' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                width="100%"
              />
            </div>

            <div style={{ width: '100%' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
                width="100%"
              />
              {error && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {error}
                </div>
              )}
            </div>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              mt={4}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </Stack>
        </form>
        
        <Text mt={4} width="100%" textAlign="center">
          Don't have an account?{' '}
          <Text
            as="a"
            href="/signup"
            color="blue.500"
            fontWeight="semibold"
            textDecoration="underline"
            _hover={{ color: "blue.600" }}
          >
            Sign Up
          </Text>
        </Text>
      </Stack>
    </Box>
  );
};

export default Login; 