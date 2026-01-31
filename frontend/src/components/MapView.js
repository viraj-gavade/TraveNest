import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star } from 'lucide-react';

// Fix Leaflet default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView = ({ center, zoom = 13, markers = [], onMarkerClick, height = '500px' }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView(
      [center.lat, center.lng],
      zoom
    );

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Create markers layer group
    markersLayer.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapInstance.current && center) {
      mapInstance.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!markersLayer.current) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Add new markers
    markers.forEach((marker) => {
      const categoryIcons = {
        attraction: '🏛️',
        food: '🍽️',
        hotel: '🏨',
        culture: '🎭',
      };

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: white;
            border: 3px solid #0F4C5C;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            cursor: pointer;
          ">
            ${categoryIcons[marker.category] || '📍'}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const leafletMarker = L.marker([marker.coordinates.lat, marker.coordinates.lng], { icon })
        .addTo(markersLayer.current);

      // Create popup content
      const popupContent = `
        <div style="font-family: 'DM Sans', sans-serif; min-width: 200px;">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; color: #0F4C5C; margin-bottom: 4px;">
            ${marker.name}
          </h3>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
            <span style="color: #E36414;">⭐</span>
            <span style="font-size: 14px; font-weight: 600;">${marker.rating}</span>
          </div>
          <div style="
            background: #FAFAF9;
            padding: 4px 8px;
            border-radius: 12px;
            display: inline-block;
            font-size: 12px;
            color: #57534E;
            text-transform: capitalize;
          ">
            ${marker.category}
          </div>
        </div>
      `;

      leafletMarker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: true,
      });

      // Handle marker click
      if (onMarkerClick) {
        leafletMarker.on('click', () => {
          onMarkerClick(marker);
        });
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-stone/20 shadow-lg">
      <div ref={mapRef} style={{ height, width: '100%' }} data-testid="map-container" />
      
      {/* Map Legend */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg z-[1000]">
          <div className="font-sans text-xs font-semibold text-ocean mb-2">Legend</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span>🏛️</span>
              <span className="font-sans text-stone">Attractions</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>🍽️</span>
              <span className="font-sans text-stone">Food</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>🏨</span>
              <span className="font-sans text-stone">Hotels</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>🎭</span>
              <span className="font-sans text-stone">Culture</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
