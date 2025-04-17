import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserSketches } from '../services/sketchService';
import SketchCard from '../components/SketchCard';
import Footer from '../components/Footer';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  Text, 
  Spinner, 
  SimpleGrid, 
  useToast,
  Container,
  HStack,
  Select,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Card,
  CardBody,
  useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Sketch } from '../types';

const DashboardPage: React.FC = () => {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [filteredSketches, setFilteredSketches] = useState<Sketch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  const toast = useToast();

  // Theme values
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const cardBg = useColorModeValue("white", "dark.card");
  const cardBorderColor = useColorModeValue("gray.200", "dark.border");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorderColor = useColorModeValue("gray.200", "gray.600");
  const selectBg = useColorModeValue("white", "gray.700");
  const menuBg = useColorModeValue("white", "gray.700");
  const menuItemHoverBg = useColorModeValue("gray.100", "gray.600");
  const emptyStateBg = useColorModeValue("white", "dark.card");
  const emptyStateTextColor = useColorModeValue("gray.600", "gray.400");
  const errorBg = useColorModeValue("red.50", "red.900");
  const errorTextColor = useColorModeValue("red.600", "red.200");
  const errorBorderColor = useColorModeValue("red.600", "red.400");
  const loadingTextColor = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    const fetchSketches = async () => {
      if (!user) return;
      
      try {
        const userSketches = await getUserSketches(user.id);
        
        // Convert from SketchData to Sketch format
        const formattedSketches: Sketch[] = userSketches.map(sketch => ({
          id: sketch.id || '',
          name: sketch.prompt || '',
          sketchURL: sketch.original_url,
          generatedImageURL: sketch.processed_url,
          status: sketch.status,
          createdAt: sketch.created_at ? new Date(sketch.created_at).getTime() : Date.now(),
          updatedAt: sketch.created_at ? new Date(sketch.created_at).getTime() : Date.now(),
          userId: sketch.user_id
        }));
        
        setSketches(formattedSketches);
        setFilteredSketches(formattedSketches);
      } catch (error) {
        console.error('Error fetching sketches:', error);
        setError('Failed to load sketches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSketches();
  }, [user]);

  // Apply filters whenever sketches, searchTerm, statusFilter, or sortBy changes
  useEffect(() => {
    let result = [...sketches];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(sketch => sketch.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sketch => 
        sketch.name.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    setFilteredSketches(result);
  }, [sketches, searchTerm, statusFilter, sortBy]);

  const handleDeleteSketch = (deletedId: string) => {
    setSketches(sketches.filter(sketch => sketch.id !== deletedId));
    toast({
      title: "Sketch deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Dashboard stats calculations
  const totalSketches = sketches.length;
  const completedSketches = sketches.filter(sketch => sketch.status === 'completed').length;
  const processingSketches = sketches.filter(sketch => 
    sketch.status === 'processing' || sketch.status === 'pending'
  ).length;
  const failedSketches = sketches.filter(sketch => sketch.status === 'failed').length;

  if (loading) {
    return (
      <Flex direction="column" minH="100vh">
        <Box flex="1">
          <Container maxW="container.xl" py={8}>
            <Flex justify="center" align="center" h="300px" direction="column">
              <Spinner size="xl" color="blue.500" mb={4} />
              <Text color={loadingTextColor}>Loading your sketches...</Text>
            </Flex>
          </Container>
        </Box>
        <Footer />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1">
        <Container maxW="container.xl" py={8}>
          {/* Header Section */}
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading as="h1" size="lg" color={headingColor}>
                Your Sketches
              </Heading>
              <Text color={subTextColor} mt={1}>
                Manage and view all your sketches
              </Text>
            </Box>
            
            <Button 
              as={Link} 
              to="/upload"
              colorScheme="blue"
              size="md"
              leftIcon={<AddIcon />}
            >
              Upload New Sketch
            </Button>
          </Flex>
          
          {/* Stats Cards */}
          <Card bg={cardBg} mb={6} shadow="sm" borderWidth="1px" borderColor={cardBorderColor}>
            <CardBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Total Sketches</StatLabel>
                  <StatNumber>{totalSketches}</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>Completed</StatLabel>
                  <StatNumber>
                    {completedSketches}
                    <Badge ml={2} colorScheme="green" fontSize="xs">{completedSketches > 0 ? Math.round((completedSketches / totalSketches) * 100) + '%' : '0%'}</Badge>
                  </StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>Processing</StatLabel>
                  <StatNumber>
                    {processingSketches}
                    {processingSketches > 0 && <Spinner size="xs" ml={2} color="blue.500" />}
                  </StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>Failed</StatLabel>
                  <StatNumber>{failedSketches}</StatNumber>
                </Stat>
              </StatGroup>
            </CardBody>
          </Card>
          
          {/* Filter and search controls */}
          {sketches.length > 0 && (
            <Flex 
              justify="space-between" 
              align="center" 
              mb={6} 
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <HStack spacing={4} w={{ base: "full", md: "auto" }}>
                <Select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w={{ base: "full", md: "200px" }}
                  bg={selectBg}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: "blue.500" }}
                  _focus={{ borderColor: "blue.500" }}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </Select>
                
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    bg={selectBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: "blue.500" }}
                    _focus={{ borderColor: "blue.500" }}
                  >
                    Sort by: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Name'}
                  </MenuButton>
                  <MenuList bg={menuBg}>
                    <MenuItem 
                      onClick={() => setSortBy('newest')}
                      _hover={{ bg: menuItemHoverBg }}
                    >
                      Newest First
                    </MenuItem>
                    <MenuItem 
                      onClick={() => setSortBy('oldest')}
                      _hover={{ bg: menuItemHoverBg }}
                    >
                      Oldest First
                    </MenuItem>
                    <MenuItem 
                      onClick={() => setSortBy('name')}
                      _hover={{ bg: menuItemHoverBg }}
                    >
                      Name
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
              
              <InputGroup w={{ base: "full", md: "300px" }}>
                <Input
                  placeholder="Search sketches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: "blue.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
                <InputRightElement>
                  <SearchIcon color="gray.400" />
                </InputRightElement>
              </InputGroup>
            </Flex>
          )}
          
          {error && (
            <Box 
              mb={6} 
              p={4} 
              bg={errorBg}
              color={errorTextColor}
              borderRadius="md" 
              borderLeft="4px" 
              borderLeftColor={errorBorderColor}
            >
              {error}
            </Box>
          )}
          
          {sketches.length === 0 ? (
            <Box 
              p={8} 
              bg={emptyStateBg}
              borderRadius="lg" 
              shadow="sm"
              borderWidth="1px"
              borderColor={cardBorderColor}
              textAlign="center"
            >
              <Text fontSize="lg" color={emptyStateTextColor} mb={4}>
                You haven't uploaded any sketches yet.
              </Text>
              <Button 
                as={Link} 
                to="/upload"
                colorScheme="blue" 
                size="md"
                leftIcon={<AddIcon />}
              >
                Upload your first sketch now
              </Button>
            </Box>
          ) : filteredSketches.length === 0 ? (
            <Box 
              p={8} 
              bg={emptyStateBg}
              borderRadius="lg" 
              shadow="sm"
              borderWidth="1px"
              borderColor={cardBorderColor}
              textAlign="center"
            >
              <Text fontSize="lg" color={emptyStateTextColor} mb={4}>
                No sketches match your search criteria.
              </Text>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredSketches.map(sketch => (
                <SketchCard 
                  key={sketch.id} 
                  sketch={sketch} 
                  onDelete={() => handleDeleteSketch(sketch.id)}
                />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default DashboardPage; 