import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSketchById, deleteSketch } from '../services/sketchService';
import { Sketch } from '../types';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  Text, 
  Spinner, 
  Grid, 
  GridItem, 
  Image, 
  Badge, 
  useToast,
  Container,
  useColorModeValue,
  ButtonGroup
} from '@chakra-ui/react';
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';

const SketchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sketch, setSketch] = useState<Sketch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [pollingId, setPollingId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Theme values
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "dark.card");
  const cardBorderColor = useColorModeValue("gray.200", "dark.border");
  const imageBorderColor = useColorModeValue("gray.200", "gray.600");
  const loadingBg = useColorModeValue("gray.100", "gray.700");
  const loadingTextColor = useColorModeValue("gray.500", "gray.400");
  const errorTextColor = useColorModeValue("red.500", "red.300");

  // Function to fetch sketch data
  const fetchSketch = useCallback(async () => {
    if (!id) return;
    
    try {
      const sketchData = await getSketchById(id);
      
      console.log('Raw sketch data:', sketchData); // Debug log
      
      if (!sketchData) {
        setError('Sketch not found');
        return null;
      } else if (sketchData.user_id !== user?.id) {
        setError('You do not have permission to view this sketch');
        return null;
      } else {
        const processedSketch = {
          id: sketchData.id || '',
          name: sketchData.prompt || '',
          sketchURL: sketchData.original_url,
          generatedImageURL: sketchData.processed_url,
          status: sketchData.status === 'pending' ? 'processing' : sketchData.status,
          createdAt: sketchData.created_at ? new Date(sketchData.created_at).getTime() : Date.now(),
          updatedAt: sketchData.created_at ? new Date(sketchData.created_at).getTime() : Date.now(),
          userId: sketchData.user_id
        };
        
        console.log('Processed sketch data:', processedSketch); // Debug log
        console.log('Generated image URL:', processedSketch.generatedImageURL); // Debug log
        
        setSketch(processedSketch);
        return processedSketch;
      }
    } catch (error) {
      console.error('Error fetching sketch:', error);
      setError('Failed to load sketch. Please try again later.');
      return null;
    }
  }, [id, user]);

  // Initial data fetch
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchSketch();
      setLoading(false);
    };

    initialFetch();
  }, [fetchSketch]);

  // Set up polling for status updates if sketch is processing
  useEffect(() => {
    // Clear any existing interval
    if (pollingId !== null) {
      clearInterval(pollingId);
      setPollingId(null);
    }

    // If sketch is in processing status, start polling
    if (sketch && (sketch.status === 'processing' || sketch.status === 'pending')) {
      console.log('Starting polling for sketch status updates...');
      
      const intervalId = window.setInterval(async () => {
        console.log('Polling for sketch status update...');
        const updatedSketch = await fetchSketch();
        
        // If status is no longer processing, stop polling
        if (updatedSketch && 
            (updatedSketch.status === 'completed' || updatedSketch.status === 'failed')) {
          console.log('Sketch processing complete, stopping polling');
          clearInterval(intervalId);
          setPollingId(null);
        }
      }, 5000); // Poll every 5 seconds
      
      setPollingId(intervalId);
      
      // Cleanup interval on component unmount
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [sketch, fetchSketch]);

  const handleDelete = async () => {
    if (!sketch) return;
    
    if (window.confirm('Are you sure you want to delete this sketch?')) {
      try {
        // Extract the userId and fileName from the sketchURL
        // Format is typically: https://storage-url/sketches/{userId}/{fileName}
        const urlParts = sketch.sketchURL.split('/');
        const fileName = urlParts.pop() || '';
        const userId = urlParts.pop() || '';
        const filePath = `${userId}/${fileName}`;
        
        await deleteSketch(sketch.id, filePath);
        toast({
          title: "Sketch deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting sketch:', error);
        setError('Failed to delete sketch. Please try again.');
        toast({
          title: "Error deleting sketch",
          description: "Failed to delete sketch. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDownload = async () => {
    if (!sketch?.generatedImageURL) return;

    try {
      const response = await fetch(sketch.generatedImageURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sketch.name || 'sketch'}-generated.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Image downloaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error downloading image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Show loading state
  if (loading) {
    return (
      <Flex direction="column" minH="100vh">
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" color="blue.500" />
        </Box>
        <Footer />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Flex direction="column" minH="100vh">
        <Box flex="1" textAlign="center" p={8}>
          <Heading as="h1" size="xl" mb={4} color={headingColor}>Error</Heading>
          <Text mb={6} color={errorTextColor}>{error}</Text>
          <Button as={Link} to="/dashboard" colorScheme="blue">
            Return to Dashboard
          </Button>
        </Box>
        <Footer />
      </Flex>
    );
  }

  // Show not found state
  if (!sketch) {
    return (
      <Flex direction="column" minH="100vh">
        <Box flex="1" textAlign="center" p={8}>
          <Heading as="h1" size="xl" mb={4} color={headingColor}>Sketch Not Found</Heading>
          <Text mb={6} color={subTextColor}>The sketch you're looking for doesn't exist or you don't have permission to view it.</Text>
          <Button as={Link} to="/dashboard" colorScheme="blue">
            Return to Dashboard
          </Button>
        </Box>
        <Footer />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1">
        <Container maxW="container.xl" py={8}>
          <Box maxW="1200px" mx="auto">
            <Flex justify="space-between" align="center" mb={6}>
              <Heading as="h1" size="lg" color={headingColor}>
                {sketch.name || 'Untitled Sketch'}
              </Heading>
              <ButtonGroup spacing={2}>
                {sketch.status === 'completed' && sketch.generatedImageURL && (
                  <Button
                    colorScheme="blue"
                    leftIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                )}
                <Button
                  colorScheme="red"
                  leftIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button 
                  as={Link} 
                  to="/dashboard" 
                  colorScheme="blue" 
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
              </ButtonGroup>
            </Flex>
            
            <Box bg={cardBg} borderRadius="lg" shadow="sm" overflow="hidden" borderWidth="1px" borderColor={cardBorderColor}>
              <Box p={6}>
                <Box mb={6}>
                  <Text color={subTextColor} mb={2}>
                    <Text as="span" fontWeight="semibold">Created:</Text> {formatDate(sketch.createdAt)}
                  </Text>
                  <Text color={subTextColor} mb={2}>
                    <Text as="span" fontWeight="semibold">Last Updated:</Text> {formatDate(sketch.updatedAt)}
                  </Text>
                  <Text color={subTextColor} mb={2}>
                    <Text as="span" fontWeight="semibold">Status:</Text>{' '}
                    <Badge 
                      colorScheme={
                        sketch.status === 'completed' 
                          ? 'green' 
                          : sketch.status === 'processing' 
                          ? 'yellow' 
                          : 'red'
                      }
                    >
                      {sketch.status.charAt(0).toUpperCase() + sketch.status.slice(1)}
                    </Badge>
                    {(sketch.status === 'processing' || sketch.status === 'pending') && (
                      <Spinner size="sm" ml={2} color="blue.500" />
                    )}
                  </Text>
                </Box>
                
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6}>
                  <GridItem>
                    <Heading as="h3" size="md" mb={3} color={headingColor}>Original Sketch</Heading>
                    <Image 
                      src={sketch.sketchURL} 
                      alt="Original sketch" 
                      w="full"
                      objectFit="contain"
                      borderRadius="md"
                      border="1px"
                      borderColor={imageBorderColor}
                      maxH="400px"
                      bg={cardBg}
                    />
                  </GridItem>
                  
                  <GridItem>
                    <Heading as="h3" size="md" mb={3} color={headingColor}>Generated Image</Heading>
                    {sketch.status === 'completed' && sketch.generatedImageURL ? (
                      imageError ? (
                        <Flex direction="column" justify="center" align="center" h="400px" bg={loadingBg} borderRadius="md">
                          <Text color={errorTextColor}>Failed to load image</Text>
                          <Text fontSize="sm" color={subTextColor} mt={2}>The generated image could not be loaded</Text>
                        </Flex>
                      ) : (
                        <Image 
                          src={sketch.generatedImageURL} 
                          alt="Generated image" 
                          w="full"
                          objectFit="contain"
                          borderRadius="md"
                          border="1px"
                          borderColor={imageBorderColor}
                          maxH="400px"
                          bg={cardBg}
                          onError={() => setImageError(true)}
                          fallback={
                            <Flex direction="column" justify="center" align="center" h="400px" bg={loadingBg} borderRadius="md">
                              <Spinner size="xl" color="blue.500" mb={4} />
                              <Text color={loadingTextColor}>Loading generated image...</Text>
                            </Flex>
                          }
                        />
                      )
                    ) : sketch.status === 'processing' || sketch.status === 'pending' ? (
                      <Flex 
                        direction="column" 
                        justify="center" 
                        align="center" 
                        h="400px" 
                        bg={loadingBg}
                        borderRadius="md"
                        border="1px"
                        borderColor={imageBorderColor}
                      >
                        <Spinner size="xl" color="blue.500" mb={4} />
                        <Text color={loadingTextColor}>
                          {sketch.status === 'pending' ? 'Waiting to process...' : 'Converting your sketch to image...'}
                        </Text>
                        <Text fontSize="xs" color={loadingTextColor} mt={2}>This may take a minute or two</Text>
                      </Flex>
                    ) : (
                      <Flex 
                        justify="center" 
                        align="center" 
                        h="400px" 
                        bg={loadingBg}
                        borderRadius="md"
                        border="1px"
                        borderColor={imageBorderColor}
                      >
                        <Text color={errorTextColor}>Generation failed</Text>
                      </Flex>
                    )}
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default SketchDetailPage; 