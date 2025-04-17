import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sketch } from '../types';
import { deleteSketch } from '../services/sketchService';
import { 
  Badge, 
  Spinner, 
  Box, 
  Flex, 
  Text, 
  Grid, 
  GridItem, 
  Image, 
  Button, 
  Heading,
  ButtonGroup,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';

interface SketchCardProps {
  sketch: Sketch;
  onDelete: () => void;
}

const SketchCard: React.FC<SketchCardProps> = ({ sketch, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const toast = useToast();

  // Theme values
  const cardBg = useColorModeValue('white', 'dark.card');
  const borderColor = useColorModeValue('gray.200', 'dark.border');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const imageBg = useColorModeValue('gray.50', 'gray.800');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');

  const handleDelete = async () => {
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
        onDelete();
      } catch (error) {
        console.error('Error deleting sketch:', error);
        toast({
          title: "Error deleting sketch",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDownload = async () => {
    if (!sketch.generatedImageURL) return;

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
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusBadge = () => {
    switch (sketch.status) {
      case 'completed':
        return <Badge variant="status-completed">Completed</Badge>;
      case 'processing':
        return (
          <Badge variant="status-processing">
            Processing <Spinner size="xs" ml={1} />
          </Badge>
        );
      case 'pending':
        return (
          <Badge colorScheme="blue">
            Pending <Spinner size="xs" ml={1} />
          </Badge>
        );
      case 'failed':
        return <Badge variant="status-failed">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Box 
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.2s"
      className="card-hover"
      boxShadow="md"
      _hover={{
        boxShadow: "xl",
        transform: "translateY(-2px)",
      }}
      _dark={{
        boxShadow: "dark-lg",
        _hover: {
          boxShadow: "2xl",
        },
      }}
    >
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading as="h3" size="sm" noOfLines={1} color={textColor}>
            {sketch.name || 'Untitled Sketch'}
          </Heading>
          {getStatusBadge()}
        </Flex>
        <Text fontSize="sm" color={subTextColor} mb={3}>
          Created: {formatDate(sketch.createdAt)}
        </Text>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
          <GridItem>
            <Text fontSize="xs" color={subTextColor} mb={1}>
              Original Sketch
            </Text>
            <Box 
              position="relative" 
              aspectRatio={1} 
              bg={imageBg}
              borderRadius="md" 
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              <Image 
                src={sketch.sketchURL} 
                alt="Sketch" 
                w="full" 
                h="full" 
                objectFit="cover"
                loading="lazy"
              />
            </Box>
          </GridItem>
          
          <GridItem>
            <Text fontSize="xs" color={subTextColor} mb={1}>
              Generated Image
            </Text>
            <Box 
              position="relative" 
              aspectRatio={1} 
              bg={imageBg}
              borderRadius="md" 
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              {sketch.status === 'completed' && sketch.generatedImageURL ? (
                imageError ? (
                  <Flex w="full" h="full" align="center" justify="center" bg={imageBg}>
                    <Text fontSize="sm" color={placeholderColor}>Image unavailable</Text>
                  </Flex>
                ) : (
                  <Image 
                    src={sketch.generatedImageURL} 
                    alt="Generated result" 
                    w="full" 
                    h="full" 
                    objectFit="cover"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                )
              ) : (sketch.status === 'processing' || sketch.status === 'pending') ? (
                <Flex w="full" h="full" direction="column" align="center" justify="center">
                  <Spinner size="md" color="blue.500" mb={2} />
                  <Text fontSize="sm" color={subTextColor}>
                    {sketch.status === 'pending' ? 'Waiting...' : 'Processing...'}
                  </Text>
                </Flex>
              ) : (
                <Flex w="full" h="full" align="center" justify="center">
                  <Text fontSize="sm" color="red.400">Failed</Text>
                </Flex>
              )}
            </Box>
          </GridItem>
        </Grid>
        
        <Flex 
          justify="space-between" 
          align="center" 
          pt={2} 
          borderTop="1px" 
          borderColor={borderColor}
        >
          <ButtonGroup size="sm" spacing={2}>
            <Button
              as={Link}
              to={`/sketches/${sketch.id}`}
              variant="card-action"
              leftIcon={<ViewIcon />}
              size="sm"
            >
              View Details
            </Button>
            {sketch.status === 'completed' && sketch.generatedImageURL && (
              <Button
                variant="card-action"
                leftIcon={<DownloadIcon />}
                onClick={handleDownload}
                size="sm"
              >
                Download
              </Button>
            )}
            <Button
              variant="card-action"
              leftIcon={<DeleteIcon />}
              onClick={handleDelete}
              size="sm"
            >
              Delete
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Box>
  );
};

export default SketchCard; 