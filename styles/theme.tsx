import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define theme colors
export const colors = {
  light: {
    primary: '#007AFF',
    background: '#F2F2F7',
    cardBackground: '#FFFFFF',
    inputBackground: '#F2F2F7',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#E5E5EA',
    overlay: 'rgba(0, 0, 0, 0.5)',
    incomeColor: '#34C759',
    expenseColor: '#FF3B30',
  },
  dark: {
    primary: '#0A84FF',
    background: '#000000',
    cardBackground: '#1C1C1E',
    inputBackground: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textTertiary: '#636366',
    border: '#38383A',
    overlay: 'rgba(0, 0, 0, 0.7)',
    incomeColor: '#30D158',
    expenseColor: '#FF453A',
  },
};

// Define the context type
interface ThemeContextType {
  colors: any;
  theme: typeof colors.light;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ colors, theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};