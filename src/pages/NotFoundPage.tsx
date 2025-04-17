import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Container,
  Flex 
} from '@chakra-ui/react';
import Footer from '../components/Footer';

const NotFoundPage: React.FC = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1">
        <Container maxW="container.md" py={10}>
          <VStack spacing={6} textAlign="center" justify="center" h="full" py={10}>
            <Heading as="h1" fontSize="6xl" fontWeight="bold" color="gray.800">404</Heading>
            <Heading as="h2" fontSize="2xl" fontWeight="semibold" color="gray.600">Page Not Found</Heading>
            <Text color="gray.500" maxW="md" mx="auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Text>
            <Button 
              as={RouterLink} 
              to="/" 
              colorScheme="blue" 
              size="md"
            >
              Return to Home
            </Button>
          </VStack>
        </Container>
      </Box>
      
      <Footer />
    </Flex>
  );
};

export default NotFoundPage; 