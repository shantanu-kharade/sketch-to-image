import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Image, 
  Link, 
  useColorModeValue
} from '@chakra-ui/react';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  // Parallax scroll effect for hero section with improved performance
  useEffect(() => {
    const handleScroll = () => {
      const heroImage = document.querySelector('.hero-image');
      const scrollValue = window.scrollY;
      if (heroImage) {
        (heroImage as HTMLElement).style.transform = `translateY(${scrollValue * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Chakra UI colors with dark mode support
  const bgGradient = "linear(to-r, primary.600, secondary.600)";
  const buttonTextColor = useColorModeValue("primary.600", "primary.400");
  const featuresBg = useColorModeValue("white", "gray.800");
  const featureCardBg = useColorModeValue("white", "gray.700");
  const featureCardBorder = useColorModeValue("gray.200", "gray.600");
  const featureCardHoverBg = useColorModeValue("gray.50", "gray.600");
  const featureCardHoverBorder = useColorModeValue("primary.200", "primary.500");
  const featureIconBg = useColorModeValue("primary.50", "primary.900");
  const featureIconColor = useColorModeValue("primary.600", "primary.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Colors for the "See it in action" section
  const sectionBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "dark.card");
  const cardBorderColor = useColorModeValue("gray.200", "dark.border");
  const cardTextColor = useColorModeValue("gray.500", "gray.400");
  const cardHeadingColor = useColorModeValue("gray.800", "white");
  const imageBg = useColorModeValue("gray.50", "gray.800");
  const badgeBg = useColorModeValue("white", "dark.card");
  const badgeColor = useColorModeValue("primary.600", "primary.400");
  const badgeBorderColor = useColorModeValue("gray.200", "dark.border");
  const footerBg = useColorModeValue("gray.50", "gray.800");

  // Colors for the CTA buttons
  const ctaButtonBg = useColorModeValue("white", "dark.card");
  const ctaButtonColor = useColorModeValue("primary.600", "primary.400");
  const ctaButtonHoverBg = useColorModeValue("gray.100", "dark.hover");
  const ctaButtonShadow = useColorModeValue("lg", "dark-lg");

  return (
    <Box minH="100vh">
      {/* Hero Section - Enhanced height and spacing */}
      <Box 
        as="section"
        bgGradient={bgGradient}
        color="white" 
        overflow="hidden" 
        position="relative" 
        minH={["80vh", "90vh"]} 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        w="full"
      >
        {/* Enhanced abstract background patterns */}
        <Box position="absolute" inset="0" opacity="0.2">
          <Box position="absolute" top="0" left="0" w="40%" h="40%" bg="white" borderRadius="full" filter="blur(100px)" transform="translate(-33%, -33%)"></Box>
          <Box position="absolute" bottom="0" right="0" w="60%" h="60%" bg="white" borderRadius="full" filter="blur(100px)" transform="translate(25%, 25%)"></Box>
          <Box position="absolute" top="50%" left="50%" w="25%" h="25%" bg="white" borderRadius="full" filter="blur(100px)" transform="translate(-50%, -50%)"></Box>
        </Box>
        
        <Container maxW="container.xl" py={[12, 16, 20, 24]} position="relative" zIndex="10">
          <VStack spacing={12} align="center" maxW="3xl" mx="auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ width: "100%" }}
            >
              <VStack spacing={8} align="center">
                <Heading 
                  as="h1" 
                  fontSize={["4xl", "5xl", "6xl"]} 
                  fontWeight="extrabold" 
                  lineHeight="tight" 
                  letterSpacing="tight"
                  textAlign="center"
                >
                  Turn your <Text as="span" bgGradient="linear(to-r, white, secondary.300)" bgClip="text">sketches</Text> into <br /> realistic images
                </Heading>
                
                <Text 
                  fontSize={["lg", "xl", "2xl"]} 
                  maxW="xl" 
                  color="white" 
                  lineHeight="relaxed" 
                  textAlign="center" 
                  fontWeight="light"
                >
                  Upload your sketches and our AI-powered GAN model will transform them into lifelike images in seconds.
                </Text>
              
                {user ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      as={RouterLink}
                      to="/dashboard"
                      bg="white"
                      color={buttonTextColor}
                      _hover={{ bg: "gray.100" }}
                      _dark={{
                        bg: "white",
                        color: "primary.600",
                        _hover: { bg: "gray.100" }
                      }}
                      fontWeight="medium"
                      py={4}
                      px={8}
                      borderRadius="lg"
                      boxShadow="lg"
                      transition="all 0.2s"
                      size="lg"
                    >
                      Go to Dashboard
                    </Button>
                  </motion.div>
                ) : (
                  <HStack spacing={6} justify="center">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        as={RouterLink}
                        to="/signup"
                        bg="white"
                        color={buttonTextColor}
                        _hover={{ bg: "gray.100" }}
                        _dark={{
                          bg: "white",
                          color: "primary.600",
                          _hover: { bg: "gray.100" }
                        }}
                        fontWeight="medium"
                        py={4}
                        px={8}
                        borderRadius="lg"
                        boxShadow="lg"
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        as={RouterLink}
                        to="/login"
                        variant="outline"
                        borderWidth="2px"
                        borderColor="white"
                        color="white"
                        _hover={{ bg: "white", color: buttonTextColor }}
                        _dark={{
                          borderColor: "white",
                          color: "white",
                          _hover: { bg: "white", color: "primary.600" }
                        }}
                        fontWeight="medium"
                        py={4}
                        px={8}
                        borderRadius="lg"
                        size="lg"
                      >
                        Login
                      </Button>
                    </motion.div>
                  </HStack>
                )}
              </VStack>
            </motion.div>
          </VStack>
        </Container>
      </Box>
      
      {/* Features Section - Enhanced spacing and card visibility */}
      <Box 
        as="section"
        py={24} 
        bg={featuresBg} 
        w="full"
      >
        <Container maxW="container.xl">
          <VStack spacing={20}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <VStack spacing={6} maxW="3xl" mx="auto" textAlign="center">
                <Heading as="h2" fontSize={["3xl", "4xl"]} fontWeight="bold" color={headingColor}>
                  How It Works
                </Heading>
                <Box w="24" h="1" bgGradient="linear(to-r, primary.500, secondary.500)" mx="auto" borderRadius="full"></Box>
              </VStack>
            </motion.div>
            
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={8} maxW="6xl" mx="auto" w="full">
              {[
                {
                  step: 1,
                  title: "Upload Your Sketch",
                  description: "Start by uploading your hand-drawn face sketch using our easy drag-and-drop interface.",
                  delay: 0.2
                },
                {
                  step: 2,
                  title: "AI Processing",
                  description: "Our advanced AI algorithms analyze your sketch and generate a detailed, realistic image.",
                  delay: 0.4
                },
                {
                  step: 3,
                  title: "Download Your Image",
                  description: "Once processing is complete, download your new AI-generated image based on your sketch.",
                  delay: 0.6
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Box 
                    p={8}
                    bg={featureCardBg}
                    borderWidth="1px"
                    borderColor={featureCardBorder}
                    borderRadius="xl"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: featureCardHoverBorder,
                      bg: featureCardHoverBg,
                      transform: "translateY(-4px)",
                      boxShadow: "lg"
                    }}
                    _dark={{
                      borderColor: "gray.600",
                      _hover: {
                        borderColor: "primary.500",
                        bg: "gray.600"
                      }
                    }}
                  >
                    <VStack spacing={6} align="start">
                      <Box
                        w={12}
                        h={12}
                        bg={featureIconBg}
                        color={featureIconColor}
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xl"
                        fontWeight="bold"
                      >
                        {feature.step}
                      </Box>
                      <Heading as="h3" size="md" color={headingColor}>
                        {feature.title}
                      </Heading>
                      <Text color={textColor}>
                        {feature.description}
                      </Text>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
            
      {/* Sample Images Section - Improved card layout and spacing */}
      <Box 
        as="section"
        py={24} 
        bg={sectionBg}
        w="full"
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <motion.div
              role="region"
              aria-label="Example sketches"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <VStack spacing={6} maxW="3xl" mx="auto" textAlign="center">
                <Heading as="h2" fontSize={["3xl", "4xl"]} fontWeight="bold">
                  <Text as="span" bgGradient="linear(to-r, primary.500, secondary.500)" bgClip="text">
                    See it in action
                  </Text>
                </Heading>
                <Text color={cardTextColor} maxW="2xl" mx="auto" fontSize={["base", "lg"]} textAlign="center">
                  Check out these before-and-after examples of sketches transformed by our AI
                </Text>
              </VStack>
            </motion.div>
            
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={8} maxW="6xl" mx="auto" w="full">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  role="article"
                  aria-label={`Example ${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Box 
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={cardBorderColor}
                    borderRadius="xl"
                    overflow="hidden"
                    transition="all 0.3s"
                    position="relative"
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    className="card-hover"
                    boxShadow="md"
                    _hover={{
                      boxShadow: "xl",
                      transform: "translateY(-8px)",
                    }}
                    _dark={{
                      boxShadow: "dark-lg",
                      _hover: {
                        boxShadow: "2xl",
                      },
                    }}
                  >
                    {/* Top decorative element */}
                    <Box position="absolute" top="0" left="0" right="0" h="1" bgGradient="linear(to-r, primary.400, secondary.400)" opacity="0.7"></Box>
                    
                    {/* Example number badge */}
                    <Box position="absolute" top="4" right="4" zIndex="20">
                      <Flex 
                        bg={badgeBg}
                        color={badgeColor}
                        w="8" 
                        h="8" 
                        borderRadius="full" 
                        align="center" 
                        justify="center" 
                        fontSize="sm" 
                        fontWeight="bold" 
                        boxShadow="md" 
                        borderWidth="1px"
                        borderColor={badgeBorderColor}
                      >
                        {i}
                      </Flex>
                    </Box>
                    
                    <Flex p={6} w="full" justify="center">
                      <VStack w="50%" p={2}>
                        <Text fontSize="xs" color={cardTextColor} mb={3} fontWeight="medium" textAlign="center">Sketch</Text>
                        <Box 
                          aspectRatio={1} 
                          bg={imageBg}
                          borderRadius="lg" 
                          overflow="hidden" 
                          borderWidth="1px"
                          borderColor={cardBorderColor}
                        >
                          <Image 
                            src={`/Images/sketch${i}.jpg`} 
                            alt="Original Sketch" 
                            w="full" 
                            h="full" 
                            objectFit="cover"
                          />
                        </Box>
                      </VStack>
                      <VStack w="50%" p={2}>
                        <Text fontSize="xs" color={cardTextColor} mb={3} fontWeight="medium" textAlign="center">Result</Text>
                        <Box 
                          aspectRatio={1} 
                          bg={imageBg}
                          borderRadius="lg" 
                          overflow="hidden" 
                          borderWidth="1px"
                          borderColor={cardBorderColor}
                        >
                          <Image 
                            src={`/Images/image${i}.png`} 
                            alt="AI Generated Image" 
                            w="full" 
                            h="full" 
                            objectFit="cover"
                          />
                        </Box>
                      </VStack>
                    </Flex>
                    <Box 
                      p={6} 
                      borderTop="1px" 
                      borderColor={cardBorderColor}
                      bg={imageBg}
                      w="full"
                    >
                      <VStack spacing={2}>
                        <Heading as="h4" fontSize="md" fontWeight="medium" color={cardHeadingColor} textAlign="center">
                          {`Example #${i}`}
                        </Heading>
                        <Text fontSize="sm" color={cardTextColor} textAlign="center">
                        
                        </Text>
                      </VStack>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* CTA Section - Enhanced with stronger visual appeal */}
      <Box 
        as="section"
        bgGradient="linear(to-r, primary.600, secondary.600)"
        py={[24, 28]}
        position="relative"
        overflow="hidden"
        w="full"
      >
        {/* Background decorative elements */}
        <Box 
          position="absolute" 
          top="0" 
          right="0" 
          w="64" 
          h="64" 
          bg="white" 
          opacity="0.05" 
          borderRadius="full" 
          transform="translate(33%, -50%)"
        ></Box>
        <Box 
          position="absolute" 
          bottom="0" 
          left="0" 
          w="64" 
          h="64" 
          bg="white" 
          opacity="0.05" 
          borderRadius="full" 
          transform="translate(-33%, 50%)"
        ></Box>
        
        <Container maxW="container.xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VStack 
              maxW="4xl" 
              mx="auto" 
              position="relative" 
              w="full"
              spacing={10}
              align="center"
              textAlign="center"
            >
              {/* Top decorative tile element */}
              <Box w="20" h="1" bg="white" opacity="0.5" borderRadius="full"></Box>
              
              <Heading 
                as="h2" 
                color="white" 
                fontWeight="bold" 
                mb={6} 
                textAlign="center"
                fontSize={["3xl", "4xl"]}
              >
                Ready to transform your sketches?
              </Heading>
              
              <Text 
                color="whiteAlpha.900" 
                maxW="2xl" 
                mx="auto" 
                mb={10} 
                textAlign="center"
                fontSize={["base", "lg"]}
              >
                Join thousands of artists and designers using our AI-powered sketch-to-image conversion.
              </Text>
            
              {user ? (
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    as={RouterLink} 
                    to="/upload" 
                    bg={ctaButtonBg}
                    color={ctaButtonColor}
                    _hover={{ 
                      bg: ctaButtonHoverBg,
                      transform: "translateY(-2px)",
                      boxShadow: ctaButtonShadow
                    }}
                    fontWeight="medium" 
                    py={4} 
                    px={10} 
                    borderRadius="lg" 
                    boxShadow={ctaButtonShadow}
                    fontSize="lg"
                    size="lg"
                    transition="all 0.2s"
                  >
                    Upload a Sketch
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    as={RouterLink} 
                    to="/signup" 
                    bg={ctaButtonBg}
                    color={ctaButtonColor}
                    _hover={{ 
                      bg: ctaButtonHoverBg,
                      transform: "translateY(-2px)",
                      boxShadow: ctaButtonShadow
                    }}
                    fontWeight="medium" 
                    py={4} 
                    px={10} 
                    borderRadius="lg" 
                    boxShadow={ctaButtonShadow}
                    fontSize="lg"
                    size="lg"
                    transition="all 0.2s"
                  >
                    Create an Account
                  </Button>
                </motion.div>
              )}
              
              {/* Bottom decorative tile element */}
              <Box w="20" h="1" bg="white" opacity="0.5" borderRadius="full"></Box>
            </VStack>
          </motion.div>
        </Container>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage; 