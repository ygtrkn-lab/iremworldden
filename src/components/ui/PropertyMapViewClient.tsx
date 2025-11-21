"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Map as LeafletMap } from "leaflet";

import type { Property } from "@/types/property";
import { cn, formatLocation, formatPrice } from "@/lib/client-utils";
import { generatePropertyUrl } from "@/utils/slug";

export interface PropertyMapViewClientProps {
  properties: Property[];
  className?: string;
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: Property) => void;
  onQuickViewRequest?: (property: Property) => void;
  showSelectedCard?: boolean;
  focusOffset?: {
    x?: number;
    y?: number;
  };
}

const defaultCenter: [number, number] = [39.925533, 32.866287];

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function buildMarkerIcon(property: Property, isActive: boolean) {
  return L.icon({
    iconUrl: "/images/map/iremworld-property-location-icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: isActive ? "property-map-marker--active" : "",
  });
}

type LeafletMapWithTap = LeafletMap & { tap?: any };

export default function PropertyMapViewClient({
  properties,
  className,
  selectedPropertyId,
  onSelectProperty,
  onQuickViewRequest,
  showSelectedCard = true,
  focusOffset,
}: PropertyMapViewClientProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const hasFitBoundsRef = useRef(false);
  const mountedMapRef = useRef<LeafletMap | null>(null);

  const propertyIdsKey = useMemo(() => {
    if (!properties || properties.length === 0) return "empty";
    return properties.map((p) => p.id).join("-");
  }, [properties]);

  const mapInstanceKey = useMemo(
    () => `map-${propertyIdsKey}-${properties.length}`,
    [propertyIdsKey, properties.length]
  );

  const mapElementId = useMemo(
    () => `property-map-${mapInstanceKey}`,
    [mapInstanceKey]
  );

  const enableMapInteractions = useCallback((mapInstance: LeafletMapWithTap | null) => {
    if (!mapInstance) {
      return;
    }

    try {
      const container = mapInstance.getContainer();
      
      if (container) {
        container.style.pointerEvents = 'auto';
        container.style.touchAction = 'none';
      }

      // Disable tap completely
      if (mapInstance.tap) {
        try {
          (mapInstance.tap as any).disable();
        } catch {}
      }

      // Disable Leaflet's own dragging
      mapInstance.dragging.disable();

      // Implement custom drag handler
      let isDragging = false;
      let startPoint = { x: 0, y: 0 };
      let startCenter: L.LatLng;

      const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return; // Only left click
        isDragging = true;
        startPoint = { x: e.clientX, y: e.clientY };
        startCenter = mapInstance.getCenter();
        container.style.cursor = 'grabbing';
        e.preventDefault();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startPoint.x;
        const dy = e.clientY - startPoint.y;
        
        // Google Maps style: drag map in opposite direction
        // If you drag mouse right, map moves right (view pans left)
        const point = mapInstance.latLngToContainerPoint(startCenter);
        const newPoint = L.point(point.x - dx, point.y - dy);
        const newCenter = mapInstance.containerPointToLatLng(newPoint);
        
        mapInstance.setView(newCenter, mapInstance.getZoom(), { animate: false });
      };

      const onMouseUp = () => {
        if (isDragging) {
          isDragging = false;
          container.style.cursor = 'grab';
        }
      };

      // Add event listeners
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseUp);

      // Store cleanup function
      (container as any)._customDragCleanup = () => {
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('mouseleave', onMouseUp);
      };
      
      // Enable all other interactions
      mapInstance.scrollWheelZoom.enable();
      mapInstance.touchZoom.enable();
      mapInstance.doubleClickZoom.enable();
      mapInstance.boxZoom.enable();
      mapInstance.keyboard.enable();
    } catch (e) {
      // Silent fail
    }
  }, []);

  const mapInstanceRef = useCallback(
    (mapInstance: LeafletMap | null) => {
      if (!mapInstance) {
        return;
      }

      mapRef.current = mapInstance;

      if (!mountedMapRef.current) {
        mountedMapRef.current = mapInstance;
        enableMapInteractions(mapInstance as LeafletMapWithTap);
      }
    },
    [enableMapInteractions]
  );

  useEffect(() => {
    enableMapInteractions(mapRef.current as LeafletMapWithTap | null);
  }, [enableMapInteractions]);

  useEffect(() => {
    hasFitBoundsRef.current = false;
    const elementId = mapElementId;

    return () => {
      if (mountedMapRef.current) {
        try {
          const container = mountedMapRef.current.getContainer();
          if (container && (container as any)._customDragCleanup) {
            (container as any)._customDragCleanup();
          }
          mountedMapRef.current.off();
        } catch (error) {
          // Cleanup warning
        }
      }

      mapRef.current = null;
      mountedMapRef.current = null;
      const container = document.getElementById(elementId);
      if (container) {
        // @ts-expect-error Leaflet stores internal id on the DOM node
        if (container._leaflet_id) {
          // @ts-expect-error Leaflet stores internal id on the DOM node
          container._leaflet_id = undefined;
        }
      }
      hasFitBoundsRef.current = false;
    };
  }, [mapInstanceKey, mapElementId]);

  const coordinateProperties = useMemo(
    () => {
      return properties.filter(
        (property) =>
          property.location?.coordinates?.lat !== undefined &&
          property.location?.coordinates?.lng !== undefined
      );
    },
    [properties]
  );

  const isControlledSelection = selectedPropertyId !== undefined;

  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    () => coordinateProperties[0]?.id ?? null
  );

  const activeSelectedId = selectedPropertyId ?? internalSelectedId;

  useEffect(() => {
    if (coordinateProperties.length === 0) {
      if (!isControlledSelection) {
        setInternalSelectedId(null);
      }
      return;
    }

    if (isControlledSelection) {
      return;
    }

    setInternalSelectedId((current) => {
      if (current && coordinateProperties.some((property) => property.id === current)) {
        return current;
      }

      return coordinateProperties[0].id;
    });
  }, [coordinateProperties, isControlledSelection]);

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance || coordinateProperties.length === 0) {
      return;
    }

    hasFitBoundsRef.current = true;

    if (coordinateProperties.length === 1) {
      const { lat, lng } = coordinateProperties[0].location.coordinates!;
      mapInstance.setView([lat, lng], 15);
      return;
    }

    const bounds = L.latLngBounds(
      coordinateProperties.map((property) => [
        property.location.coordinates!.lat,
        property.location.coordinates!.lng,
      ])
    );

    mapInstance.fitBounds(bounds, { padding: [48, 48] });
  }, [coordinateProperties]);

  const resolvedOffset = useMemo(
    () => ({
      x: focusOffset?.x ?? 0,
      y: focusOffset?.y ?? 0,
    }),
    [focusOffset]
  );

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance || !activeSelectedId) {
      return;
    }

    const selectedProperty = coordinateProperties.find((property) => property.id === activeSelectedId);
    if (!selectedProperty?.location.coordinates) {
      return;
    }

    const { lat, lng } = selectedProperty.location.coordinates;
    const targetZoom = Math.max(mapInstance.getZoom(), 15);
    const offsetPoint = L.point(resolvedOffset.x ?? 0, resolvedOffset.y ?? 0);
    const hasOffset = offsetPoint.x !== 0 || offsetPoint.y !== 0;
    const projectedPoint = mapInstance.project([lat, lng], targetZoom);
    const nextCenterPoint = hasOffset ? projectedPoint.subtract(offsetPoint) : projectedPoint;
    const nextCenterLatLng = mapInstance.unproject(nextCenterPoint, targetZoom);

    mapInstance.stop();
    mapInstance.flyTo(nextCenterLatLng, targetZoom, {
      animate: true,
      duration: 0.45,
      easeLinearity: 0.2,
      noMoveStart: true,
    });
  }, [activeSelectedId, coordinateProperties, resolvedOffset]);

  // Update marker active state
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    // Remove active class from all markers
    const allMarkers = document.querySelectorAll('.leaflet-marker-icon');
    allMarkers.forEach(marker => marker.classList.remove('property-map-marker--active'));

    // Add active class to selected marker - wait for DOM update
    requestAnimationFrame(() => {
      const markers = document.querySelectorAll('.leaflet-marker-icon');
      const selectedIndex = coordinateProperties.findIndex(p => p.id === activeSelectedId);
      if (selectedIndex >= 0 && markers[selectedIndex]) {
        markers[selectedIndex].classList.add('property-map-marker--active');
      }
    });
  }, [activeSelectedId, coordinateProperties]);

  const selectedProperty = useMemo(() => {
    if (coordinateProperties.length === 0) {
      return null;
    }

    if (!activeSelectedId) {
      return coordinateProperties[0];
    }

    return (
      coordinateProperties.find((property) => property.id === activeSelectedId) ??
      coordinateProperties[0]
    );
  }, [coordinateProperties, activeSelectedId]);

  const handlePropertySelect = useCallback(
    (property: Property) => {
      if (!isControlledSelection) {
        setInternalSelectedId(property.id);
      }

      onSelectProperty?.(property);
    },
    [isControlledSelection, onSelectProperty]
  );

  if (properties.length > 0 && coordinateProperties.length === 0) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 text-sm text-gray-500",
          className
        )}
      >
        Konum bilgisi bulunmayan ilanlar haritada görüntülenemiyor.
      </div>
    );
  }

  if (coordinateProperties.length === 0) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 text-sm text-gray-500",
          className
        )}
      >
        Henüz konumlanacak ilan yok.
      </div>
    );
  }

  const initialCenter: [number, number] = coordinateProperties.length
    ? [
        coordinateProperties[0].location.coordinates!.lat,
        coordinateProperties[0].location.coordinates!.lng,
      ]
    : defaultCenter;

  return (
  <div className={cn("relative h-full w-full", className)} style={{ zIndex: 0 }}>
      <MapContainer
        key={mapInstanceKey}
        id={mapElementId}
        center={initialCenter}
        zoom={6}
        minZoom={4}
        maxZoom={18}
        zoomControl={false}
        dragging={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        touchZoom={true}
        preferCanvas={true}
        whenReady={() => enableMapInteractions(mapRef.current as LeafletMapWithTap)}
        ref={mapInstanceRef}
        className="h-full w-full select-none"
        style={{ touchAction: 'none', position: 'relative', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {coordinateProperties.map((property) => {
          const coordinates = property.location.coordinates!;
          const isActive = property.id === activeSelectedId;

          return (
            <Marker
              key={property.id}
              position={[coordinates.lat, coordinates.lng]}
              icon={buildMarkerIcon(property, isActive)}
              eventHandlers={{
                click: () => handlePropertySelect(property),
              }}
            />
          );
        })}
      </MapContainer>

      {showSelectedCard && selectedProperty && (
  <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1000] flex justify-center px-4 pb-6 sm:bottom-8 sm:pb-7 lg:bottom-10 lg:pb-9">
          <div className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur-xl">
            <div className="flex gap-4 p-4">
              <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={
                    selectedProperty.images?.[0] ||
                    `https://source.unsplash.com/400x300/?real-estate&sig=${selectedProperty.id}`
                  }
                  alt={selectedProperty.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {selectedProperty.type === "sale" ? "Satılık" : "Kiralık"}
                </div>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {selectedProperty.title}
                </h3>
                <div className="text-sm text-gray-500">
                  {formatLocation(selectedProperty.location)}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 justify-between">
                  <span className="text-lg font-semibold text-primary-600">
                    {formatPrice(selectedProperty.price)} ₺
                  </span>
                  <div className="flex items-center gap-2">
                    {onQuickViewRequest && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onQuickViewRequest(selectedProperty);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        Hızlı Görüntüle
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 12h10M4 16h6" />
                        </svg>
                      </button>
                    )}
                    <Link
                      href={generatePropertyUrl(selectedProperty)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-600"
                    >
                      Detayları Gör
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
