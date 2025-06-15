import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define theme colors
export const colors = {
  light: {
    primary: '#64748b', // Primary color for light mode
    background: '#f5f5f5', // background color for light mode
    cardBackground: '#ffffff', // Card background color for light mode
    inputBackground: '#F2F2F7',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    overlay: 'rgba(0, 0, 0, 0.5)',
    incomeColor: '#4CAF50', // Green for income
    expenseColor: '#f44336', // Red for expenses
  },
  dark: {
    primary: '#6b7280', // Primary color for dark mode
    background: '#121212', // Background color for dark mode
    cardBackground: '#1e1e1e', // Card background color for dark mode
    inputBackground: '#2C2C2E',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    textTertiary: '#808080',
    border: '#333333',
    overlay: 'rgba(0, 0, 0, 0.7)',
    incomeColor: '#4CAF50', // Green for income
    expenseColor: '#f44336', // Red for expenses
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