import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Bookmark } from 'lucide-react';
import { useTravelContext } from '../context/TravelContext';

const PlaceCard = ({ place, destinationId, index = 0 }) => {
  const navigate = useNavigate();
  const { isPlaceSaved, toggleSavePlace } = useTravelContext();
  const isSaved = isPlaceSaved(place.id);

  const handleClick = () => {
    navigate(`/destination/${destinationId}/place/${place.id}`);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSavePlace({ ...place, destinationId });
  };

  const getCategoryColor = (category) => {
    const colors = {
      attraction: 'bg-blue-100 text-blue-700',
      food: 'bg-orange-100 text-orange-700',
      hotel: 'bg-green-100 text-green-700',
      culture: 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-stone/10 text-stone';
  };

  return (
    <div
      data-testid={`place-card-${place.id}`}
      className="group cursor-pointer animate-fade-in-up bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${getCategoryColor(place.category)}`}>
          {place.category}
        </div>

        {/* Save Button */}
        <button
          data-testid={`save-place-${place.id}-button`}
          onClick={handleSave}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isSaved 
              ? 'bg-terracotta text-white scale-110' 
              : 'bg-white/90 text-stone hover:bg-white hover:scale-110'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-sans text-lg font-bold text-ocean group-hover:text-terracotta transition-colors duration-300 flex-1">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 fill-terracotta text-terracotta" />
            <span className="font-sans text-sm font-semibold text-ocean">{place.rating}</span>
          </div>
        </div>

        <p className="font-sans text-sm text-stone/80 leading-relaxed line-clamp-2 mb-3">
          {place.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs font-sans">
          {place.priceRange && (
            <span className="text-stone font-medium">{place.priceRange}</span>
          )}
          {place.duration && (
            <span className="text-stone/60">{place.duration}</span>
          )}
          {place.cuisine && (
            <span className="text-stone/60">{place.cuisine}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
