import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DestinationCard from '../components/DestinationCard';
import { getDestinations, searchDestinations } from '../services/travelService';

const HomePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchDestinations(searchQuery);
      setDestinations(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      loadDestinations();
      return;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551423004-f6411656752d"
            alt="Travel the world"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-sand" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" data-testid="hero-section">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up">
            Discover Your Next
            <br />
            <span className="text-terracotta">Adventure</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Explore breathtaking destinations, hidden gems, and unforgettable experiences around the world
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="max-w-2xl mx-auto animate-fade-in-up" 
            style={{ animationDelay: '400ms' }}
          >
            <div className="relative flex items-center bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
              <Search className="absolute left-6 w-5 h-5 text-stone" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search destinations, cities, or countries..."
                data-testid="search-input"
                className="w-full pl-14 pr-6 py-5 font-sans text-base text-ocean placeholder:text-stone/50 focus:outline-none"
              />
              <button
                type="submit"
                data-testid="search-button"
                disabled={isSearching}
                className="absolute right-2 bg-terracotta text-white px-8 py-3 rounded-full font-sans font-medium hover:bg-terracotta/90 active:scale-95 transition-all duration-300 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-ocean tracking-tight mb-4">
              {searchQuery ? 'Search Results' : 'Popular Destinations'}
            </h2>
            <p className="font-sans text-lg text-stone/80">
              {searchQuery 
                ? `Found ${destinations.length} destination${destinations.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : 'Handpicked destinations that will take your breath away'
              }
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20" data-testid="loading-spinner">
              <Loader2 className="w-8 h-8 animate-spin text-ocean" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-20" data-testid="no-results">
              <MapPin className="w-16 h-16 text-stone/30 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-ocean mb-2">
                No destinations found
              </h3>
              <p className="font-sans text-stone/60 mb-6">
                Try adjusting your search or explore our popular destinations
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  loadDestinations();
                }}
                className="bg-terracotta text-white px-6 py-3 rounded-xl font-sans font-medium hover:bg-terracotta/90 active:scale-95 transition-all duration-300"
              >
                View All Destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="destinations-grid">
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 lg:px-24 py-20 bg-ocean/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-ocean tracking-tight mb-6">
            Need Travel Advice?
          </h2>
          <p className="font-sans text-lg text-stone/80 mb-8">
            Chat with our local guides and get personalized recommendations for your trip
          </p>
          <button
            onClick={() => navigate('/chat')}
            data-testid="chat-cta-button"
            className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-xl font-sans font-medium text-lg hover:bg-terracotta/90 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            Ask a Local Guide
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
