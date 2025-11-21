"use client";

import Link from "next/link";
import { Property } from "@/types/property";

interface PropertyHeaderProps {
  property: Property;
  type: 'sale' | 'rent';
  scrollY: number;
  viewCount: number;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  showShareMenu: boolean;
  setShowShareMenu: (value: boolean) => void;
  onShare: (platform: string) => void;
}

export default function PropertyHeader({
  property,
  type,
  scrollY,
  viewCount,
  isLiked,
  setIsLiked,
  showShareMenu,
  setShowShareMenu,
  onShare
}: PropertyHeaderProps) {
  const headerOpacity = Math.min(scrollY / 150, 1);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out"
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${headerOpacity * 0.95})`,
        backdropFilter: `blur(${headerOpacity * 20}px) saturate(180%)`,
        borderBottom: `1px solid rgba(0, 0, 0, ${headerOpacity * 0.1})`
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Navigation */}
        <nav className="flex items-center space-x-1 text-sm">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
              scrollY > 100 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Home
          </Link>
          <span className={scrollY > 100 ? 'text-gray-400' : 'text-white/50'}>/</span>
          <Link 
            href={type === 'sale' ? '/for-sale' : '/for-rent'} 
            className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
              scrollY > 100 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            {type === 'sale' ? 'For Sale' : 'For Rent'}
          </Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center space-x-6">
          {/* View Counter */}
          {viewCount > 0 && (
            <div className={`flex items-center space-x-2 text-sm ${
              scrollY > 100 ? 'text-gray-500' : 'text-white/80'
            }`}>
              <div className="relative">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="font-medium">{viewCount} views</span>
            </div>
          )}
          
          {/* Like & Share Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                scrollY > 100 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'hover:bg-white/10 text-white/90'
              } ${isLiked ? 'text-red-500 scale-110' : ''}`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  scrollY > 100 
                    ? 'hover:bg-gray-100 text-gray-600' 
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 py-2 z-10">
                  {[
                    { name: 'Twitter', platform: 'twitter', color: 'text-blue-400' },
                    { name: 'Facebook', platform: 'facebook', color: 'text-blue-600' },
                    { name: 'LinkedIn', platform: 'linkedin', color: 'text-blue-700' },
                    { name: 'Copy Link', platform: 'copy', color: 'text-gray-600' }
                  ].map((item) => (
                    <button
                      key={item.platform}
                      onClick={() => onShare(item.platform)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${item.color} font-medium flex items-center space-x-3`}
                    >
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Price */}
          <div className={`text-right ${scrollY > 100 ? 'text-gray-900' : 'text-white'}`}>
            <div className="text-xl font-bold">{property.price.toLocaleString('tr-TR')} ₺</div>
            {type === 'rent' && <div className="text-sm opacity-75">per month</div>}
          </div>
        </div>
      </div>
    </header>
  );
}
