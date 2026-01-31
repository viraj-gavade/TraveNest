import { destinations, placesByDestination, chatResponses } from './mockData';

// Simulate API delay for realistic behavior
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Destination Services
export const getDestinations = async () => {
  await delay();
  return destinations;
};

export const getDestinationById = async (id) => {
  await delay();
  return destinations.find(dest => dest.id === id);
};

export const searchDestinations = async (query) => {
  await delay(300);
  if (!query) return destinations;
  
  const lowercaseQuery = query.toLowerCase();
  return destinations.filter(dest => 
    dest.name.toLowerCase().includes(lowercaseQuery) ||
    dest.country.toLowerCase().includes(lowercaseQuery) ||
    dest.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Place Services
export const getPlacesByCategory = async (destinationId, category) => {
  await delay();
  
  const destinationPlaces = placesByDestination[destinationId];
  if (!destinationPlaces) return [];
  
  return destinationPlaces[category] || [];
};

export const getAllPlacesForDestination = async (destinationId) => {
  await delay();
  
  const destinationPlaces = placesByDestination[destinationId];
  if (!destinationPlaces) return [];
  
  const allPlaces = [
    ...(destinationPlaces.attractions || []),
    ...(destinationPlaces.food || []),
    ...(destinationPlaces.hotels || []),
    ...(destinationPlaces.culture || []),
  ];
  
  return allPlaces;
};

export const getPlaceDetails = async (destinationId, placeId) => {
  await delay();
  
  const destinationPlaces = placesByDestination[destinationId];
  if (!destinationPlaces) return null;
  
  const allPlaces = [
    ...(destinationPlaces.attractions || []),
    ...(destinationPlaces.food || []),
    ...(destinationPlaces.hotels || []),
    ...(destinationPlaces.culture || []),
  ];
  
  return allPlaces.find(place => place.id === placeId);
};

// Map Services
export const getMapMarkers = async (destinationId) => {
  await delay();
  
  const destinationPlaces = placesByDestination[destinationId];
  if (!destinationPlaces) return [];
  
  const allPlaces = [
    ...(destinationPlaces.attractions || []),
    ...(destinationPlaces.food || []),
    ...(destinationPlaces.hotels || []),
    ...(destinationPlaces.culture || []),
  ];
  
  return allPlaces.map(place => ({
    id: place.id,
    name: place.name,
    category: place.category,
    coordinates: place.coordinates,
    rating: place.rating,
  }));
};

// Chat Services
export const getChatResponse = async (userQuery, destinationId = null) => {
  await delay(800); // Longer delay to simulate AI thinking
  
  const lowercaseQuery = userQuery.toLowerCase();
  
  // Check for greetings
  if (lowercaseQuery.match(/^(hi|hello|hey|greetings)/)) {
    const greetings = chatResponses.greetings;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Check for one-day itinerary
  if (lowercaseQuery.includes('one day') || lowercaseQuery.includes('1 day')) {
    if (destinationId && chatResponses['one-day'][destinationId]) {
      return chatResponses['one-day'][destinationId];
    }
    return "I'd love to help you plan a one-day itinerary! Which destination are you visiting?";
  }
  
  // Check for food recommendations
  if (lowercaseQuery.includes('food') || lowercaseQuery.includes('eat') || lowercaseQuery.includes('restaurant')) {
    if (destinationId && chatResponses['best-food'][destinationId]) {
      return chatResponses['best-food'][destinationId];
    }
    return "I can recommend amazing local food! Which destination are you visiting?";
  }
  
  // Check for hidden gems
  if (lowercaseQuery.includes('hidden') || lowercaseQuery.includes('secret') || lowercaseQuery.includes('local')) {
    if (destinationId && chatResponses['hidden-gems'][destinationId]) {
      return chatResponses['hidden-gems'][destinationId];
    }
    return "I know some great off-the-beaten-path spots! Which destination interests you?";
  }
  
  // Check for budget tips
  if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('cheap') || lowercaseQuery.includes('affordable')) {
    return chatResponses['budget-tips'];
  }
  
  // Check for family-friendly
  if (lowercaseQuery.includes('family') || lowercaseQuery.includes('kid') || lowercaseQuery.includes('children')) {
    return chatResponses['family-friendly'];
  }
  
  // Check for safety
  if (lowercaseQuery.includes('safe') || lowercaseQuery.includes('danger') || lowercaseQuery.includes('security')) {
    return chatResponses['safety'];
  }
  
  // Default response
  return chatResponses.default;
};

export default {
  getDestinations,
  getDestinationById,
  searchDestinations,
  getPlacesByCategory,
  getAllPlacesForDestination,
  getPlaceDetails,
  getMapMarkers,
  getChatResponse,
};
