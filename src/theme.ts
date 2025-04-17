import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Define the colors that match your application's existing color scheme
const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    hover: '#334155',
    border: '#475569',
    header: 'rgba(15, 23, 42, 0.8)', // Dark theme header
  },
  light: {
    header: 'rgba(255, 255, 255, 0.8)', // Light theme header
  },
};

// Define custom font configurations
const fonts = {
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  mono: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
};

// Define config for initial color mode
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Define custom component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'primary.600',
        color: 'white',
        _hover: {
          bg: 'primary.700',
        },
        _dark: {
          bg: 'primary.500',
          _hover: {
            bg: 'primary.600',
          },
        },
      },
      outline: {
        borderColor: 'primary.600',
        color: 'primary.600',
        _hover: {
          bg: 'primary.50',
        },
        _dark: {
          borderColor: 'primary.400',
          color: 'primary.400',
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
      },
      ghost: {
        color: 'primary.600',
        _hover: {
          bg: 'whiteAlpha.300',
        },
        _dark: {
          color: 'primary.400',
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
      },
      'card-action': {
        color: 'gray.600',
        fontWeight: 'medium',
        fontSize: 'sm',
        _hover: {
          bg: 'gray.100',
        },
        _dark: {
          color: 'gray.300',
          _hover: {
            bg: 'whiteAlpha.200',
          },
        },
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'md',
      },
    },
    variants: {
      outline: {
        field: {
          _dark: {
            bg: 'dark.card',
            borderColor: 'dark.border',
            _hover: {
              borderColor: 'primary.400',
            },
            _focus: {
              borderColor: 'primary.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)',
            },
          },
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'white',
        borderRadius: 'lg',
        boxShadow: 'sm',
        borderWidth: '1px',
        borderColor: 'gray.200',
        transition: 'all 0.2s',
        _dark: {
          bg: 'dark.card',
          borderColor: 'dark.border',
          boxShadow: 'lg',
        },
        _hover: {
          boxShadow: 'md',
          _dark: {
            boxShadow: 'dark-lg',
          },
        },
      },
      header: {
        padding: 6,
        borderBottomWidth: '1px',
        borderColor: 'inherit',
        _dark: {
          borderColor: 'dark.border',
        },
      },
      body: {
        padding: 6,
      },
      footer: {
        padding: 6,
        borderTopWidth: '1px',
        borderColor: 'inherit',
        _dark: {
          borderColor: 'dark.border',
        },
      },
    },
    variants: {
      elevated: {
        container: {
          boxShadow: 'md',
          _dark: {
            bg: 'dark.card',
            boxShadow: 'dark-lg',
          },
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
            _dark: {
              boxShadow: '2xl',
            },
          },
        },
      },
      outline: {
        container: {
          borderWidth: '1px',
          borderColor: 'gray.200',
          _dark: {
            borderColor: 'dark.border',
          },
        },
      },
      'sketch-card': {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: 'md',
          overflow: 'hidden',
          transition: 'all 0.2s',
          _dark: {
            bg: 'dark.card',
            borderColor: 'dark.border',
          },
          _hover: {
            boxShadow: 'lg',
            transform: 'translateY(-2px)',
            _dark: {
              boxShadow: 'dark-lg',
            },
          },
        },
      },
      'feature-card': {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: 'md',
          p: 8,
          transition: 'all 0.2s',
          _dark: {
            bg: 'dark.card',
            borderColor: 'dark.border',
          },
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: 'lg',
            _dark: {
              boxShadow: 'dark-lg',
            },
          },
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'white',
        _dark: {
          bg: 'gray.800',
        },
      },
      header: {
        _dark: {
          color: 'white',
        },
      },
      body: {
        _dark: {
          color: 'gray.100',
        },
      },
    },
  },
  Menu: {
    baseStyle: {
      list: {
        _dark: {
          bg: 'dark.card',
          borderColor: 'dark.border',
        },
      },
      item: {
        _dark: {
          _hover: {
            bg: 'dark.hover',
          },
        },
      },
    },
  },
  Drawer: {
    baseStyle: {
      dialog: {
        bg: 'white',
        _dark: {
          bg: 'gray.800',
        },
      },
      header: {
        _dark: {
          color: 'white',
        },
      },
      body: {
        _dark: {
          color: 'gray.100',
        },
      },
    },
  },
  Text: {
    baseStyle: {
      _dark: {
        color: 'gray.100',
      },
    },
    variants: {
      'card-label': {
        color: 'gray.600',
        fontSize: 'sm',
        fontWeight: 'medium',
        _dark: {
          color: 'gray.300',
        },
      },
      'card-value': {
        color: 'gray.800',
        fontWeight: 'semibold',
        _dark: {
          color: 'white',
        },
      },
      'card-date': {
        color: 'gray.500',
        fontSize: 'sm',
        _dark: {
          color: 'gray.400',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      _dark: {
        color: 'white',
      },
    },
  },
  Link: {
    baseStyle: {
      _dark: {
        color: 'primary.400',
        _hover: {
          color: 'primary.300',
        },
      },
    },
  },
  Badge: {
    baseStyle: {
      _dark: {
        bg: 'whiteAlpha.200',
      },
    },
    variants: {
      solid: {
        _dark: {
          bg: 'primary.500',
        },
      },
      'status-completed': {
        bg: 'green.500',
        color: 'white',
        _dark: {
          bg: 'green.400',
        },
      },
      'status-processing': {
        bg: 'yellow.500',
        color: 'white',
        _dark: {
          bg: 'yellow.400',
        },
      },
      'status-failed': {
        bg: 'red.500',
        color: 'white',
        _dark: {
          bg: 'red.400',
        },
      },
    },
  },
  Select: {
    variants: {
      outline: {
        field: {
          _dark: {
            bg: 'dark.card',
            borderColor: 'dark.border',
            _hover: {
              borderColor: 'primary.400',
            },
            _focus: {
              borderColor: 'primary.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)',
            },
          },
        },
      },
    },
  },
  Stat: {
    baseStyle: {
      container: {
        _dark: {
          color: 'whiteAlpha.900',
        },
      },
      label: {
        _dark: {
          color: 'whiteAlpha.700',
        },
      },
      number: {
        _dark: {
          color: 'whiteAlpha.900',
        },
      },
    },
  },
  Box: {
    variants: {
      'glass-effect': {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out',
      },
      'image-card': {
        bg: 'white',
        borderRadius: 'lg',
        overflow: 'hidden',
        borderWidth: '1px',
        borderColor: 'gray.200',
        _dark: {
          bg: 'dark.card',
          borderColor: 'dark.border',
        },
      },
      'image-container': {
        bg: 'gray.50',
        borderRadius: 'md',
        overflow: 'hidden',
        borderWidth: '1px',
        borderColor: 'gray.200',
        _dark: {
          bg: 'gray.800',
          borderColor: 'dark.border',
        },
      },
    },
  },
  Container: {
    baseStyle: {
      maxW: 'container.xl',
    },
  },
};

// Update the global styles
const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'dark.bg' : 'gray.50',
      color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
    },
    '.header-blur': {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      bg: props.colorMode === 'dark' ? 'dark.header' : 'light.header',
      borderBottom: '1px solid',
      borderColor: props.colorMode === 'dark' ? 'dark.border' : 'gray.200',
      transition: 'all 0.2s ease-in-out',
    },
    // Add styles for image placeholders
    '.image-placeholder': {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
      color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
    },
    // Add styles for card hover effects
    '.card-hover': {
      transition: 'all 0.2s',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: props.colorMode === 'dark' ? 'dark-lg' : 'lg',
      },
    },
    '::-webkit-scrollbar': {
      width: '10px',
      height: '10px',
    },
    '::-webkit-scrollbar-track': {
      bg: props.colorMode === 'dark' ? 'dark.bg' : 'gray.100',
    },
    '::-webkit-scrollbar-thumb': {
      bg: props.colorMode === 'dark' ? 'dark.border' : 'gray.300',
      borderRadius: 'full',
    },
    '::-webkit-scrollbar-thumb:hover': {
      bg: props.colorMode === 'dark' ? 'dark.hover' : 'gray.400',
    },
  }),
};

// Export the theme
const theme = extendTheme({
  colors,
  fonts,
  components,
  config,
  styles,
});

export default theme; 