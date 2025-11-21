  "use client";

import { useState } from 'react';
import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';
import ImageViewer from './ImageViewer';
import { generatePropertyUrl } from '@/utils/slug';
import { formatLocation, formatPrice } from '@/lib/client-utils';

interface PropertyDetailCardProps {
  property: Property;
}

export default function PropertyDetailCard({ property }: PropertyDetailCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Using imported formatPrice function
  const formatPriceWithCurrency = (price: number) => {
    return formatPrice(price) + ' ₺';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <Link href={generatePropertyUrl(property)} className="block">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
        {/* Image Gallery */}
        <div 
          className="relative h-80 bg-gray-200 cursor-zoom-in"
          onClick={(e) => {
            e.preventDefault();
            setShowImageViewer(true);
          }}
        >
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover"
          />
          
          {/* Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Indicators */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold">
            {formatPriceWithCurrency(property.price)}
          </div>

          {/* Type Badge */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {property.type === 'sale' ? 'Satılık' : 'Kiralık'}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          {/* Title and Location */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {formatLocation(property.location)}
            </p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {property.category.main === "Arsa" ? (
              <>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{property.specs.netSize}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                {property.landDetails?.pricePerSquareMeter && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{property.landDetails.pricePerSquareMeter.toLocaleString('tr-TR')}</div>
                    <div className="text-sm text-gray-600">₺/m²</div>
                  </div>
                )}
                {property.landDetails?.zoningStatus && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{property.landDetails.zoningStatus}</div>
                    <div className="text-sm text-gray-600">İmar Durumu</div>
                  </div>
                )}
                {property.propertyDetails?.deedStatus && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{property.propertyDetails.deedStatus}</div>
                    <div className="text-sm text-gray-600">Tapu Durumu</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{property.specs.rooms}</div>
                  <div className="text-sm text-gray-600">Oda</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{property.specs.bathrooms}</div>
                  <div className="text-sm text-gray-600">Banyo</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{property.specs.netSize}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{property.specs.age}</div>
                  <div className="text-sm text-gray-600">Yaş</div>
                </div>
              </>
            )}
          </div>

          {/* Description Preview */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Açıklama</h4>
            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {property.description}
            </p>
          </div>

          {/* Features Preview - Sadece Arsa kategorisi dışında göster */}
          {property.category.main !== "Arsa" && (
            <>
              {/* Interior Features Preview */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Özellikler</h4>
                <div className="flex flex-wrap gap-2">
                  {property.specs?.heating && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {property.specs.heating}
                    </span>
                  )}
                  {property.specs?.furnishing && property.specs.furnishing !== 'Unfurnished' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {property.specs.furnishing === 'Furnished' ? 'Eşyalı' : 
                       property.specs.furnishing === 'Partially Furnished' ? 'Yarı Eşyalı' : property.specs.furnishing}
                    </span>
                  )}
                  {property.interiorFeatures?.hasBuiltInKitchen && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Ankastre Mutfak
                    </span>
                  )}
                  {property.interiorFeatures?.hasBuiltInWardrobe && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Gömme Dolap
                    </span>
                  )}
                  {property.exteriorFeatures?.hasBalcony && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Balkon
                    </span>
                  )}
                  {property.exteriorFeatures?.hasTerrace && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Teras
                    </span>
                  )}
                  {property.exteriorFeatures?.hasGarden && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Bahçe
                    </span>
                  )}
                  {property.exteriorFeatures?.hasSeaView && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Deniz Manzarası
                    </span>
                  )}
                  {property.exteriorFeatures?.hasCityView && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Şehir Manzarası
                    </span>
                  )}
                  {property.exteriorFeatures?.hasNatureView && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Doğa Manzarası
                    </span>
                  )}
                  {property.interiorFeatures?.hasParquet && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      Parke
                    </span>
                  )}
                  {property.interiorFeatures?.hasLaminate && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      Laminat
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Building Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Bina Özellikleri</h4>
                <div className="grid grid-cols-2 gap-3">
                  {property.buildingFeatures?.hasCarPark && (
                    <div className="flex items-center text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Otopark
                    </div>
                  )}
                  {property.buildingFeatures?.hasElevator && (
                    <div className="flex items-center text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Asansör
                    </div>
                  )}
                  {property.buildingFeatures?.hasSecurity && (
                    <div className="flex items-center text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Güvenlik
                    </div>
                  )}
                  {property.buildingFeatures?.hasPool && (
                    <div className="flex items-center text-sm text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Havuz
                    </div>
                  )}
                  {property.buildingFeatures?.hasGym && (
                    <div className="flex items-center text-sm text-purple-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Spor Salonu
                    </div>
                  )}
                  {property.buildingFeatures?.hasSauna && (
                    <div className="flex items-center text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Sauna
                    </div>
                  )}
                  {property.buildingFeatures?.hasPlayground && (
                    <div className="flex items-center text-sm text-pink-600">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                      Oyun Alanı
                    </div>
                  )}
                  {property.buildingFeatures?.hasGenerator && (
                    <div className="flex items-center text-sm text-yellow-600">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Jeneratör
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Arsa Özel Özellikleri */}
          {property.category.main === "Arsa" && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Arsa Detayları</h4>
              <div className="flex flex-wrap gap-2">
                {property.landDetails?.blockNumber && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Ada No: {property.landDetails.blockNumber}
                  </span>
                )}
                {property.landDetails?.parcelNumber && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Parsel No: {property.landDetails.parcelNumber}
                  </span>
                )}
                {property.landDetails?.creditEligibility && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    Krediye Uygunluk: {property.landDetails.creditEligibility}
                  </span>
                )}
                {property.propertyDetails?.exchangeAvailable && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    Takas: Evet
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Image Viewer */}
          {showImageViewer && (
            <ImageViewer
              images={property.images}
              initialIndex={currentImageIndex}
              onClose={() => setShowImageViewer(false)}
            />
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Detayları görüntülemek için tıklayın
              </div>
              <div className="text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
