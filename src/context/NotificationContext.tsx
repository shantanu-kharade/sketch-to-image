import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationCard from '../components/NotificationCard';

interface NotificationContextType {
  showNotification: (type: 'success' | 'error' | 'info', message: string, duration?: number) => void;
}

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  type: NotificationType;
  message: string;
  duration: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationProps, setNotificationProps] = useState<NotificationState>({
    type: 'success',
    message: '',
    duration: 5000
  });

  const showNotification = useCallback((
    type: NotificationType,
    message: string,
    duration: number = 5000
  ) => {
    setNotificationProps({ type, message, duration });
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationCard
        isOpen={isOpen}
        onClose={handleClose}
        type={notificationProps.type}
        message={notificationProps.message}
        duration={notificationProps.duration}
      />
    </NotificationContext.Provider>
  );
}; 