import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  CloseButton
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';

interface NotificationCardProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  message,
  isOpen,
  onClose,
  duration = 5000
}) => {
  // Theme values
  const cardBg = useColorModeValue('white', 'dark.card');
  const cardBorderColor = useColorModeValue('gray.200', 'dark.border');
  const textColor = useColorModeValue('gray.800', 'white');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)');

  // Icon and color configurations
  const configs = {
    success: {
      icon: CheckCircleIcon,
      color: useColorModeValue('green.500', 'green.400'),
      borderColor: useColorModeValue('green.500', 'green.400')
    },
    error: {
      icon: WarningIcon,
      color: useColorModeValue('red.500', 'red.400'),
      borderColor: useColorModeValue('red.500', 'red.400')
    },
    info: {
      icon: InfoIcon,
      color: useColorModeValue('blue.500', 'blue.400'),
      borderColor: useColorModeValue('blue.500', 'blue.400')
    }
  };

  // Auto close after duration
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            maxWidth: '400px',
            width: '90%'
          }}
        >
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorderColor}
            borderRadius="lg"
            boxShadow={`0 4px 6px ${shadowColor}`}
            overflow="hidden"
            position="relative"
            borderLeftWidth="4px"
            borderLeftColor={configs[type].borderColor}
          >
            <Flex p={4} align="center">
              <Icon
                as={configs[type].icon}
                color={configs[type].color}
                boxSize={5}
                mr={3}
              />
              <Text color={textColor} flex="1">
                {message}
              </Text>
              <CloseButton size="sm" onClick={onClose} />
            </Flex>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCard; 