import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native';
import { storageManager } from '../utils/storage';

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
  isLoading: boolean;
  followSystem: boolean;
  toggleFollowSystem: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followSystem, setFollowSystem] = useState(true);

  // Determine theme based on followSystem and system color scheme
  const systemColorScheme = Appearance.getColorScheme();
  const effectiveDarkMode = followSystem ? systemColorScheme === 'dark' : isDarkMode;
  const theme = effectiveDarkMode ? colors.dark : colors.light;

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storageManager.loadTheme();
        const savedFollowSystem = await storageManager.loadFollowSystem?.();
        setIsDarkMode(savedTheme);
        setFollowSystem(savedFollowSystem ?? true);
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Listen to system theme changes if following system
  useEffect(() => {
    if (!followSystem) return;
    const listener = ({ colorScheme }: { colorScheme: 'light' | 'dark' | null }) => {
      // Triggers re-render by updating state
      setIsDarkMode(colorScheme === 'dark');
    };
    const sub = Appearance.addChangeListener(listener);
    return () => sub.remove();
  }, [followSystem]);

  const toggleTheme = async () => {
    if (followSystem) return; // Don't allow manual toggle if following system
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await storageManager.saveTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleFollowSystem = async () => {
    const newFollow = !followSystem;
    setFollowSystem(newFollow);
    await storageManager.saveFollowSystem?.(newFollow);
    // If enabling follow system, update isDarkMode to match system
    if (newFollow) {
      setIsDarkMode(Appearance.getColorScheme() === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{
      colors,
      theme,
      isDarkMode: effectiveDarkMode,
      toggleTheme,
      isLoading,
      followSystem,
      toggleFollowSystem,
    }}>
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