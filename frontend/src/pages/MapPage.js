import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import { getDestinations, getMapMarkers } from '../services/travelService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    // Check if destination was passed via navigation state
    if (location.state?.destinationId && destinations.length > 0) {
      const dest = destinations.find(d => d.id === location.state.destinationId);
      if (dest) {
        handleDestinationChange(dest.id);
      }
    }
  }, [location.state, destinations]);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
      if (data.length > 0 && !location.state?.destinationId) {
        handleDestinationChange(data[0].id);
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestinationChange = async (destinationId) => {
    const destination = destinations.find(d => d.id === destinationId);
    if (destination) {
      setSelectedDestination(destination);
      try {
        const markerData = await getMapMarkers(destinationId);
        setMarkers(markerData);
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    }
  };

  const handleMarkerClick = (marker) => {
    navigate(`/destination/${selectedDestination.id}/place/${marker.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-ocean" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 py-12 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ocean tracking-tight mb-4">
              Explore Map
            </h1>
            <p className="font-sans text-lg text-stone/80 mb-6">
              Discover all attractions, restaurants, and hotels in one interactive view
            </p>

            {/* Destination Selector */}
            <div className="max-w-md">
              <label className="font-sans text-sm font-medium text-stone mb-2 block">
                Select Destination
              </label>
              <Select
                value={selectedDestination?.id}
                onValueChange={handleDestinationChange}
              >
                <SelectTrigger 
                  className="w-full bg-white border-stone/20 rounded-xl h-12 font-sans"
                  data-testid="destination-select"
                >
                  <SelectValue placeholder="Choose a destination" />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone/20 rounded-xl">
                  {destinations.map((dest) => (
                    <SelectItem 
                      key={dest.id} 
                      value={dest.id}
                      data-testid={`select-${dest.id}`}
                      className="font-sans cursor-pointer hover:bg-sand"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-stone/60" />
                        <span>{dest.name}, {dest.country}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Map */}
          {selectedDestination ? (
            <div className="animate-fade-in" data-testid="map-section">
              <MapView
                center={selectedDestination.coordinates}
                zoom={13}
                markers={markers}
                onMarkerClick={handleMarkerClick}
                height="calc(100vh - 400px)"
              />
              
              {/* Info Card */}
              <div className="mt-6 bg-white p-6 rounded-2xl border border-stone/10">
                <h3 className="font-serif text-xl font-bold text-ocean mb-2">
                  {selectedDestination.name}
                </h3>
                <p className="font-sans text-stone/80 mb-4">
                  {selectedDestination.description}
                </p>
                <div className="flex items-center gap-4 text-sm font-sans text-stone/60">
                  <span>📍 {markers.length} places to explore</span>
                  <span>⭐ {selectedDestination.rating} rating</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-stone/30 mx-auto mb-4" />
              <p className="font-sans text-stone/60">Select a destination to view the map</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MapPage;
