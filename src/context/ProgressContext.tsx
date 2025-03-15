
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
  completedItems: Record<string, boolean>;
  totalItems: number;
  completedCount: number;
  progressPercentage: number;
  currentSection: string | null;
  markCompleted: (itemId: string) => void;
  setCurrentSection: (section: string) => void;
  resetProgress: () => void;
}

const defaultContext: ProgressContextType = {
  completedItems: {},
  totalItems: 0,
  completedCount: 0,
  progressPercentage: 0,
  currentSection: null,
  markCompleted: () => {},
  setCurrentSection: () => {},
  resetProgress: () => {},
};

const ProgressContext = createContext<ProgressContextType>(defaultContext);

export const useProgress = () => useContext(ProgressContext);

interface ProgressProviderProps {
  children: React.ReactNode;
  totalItems: number;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ 
  children, 
  totalItems = 30 // Default total items across all sections
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('drf-completed-items');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / totalItems) * 100);
  
  useEffect(() => {
    localStorage.setItem('drf-completed-items', JSON.stringify(completedItems));
  }, [completedItems]);
  
  const markCompleted = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: true
    }));
  };
  
  const resetProgress = () => {
    setCompletedItems({});
    localStorage.removeItem('drf-completed-items');
  };
  
  return (
    <ProgressContext.Provider value={{
      completedItems,
      totalItems,
      completedCount,
      progressPercentage,
      currentSection,
      markCompleted,
      setCurrentSection,
      resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
