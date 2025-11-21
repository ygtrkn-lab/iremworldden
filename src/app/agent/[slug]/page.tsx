"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";
import PropertyCard from "@/components/ui/PropertyCard";

export default function AgentPage() {
  const params = useParams();
  const agentSlug = params.slug as string;
  const [properties, setProperties] = useState<Property[]>([]);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentProperties = async () => {
      try {
        // Convert slug back to agent name and decode URL components
        const agentName = decodeURIComponent(agentSlug.replace(/-/g, ' ')).replace(/\b\w/g, l => l.toUpperCase());
        
        // Fetch all properties
        const response = await fetch('/api/properties');
        const data = await response.json();
        
        // Extract properties array from response
        const allProperties = data.properties || data;
        
        // Filter properties by agent name
        const agentProperties = allProperties.filter((property: Property) => 
          property.agent.name.toLowerCase() === agentName.toLowerCase()
        );
        
        setProperties(agentProperties);
        
        // Set agent info from first property
        if (agentProperties.length > 0) {
          setAgentInfo(agentProperties[0].agent);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agent properties:', error);
        setLoading(false);
      }
    };

    if (agentSlug) {
      fetchAgentProperties();
    }
  }, [agentSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!agentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Danışman Bulunamadı</h1>
          <p className="text-gray-600">Bu danışmana ait bilgi bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agent Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
              {agentInfo.photo ? (
                <img
                  src={agentInfo.photo}
                  alt={agentInfo.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agentInfo.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{agentInfo.company}</p>
              <div className="flex items-center space-x-4 mt-3">
                <a
                  href={`tel:${agentInfo.phone}`}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Ara
                </a>
                <a
                  href={`mailto:${agentInfo.email}`}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  E-posta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {agentInfo.name} - Tüm İlanları ({properties.length})
          </h2>
          <p className="text-gray-600 mt-2">
            Bu danışmanın eklediği tüm emlak ilanları
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İlan Yok</h3>
            <p className="text-gray-600">Bu danışmanın henüz aktif ilanı bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                view="grid"
                onFavoriteToggle={() => {}}
                isFavorite={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
