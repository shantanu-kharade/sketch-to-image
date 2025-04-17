import React from 'react';
import {
  Container,
  Heading,
  Text,
  Box,
  SimpleGrid,
  VStack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';

const TeamMember = ({ name, role, email }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={cardBorder}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      height="100%"
    >
      <VStack spacing={4} align="center">
        <Avatar
          size="xl"
          name={name}
          bg="primary.500"
          color="white"
          fontSize="2xl"
        />
        <Heading size="md" textAlign="center">
          {name}
        </Heading>
        <Text color="gray.600" textAlign="center">
          {role}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {email}
        </Text>
      </VStack>
    </Box>
  );
};

const About = () => {
  const teamMembers = [
    {
      name: 'Shantanu Kharade',
      role: 'Team Lead, Backend Development',
      email: 'shantanu_kharade_aids@moderncoe.edu.in',
    },
    {
      name: 'Pranav Asane',
      role: 'GAN Model Development',
      email: 'pranav_asane_aids@moderncoe.edu.in',
    },
    {
      name: 'Shubham Tapale',
      role: 'Database and Frontend Development',
      email: 'shubham_tapale_aids@moderncoe.edu.in',
    },
    {
      name: 'Neeraj Kalambe',
      role: 'Frontend Development',
      email: 'neeraj_kalambe_aids@moderncoe.edu.in',
    },
  ];

  return (
    <Container maxW="container.xl" py={16}>
      <Heading as="h1" size="2xl" textAlign="center" mb={12}>
        About Our Project
      </Heading>

      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6}>
          Project Overview
        </Heading>
        <Text fontSize="lg" mb={4}>
          Our Sketch-to-Image project is an innovative application that transforms hand-drawn sketches into detailed images using advanced AI technology. This project combines the power of Generative Adversarial Networks (GANs) with modern web development to create a seamless user experience.
        </Text>
        <Text fontSize="lg">
          The application allows users to upload their sketches and receive AI-generated images that maintain the essence of their original drawings while adding realistic details and textures. This technology has various applications in art, design, and creative industries.
        </Text>
      </Box>

      <Box>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>
          Our Team
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default About; 