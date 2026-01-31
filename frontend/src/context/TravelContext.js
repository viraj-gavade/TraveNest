import React, { createContext, useContext, useState, useEffect } from 'react';

const TravelContext = createContext();

export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within TravelProvider');
  }
  return context;
};

export const TravelProvider = ({ children }) => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load saved places from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPlaces');
    if (saved) {
      try {
        setSavedPlaces(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved places:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedPlaces changes
  useEffect(() => {
    localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  const toggleSavePlace = (place) => {
    setSavedPlaces(prev => {
      const isAlreadySaved = prev.some(p => p.id === place.id);
      if (isAlreadySaved) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const isPlaceSaved = (placeId) => {
    return savedPlaces.some(p => p.id === placeId);
  };

  const addChatMessage = (message, sender = 'user') => {
    setChatHistory(prev => [...prev, { message, sender, timestamp: new Date() }]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  const value = {
    selectedDestination,
    setSelectedDestination,
    selectedPlace,
    setSelectedPlace,
    savedPlaces,
    toggleSavePlace,
    isPlaceSaved,
    chatHistory,
    addChatMessage,
    clearChatHistory,
    searchQuery,
    setSearchQuery,
    isLoading,
    setIsLoading,
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
};

export default TravelContext;
