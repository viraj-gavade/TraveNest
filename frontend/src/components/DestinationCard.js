import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const DestinationCard = ({ destination, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/destination/${destination.id}`);
  };

  return (
    <div
      data-testid={`destination-card-${destination.id}`}
      className="group cursor-pointer animate-fade-in-up rounded-3xl overflow-hidden bg-white border border-black/5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-terracotta text-terracotta" />
          <span className="font-sans text-sm font-semibold text-ocean">{destination.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-ocean tracking-tight mb-1 group-hover:text-terracotta transition-colors duration-300">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1.5 text-stone">
              <MapPin className="w-4 h-4" />
              <span className="font-sans text-sm">{destination.country}</span>
            </div>
          </div>
        </div>

        <p className="font-sans text-stone/80 leading-relaxed mb-4 line-clamp-2">
          {destination.description}
        </p>

        {/* Highlights */}
        {destination.highlights && destination.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {destination.highlights.slice(0, 3).map((highlight, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-sand rounded-full text-xs font-sans text-stone"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          data-testid={`explore-${destination.id}-button`}
          className="mt-6 w-full bg-terracotta text-white font-sans font-medium py-3 px-6 rounded-xl hover:bg-terracotta/90 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Explore Destination
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
