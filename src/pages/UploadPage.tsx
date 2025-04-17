import React, { useState, useRef } from "react";
import SketchUpload, { SketchUploadRef } from "../components/SketchUpload";
import Footer from "../components/Footer";
import { 
  Box, 
  Alert, 
  AlertIcon,
  Flex, 
  Heading, 
  Text, 
  Container,
  VStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  UnorderedList,
  ListItem,
  Button,
  ButtonGroup,
  useToast,
  useColorModeValue
} from "@chakra-ui/react";

const UploadPage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const sketchUploadRef = useRef<SketchUploadRef>(null);
  const toast = useToast();

  // Theme values
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "dark.card");
  const cardBorderColor = useColorModeValue("gray.200", "dark.border");
  const tipsBg = useColorModeValue("blue.50", "blue.900");
  const tipsTextColor = useColorModeValue("blue.800", "blue.100");
  const tipsListColor = useColorModeValue("blue.700", "blue.200");
  const termsTextColor = useColorModeValue("gray.500", "gray.400");

  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadError(null);
  };

  const handleUploadComplete = () => {
    setIsUploading(false);
    toast({
      title: "Sketch uploaded successfully",
      description: "Redirecting to sketch details...",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setIsUploading(false);
    toast({
      title: "Upload failed",
      description: error,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClear = () => {
    if (sketchUploadRef.current) {
      sketchUploadRef.current.clear();
      toast({
        title: "Cleared",
        description: "Upload area has been cleared",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleGenerateImage = async () => {
    if (sketchUploadRef.current) {
      if (!sketchUploadRef.current.hasFile()) {
        toast({
          title: "No sketch selected",
          description: "Please upload a sketch image first",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      try {
        await sketchUploadRef.current.upload();
      } catch (error) {
        console.error("Error during upload:", error);
      }
    }
  };

  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1">
        <Container maxW="container.xl" py={8}>
          {/* Header */}
          <Flex direction="column" align="center" mb={10} textAlign="center">
            <Heading as="h1" size="xl" color={headingColor} mb={4}>
              Face Sketch to Image Generation Using GAN
            </Heading>
            <Text fontSize="lg" color={subTextColor}>
              Upload your sketch and our AI will generate a realistic image based on it
            </Text>
          </Flex>

          {/* Error display */}
          {uploadError && (
            <Box mb={4}>
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {uploadError}
              </Alert>
            </Box>
          )}

          {/* Main upload container */}
          <Card bg={cardBg} borderRadius="lg" shadow="md" mb={10} overflow="hidden" borderWidth="1px" borderColor={cardBorderColor}>
            <CardHeader p={8} borderBottom="1px" borderColor={cardBorderColor}>
              <Heading as="h2" size="md" color={headingColor}>
                Upload Your Sketch
              </Heading>
            </CardHeader>
            
            <CardBody p={8}>
              {/* Custom drop zone */}
              <Box 
                border="2px" 
                borderStyle="dashed" 
                borderColor={cardBorderColor}
                borderRadius="lg" 
                p={8}
              >
                <SketchUpload 
                  ref={sketchUploadRef}
                  onUploadStart={handleUploadStart}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                />
              </Box>

              {/* Action Buttons */}
              <Flex justifyContent="center" mt={6}>
                <ButtonGroup spacing={4}>
                  <Button 
                    colorScheme="gray" 
                    onClick={handleClear}
                    isDisabled={isUploading}
                  >
                    Clear
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleGenerateImage}
                    isLoading={isUploading}
                    loadingText="Generating..."
                    isDisabled={isUploading}
                  >
                    Generate Image
                  </Button>
                </ButtonGroup>
              </Flex>
            </CardBody>
            
            {/* Tips section */}
            <CardFooter bg={tipsBg} borderRadius="0 0 lg lg" p={6}>
              <VStack align="stretch" w="full">
                <Text fontWeight="medium" color={tipsTextColor} mb={3}>
                  Tips for best results:
                </Text>
                <UnorderedList color={tipsListColor} spacing={2} pl={4}>
                  <ListItem>Use clear, well-defined lines in your sketch</ListItem>
                  <ListItem>Make sure the face features are properly positioned</ListItem>
                  <ListItem>For best results, focus on facial features only</ListItem>
                  <ListItem>Avoid complex backgrounds or multiple subjects</ListItem>
                </UnorderedList>
              </VStack>
            </CardFooter>
          </Card>

          {/* Terms reminder */}
          <Text textAlign="center" fontSize="xs" color={termsTextColor}>
            By uploading a sketch, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default UploadPage; 