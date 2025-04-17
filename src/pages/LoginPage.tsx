import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Container,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Theme values
  const cardBg = useColorModeValue('white', 'dark.card');
  const cardBorderColor = useColorModeValue('gray.200', 'dark.border');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      showNotification('success', 'Login successful! Welcome back.', 3000);
      navigate('/dashboard');
    } catch (error) {
      showNotification('error', 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2} color={headingColor}>
            Welcome Back
          </Heading>
          <Text color={textColor}>
            Sign in to continue to your dashboard
          </Text>
        </Box>

        <Card 
          bg={cardBg} 
          borderWidth="1px" 
          borderColor={cardBorderColor} 
          borderRadius="lg" 
          shadow="sm"
        >
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl id="email">
                  <FormLabel color={textColor}>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: 'blue.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                  />
                </FormControl>

                <FormControl id="password">
                  <FormLabel color={textColor}>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: 'blue.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign in
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        <Text textAlign="center" color={textColor}>
          Don't have an account?{' '}
          <Link as={RouterLink} to="/signup" color="blue.500">
            Sign up
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default LoginPage; 