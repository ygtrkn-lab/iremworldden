"use client";

import { useEffect, useRef, useState } from "react";
import { Property } from "@/types/property";

interface PropertyMapProps {
  property: Property;
  mapType: "map" | "street" | "places";
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function PropertyMap({ property, mapType }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      // Set up the global callback
      window.initMap = initializeMap;
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Default to Istanbul coordinates if location not provided
      const defaultLocation = { lat: 41.0082, lng: 28.9784 };
      const location = property.location.coordinates || defaultLocation;

      const mapOptions = {
        center: location,
        zoom: 15,
        mapTypeId: mapType === "street" ? "streetview" : "roadmap",
        mapTypeControl: true,
        streetViewControl: mapType === "street",
        fullscreenControl: true,
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add marker for property location
      new window.google.maps.Marker({
        position: location,
        map: newMap,
        title: property.title,
        animation: window.google.maps.Animation.DROP,
      });

      // If places view is requested, show nearby places
      if (mapType === "places") {
        const service = new window.google.maps.places.PlacesService(newMap);
        const request = {
          location: location,
          radius: 1000, // 1km radius
          type: ["school", "hospital", "shopping_mall", "park", "restaurant", "bus_station", "subway_station"],
        };

        service.nearbySearch(request, (results: any, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place: any) => {
              new window.google.maps.Marker({
                position: place.geometry.location,
                map: newMap,
                title: place.name,
                icon: {
                  url: place.icon,
                  scaledSize: new window.google.maps.Size(24, 24),
                },
              });
            });
          }
        });
      }

      // If street view is requested, initialize street view
      if (mapType === "street") {
        const streetView = newMap.getStreetView();
        streetView.setPosition(location);
        streetView.setPov({
          heading: 34,
          pitch: 10,
        });
        streetView.setVisible(true);
      }

      setMap(newMap);
      setLoading(false);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (map) {
        // Remove the map instance
        setMap(null);
      }
    };
  }, [property.location, mapType]);

  if (loading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Harita yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full rounded-lg shadow-md" />
      {mapType === "places" && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-medium text-sm mb-2">Yakın Yerler</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span>Okullar</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span>Hastaneler</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Parklar</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span>Ulaşım</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
