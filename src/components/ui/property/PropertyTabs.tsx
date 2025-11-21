"use client";

import { useState } from "react";
import { Property } from "@/types/property";
import PropertyMap from "./PropertyMap";

interface PropertyTabsProps {
  property: Property;
  type: "sale" | "rent";
}

export default function PropertyTabs({ property, type }: PropertyTabsProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [mapType, setMapType] = useState<"map" | "street" | "places">("map");

  const tabs = [
    { id: "details", label: "İlan Detayları", icon: "📋" },
    { id: "description", label: "Açıklama", icon: "📝" },
    { id: "location", label: "Konum", icon: "📍" },
    { id: "features", label: "Özellikler", icon: "⭐" },
  ];

  const renderFeatureList = (
    features: Array<{ label: string; value: any; condition?: boolean }>
  ) => {
    return features
      .filter((item) => item.condition !== false && item.value)
      .map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <span className="text-gray-600 text-sm">{item.label}</span>
          <span className="font-medium text-gray-900 text-sm">{item.value}</span>
        </div>
      ));
  };

  const renderBooleanFeatures = (
    features: Array<{ label: string; condition: boolean }>
  ) => {
    return features
      .filter((item) => item.condition)
      .map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <span className="text-gray-600 text-sm">{item.label}</span>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Temel Bilgiler
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {property.category.main !== "Arsa" && (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Oda Sayısı</span>
                      <span className="font-medium">{property.specs?.rooms}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Banyo Sayısı</span>
                      <span className="font-medium">{property.specs?.bathrooms}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bina Yaşı</span>
                      <span className="font-medium">{property.specs?.age} yıl</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Kat</span>
                      <span className="font-medium">{property.specs?.floor}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Isıtma</span>
                      <span className="font-medium">{property.specs?.heating}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">m² (Net)</span>
                  <span className="font-medium">{property.specs?.netSize} m²</span>
                </div>
                {property.specs?.grossSize && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">m² (Brüt)</span>
                    <span className="font-medium">{property.specs.grossSize} m²</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {property.category.main !== "Arsa" && (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Balkon</span>
                      <span className="font-medium">{property.exteriorFeatures?.hasBalcony ? 'Var' : 'Yok'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Asansör</span>
                      <span className="font-medium">{property.buildingFeatures?.hasElevator ? 'Var' : 'Yok'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Otopark</span>
                      <span className="font-medium">{property.buildingFeatures?.hasCarPark ? 'Var' : 'Yok'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Eşyalı</span>
                      <span className="font-medium">{property.specs?.furnishing === 'Furnished' ? 'Evet' : 'Hayır'}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Krediye Uygun</span>
                  <span className="font-medium">{property.propertyDetails?.creditEligible ? 'Evet' : 'Hayır'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tapu Durumu</span>
                  <span className="font-medium">{property.propertyDetails?.deedStatus}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kimden</span>
                  <span className="font-medium">{property.propertyDetails?.fromWho}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "description" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Açıklama
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konum ve Harita
            </h3>
            <div className="space-y-4">
              {/* Address Section */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium">Adres</span>
                </div>
                <p className="text-gray-900">
                  {property.location.address || 
                   `${property.location.neighborhood || ''} ${property.location.district || ''}, ${property.location.city}`}
                </p>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-lg overflow-hidden">
                <PropertyMap property={property} mapType={mapType} />
              </div>

              {/* Map Controls */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setMapType("map")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
                    ${mapType === "map" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  🗺️ Harita Görünümü
                </button>
                <button 
                  onClick={() => setMapType("street")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
                    ${mapType === "street" 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  🏠 Street View
                </button>
                <button 
                  onClick={() => setMapType("places")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
                    ${mapType === "places" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  🏫 Yakın Yerler
                </button>
              </div>

              {/* Places Legend - Only show when places view is active */}
              {mapType === "places" && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-sm mb-2">Yakın Yerler</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      <span>Okullar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span>Hastaneler</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>Parklar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span>Ulaşım</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "features" && (
          <div className="space-y-6">
            {/* Interior Features */}
            {property.interiorFeatures && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  İç Özellikler
                </h4>
                <div className="space-y-2">
                  {renderFeatureList([
                    {
                      label: "Mutfak Tipi",
                      value: property.interiorFeatures.kitchenType,
                    },
                  ])}
                  {renderBooleanFeatures([
                    {
                      label: "Ankastre Mutfak",
                      condition: property.interiorFeatures.hasBuiltInKitchen,
                    },
                    {
                      label: "Gömme Dolap",
                      condition: property.interiorFeatures.hasBuiltInWardrobe,
                    },
                    {
                      label: "Laminat",
                      condition: property.interiorFeatures.hasLaminate,
                    },
                    {
                      label: "Parke",
                      condition: property.interiorFeatures.hasParquet,
                    },
                    {
                      label: "Seramik",
                      condition: property.interiorFeatures.hasCeramic,
                    },
                    {
                      label: "Mermer",
                      condition: property.interiorFeatures.hasMarble,
                    },
                  ])}
                </div>
              </div>
            )}

            {/* Building Features */}
            {property.buildingFeatures && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Bina Özellikleri
                </h4>
                <div className="space-y-2">
                  {renderBooleanFeatures([
                    {
                      label: "Asansör",
                      condition: property.buildingFeatures.hasElevator,
                    },
                    {
                      label: "Otopark",
                      condition: property.buildingFeatures.hasCarPark,
                    },
                    {
                      label: "Güvenlik",
                      condition: property.buildingFeatures.hasSecurity,
                    },
                    {
                      label: "Havuz",
                      condition: property.buildingFeatures.hasPool,
                    },
                    {
                      label: "Spor Salonu",
                      condition: property.buildingFeatures.hasGym,
                    },
                    {
                      label: "Sauna",
                      condition: property.buildingFeatures.hasSauna,
                    },
                  ])}
                </div>
              </div>
            )}

            {/* Exterior Features */}
            {property.exteriorFeatures && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Dış Özellikler
                </h4>
                <div className="space-y-2">
                  {renderFeatureList([
                    {
                      label: "Cephe",
                      value: property.exteriorFeatures.facade,
                    },
                  ])}
                  {renderBooleanFeatures([
                    {
                      label: "Balkon",
                      condition: property.exteriorFeatures.hasBalcony,
                    },
                    {
                      label: "Teras",
                      condition: property.exteriorFeatures.hasTerrace,
                    },
                    {
                      label: "Bahçe",
                      condition: property.exteriorFeatures.hasGarden,
                    },
                    {
                      label: "Deniz Manzarası",
                      condition: property.exteriorFeatures.hasSeaView,
                    },
                    {
                      label: "Şehir Manzarası",
                      condition: property.exteriorFeatures.hasCityView,
                    },
                    {
                      label: "Doğa Manzarası",
                      condition: property.exteriorFeatures.hasNatureView,
                    },
                  ])}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
