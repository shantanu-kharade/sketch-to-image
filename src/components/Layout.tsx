import React from 'react';
import Header from './Header';
import { Box, Flex } from '@chakra-ui/react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flexGrow={1}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout; 