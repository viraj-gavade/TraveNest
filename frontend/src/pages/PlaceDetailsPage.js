import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, DollarSign, Bookmark, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import { getPlaceDetails } from '../services/travelService';
import { useTravelContext } from '../context/TravelContext';

const PlaceDetailsPage = () => {
  const { destinationId, placeId } = useParams();
  const navigate = useNavigate();
  const { isPlaceSaved, toggleSavePlace } = useTravelContext();
  
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlace();
  }, [destinationId, placeId]);

  const loadPlace = async () => {
    setIsLoading(true);
    try {
      const data = await getPlaceDetails(destinationId, placeId);
      if (data) {
        setPlace(data);
      } else {
        navigate(`/destination/${destinationId}`);
      }
    } catch (error) {
      console.error('Error loading place:', error);
      navigate(`/destination/${destinationId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (place) {
      toggleSavePlace({ ...place, destinationId });
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

  if (!place) {
    return null;
  }

  const isSaved = isPlaceSaved(place.id);

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-sand" />
        
        <button
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="absolute top-8 left-6 md:left-12 lg:left-24 inline-flex items-center gap-2 text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/40 transition-all duration-300 font-sans z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </section>

      {/* Place Details */}
      <section className="px-6 md:px-12 lg:px-24 -mt-32 relative z-10 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 md:p-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="inline-block bg-ocean/10 text-ocean px-4 py-1.5 rounded-full text-sm font-sans font-semibold capitalize mb-4">
                  {place.category}
                </div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ocean tracking-tight mb-4">
                  {place.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-6 h-6 fill-terracotta text-terracotta" />
                  <span className="font-sans text-xl font-bold text-ocean">{place.rating}</span>
                  <span className="font-sans text-stone/60">/ 5.0</span>
                </div>
              </div>

              <button
                onClick={handleSave}
                data-testid="save-place-button"
                className={`flex-shrink-0 p-4 rounded-full transition-all duration-300 hover:scale-110 ${
                  isSaved 
                    ? 'bg-terracotta text-white' 
                    : 'bg-sand text-stone hover:bg-stone hover:text-white'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Description */}
            <p className="font-sans text-lg text-stone leading-relaxed mb-8">
              {place.description}
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {place.priceRange && (
                <div className="bg-sand p-4 rounded-xl" data-testid="price-info">
                  <div className="flex items-center gap-2 text-stone/60 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-sans text-sm">Price Range</span>
                  </div>
                  <p className="font-sans text-lg font-semibold text-ocean">{place.priceRange}</p>
                </div>
              )}
              
              {place.duration && (
                <div className="bg-sand p-4 rounded-xl" data-testid="duration-info">
                  <div className="flex items-center gap-2 text-stone/60 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-sans text-sm">Duration</span>
                  </div>
                  <p className="font-sans text-lg font-semibold text-ocean">{place.duration}</p>
                </div>
              )}

              {place.bestTime && (
                <div className="bg-sand p-4 rounded-xl" data-testid="best-time-info">
                  <div className="flex items-center gap-2 text-stone/60 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-sans text-sm">Best Time</span>
                  </div>
                  <p className="font-sans text-lg font-semibold text-ocean">{place.bestTime}</p>
                </div>
              )}

              {place.cuisine && (
                <div className="bg-sand p-4 rounded-xl" data-testid="cuisine-info">
                  <div className="flex items-center gap-2 text-stone/60 mb-2">
                    <span className="text-xl">🍽️</span>
                    <span className="font-sans text-sm">Cuisine</span>
                  </div>
                  <p className="font-sans text-lg font-semibold text-ocean">{place.cuisine}</p>
                </div>
              )}
            </div>

            {/* Specialties/Amenities */}
            {place.specialties && place.specialties.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-bold text-ocean mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-3">
                  {place.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-ocean/10 text-ocean px-4 py-2 rounded-xl font-sans text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {place.amenities && place.amenities.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-bold text-ocean mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {place.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-sans text-stone">
                      <span className="text-terracotta">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {place.coordinates && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-ocean mb-6">Location</h2>
                <MapView
                  center={place.coordinates}
                  zoom={15}
                  markers={[
                    {
                      id: place.id,
                      name: place.name,
                      category: place.category,
                      coordinates: place.coordinates,
                      rating: place.rating,
                    },
                  ]}
                  height="400px"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PlaceDetailsPage;
