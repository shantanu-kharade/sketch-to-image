import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Heading, 
  Text, 
  Link
} from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <Box bg="gray.900" color="white" w="full" mt="auto">
      {/* Main Footer */}
      <Box py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={[1, 1, 3]} gap={10} maxW="6xl" mx="auto">
            <VStack align="center">
              <Heading as="h3" fontSize="xl" fontWeight="bold" mb={6} textAlign="center">Sketch to Image</Heading>
              <Text color="gray.400" mb={4} lineHeight="relaxed" textAlign="center" maxW="xs">
                Transform your sketches into realistic images using our AI-powered platform.
              </Text>
              {/* Adding logo-like element */}
              <HStack spacing={2} opacity={0.8} justify="center">
                <Box w="6" h="6" borderRadius="md" bgGradient="linear(to-tr, primary.400, secondary.400)"></Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.300">AI-Powered</Text>
              </HStack>
            </VStack>
            
            <VStack align="center">
              <Heading as="h4" fontSize="lg" fontWeight="medium" mb={6} textAlign="center">Quick Links</Heading>
              <VStack spacing={3} align="center">
                <Link as={RouterLink} to="/" color="gray.400" _hover={{ color: "white" }} transition="colors 0.2s">Home</Link>
                <Link as={RouterLink} to="/about" color="gray.400" _hover={{ color: "white" }} transition="colors 0.2s">About</Link>
                <Link as={RouterLink} to="/contact" color="gray.400" _hover={{ color: "white" }} transition="colors 0.2s"></Link>
              </VStack>
            </VStack>
            
            <VStack align="center">
              <Heading as="h4" fontSize="lg" fontWeight="medium" mb={6} textAlign="center">Connect With Us</Heading>
              <Text color="gray.400" mb={4} textAlign="center"></Text>
              <HStack spacing={5} justify="center">
                <Link href="#" color="gray.400" _hover={{ color: "white" }} transition="colors 0.2s" aria-label="GitHub">
                  <Box as="svg" h="7" w="7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </Box>
                </Link>
              </HStack>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Copyright Section */}
      <Box bg="gray.900" py={4} borderTop="1px" borderColor="gray.800">
        <Container maxW="container.xl">
          <Text textAlign="center" fontSize="sm" color="gray.400">&copy; {new Date().getFullYear()} Sketch to Image. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer; 