import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import PlaceCard from '../components/PlaceCard';
import { useTravelContext } from '../context/TravelContext';

const SavedPage = () => {
  const navigate = useNavigate();
  const { savedPlaces, toggleSavePlace } = useTravelContext();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved places?')) {
      savedPlaces.forEach(place => toggleSavePlace(place));
    }
  };

  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 py-12 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ocean tracking-tight">
                Saved Places
              </h1>
              {savedPlaces.length > 0 && (
                <button
                  onClick={handleClearAll}
                  data-testid="clear-all-button"
                  className="flex items-center gap-2 text-stone hover:text-terracotta transition-colors font-sans text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
            <p className="font-sans text-lg text-stone/80">
              {savedPlaces.length === 0 
                ? 'Start exploring and save your favorite places here'
                : `You have ${savedPlaces.length} saved ${savedPlaces.length === 1 ? 'place' : 'places'}`
              }
            </p>
          </div>

          {/* Saved Places Grid */}
          {savedPlaces.length === 0 ? (
            <div className="text-center py-20" data-testid="empty-state">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-sand rounded-full mb-6">
                <Bookmark className="w-10 h-10 text-stone/40" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ocean mb-3">
                No Saved Places Yet
              </h2>
              <p className="font-sans text-stone/60 mb-8 max-w-md mx-auto">
                Discover amazing destinations and save your favorites to create your perfect travel itinerary
              </p>
              <button
                onClick={() => navigate('/')}
                data-testid="explore-button"
                className="bg-terracotta text-white px-8 py-3 rounded-xl font-sans font-medium hover:bg-terracotta/90 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Explore Destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="saved-places-grid">
              {savedPlaces.map((place, index) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  destinationId={place.destinationId}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Travel Tips Section */}
          {savedPlaces.length > 0 && (
            <div className="mt-16 bg-ocean/5 rounded-3xl p-8 md:p-12">
              <h2 className="font-serif text-3xl font-bold text-ocean mb-4">
                Planning Your Trip
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                <div>
                  <h3 className="font-semibold text-lg text-ocean mb-2">💡 Pro Tip</h3>
                  <p className="text-stone/80 leading-relaxed">
                    Group your saved places by location to plan efficient routes and save travel time.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-ocean mb-2">🗺️ Next Step</h3>
                  <p className="text-stone/80 leading-relaxed">
                    View all your saved places on the map to visualize your itinerary and discover nearby attractions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/map')}
                data-testid="view-on-map-button"
                className="mt-6 bg-terracotta text-white px-6 py-3 rounded-xl font-sans font-medium hover:bg-terracotta/90 active:scale-95 transition-all duration-300"
              >
                View on Map
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SavedPage;
