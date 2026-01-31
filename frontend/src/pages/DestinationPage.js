import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import PlaceCard from '../components/PlaceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getDestinationById, getPlacesByCategory } from '../services/travelService';
import { useTravelContext } from '../context/TravelContext';

const DestinationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedDestination } = useTravelContext();
  
  const [destination, setDestination] = useState(null);
  const [activeTab, setActiveTab] = useState('attractions');
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDestination();
  }, [id]);

  useEffect(() => {
    if (destination) {
      loadPlaces(activeTab);
    }
  }, [activeTab, destination]);

  const loadDestination = async () => {
    setIsLoading(true);
    try {
      const data = await getDestinationById(id);
      if (data) {
        setDestination(data);
        setSelectedDestination(data);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading destination:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlaces = async (category) => {
    try {
      const data = await getPlacesByCategory(id, category);
      setPlaces(data);
    } catch (error) {
      console.error('Error loading places:', error);
    }
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

  if (!destination) {
    return null;
  }

  const categories = [
    { value: 'attractions', label: 'Attractions', icon: '🏛️' },
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'hotels', label: 'Hotels', icon: '🏨' },
    { value: 'culture', label: 'Local Culture', icon: '🎭' },
  ];

  return (
    <Layout>
      {/* Destination Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-sand" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pb-12">
          <button
            onClick={() => navigate(-1)}
            data-testid="back-button"
            className="inline-flex items-center gap-2 text-white mb-8 hover:gap-3 transition-all duration-300 font-sans"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-white/90 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="font-sans text-lg">{destination.country}</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Star className="w-5 h-5 fill-white text-white" />
                <span className="font-sans text-lg font-semibold text-white">{destination.rating}</span>
              </div>
            </div>
            <p className="font-sans text-lg text-white/90 leading-relaxed max-w-2xl">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {destination.highlights && destination.highlights.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 py-12 bg-ocean/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-ocean mb-6">Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {destination.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-stone/10 font-sans text-stone hover:shadow-md transition-all duration-300"
                >
                  ✨ {highlight}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs */}
      <section className="px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-ocean tracking-tight mb-8">
            Explore {destination.name}
          </h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 bg-transparent mb-8" data-testid="category-tabs">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  data-testid={`tab-${category.value}`}
                  className="bg-white border border-stone/10 rounded-xl px-6 py-4 font-sans font-medium text-stone data-[state=active]:bg-ocean data-[state=active]:text-white data-[state=active]:border-ocean transition-all duration-300 hover:shadow-md"
                >
                  <span className="mr-2 text-xl">{category.icon}</span>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="mt-0">
                {places.length === 0 ? (
                  <div className="text-center py-16" data-testid="no-places">
                    <p className="font-sans text-stone/60">
                      No {category.label.toLowerCase()} available yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid={`places-grid-${category.value}`}>
                    {places.map((place, index) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        destinationId={id}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Map View CTA */}
      <section className="px-6 md:px-12 lg:px-24 py-16 bg-sand">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-ocean tracking-tight mb-4">
            View All on Map
          </h2>
          <p className="font-sans text-stone/80 mb-8">
            Explore all locations visually and plan your perfect route
          </p>
          <button
            onClick={() => navigate('/map', { state: { destinationId: id } })}
            data-testid="view-map-button"
            className="bg-terracotta text-white px-8 py-3 rounded-xl font-sans font-medium hover:bg-terracotta/90 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            Open Map View
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default DestinationPage;
