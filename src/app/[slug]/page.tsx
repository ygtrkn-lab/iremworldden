"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/types/property";
import PropertyHero from "@/components/ui/property/PropertyHero";
import PropertyGallery from "@/components/ui/property/PropertyGallery";
import PropertyContent from "@/components/ui/property/PropertyContent";
import PropertyLoading from "@/components/ui/property/PropertyLoading";
import PropertyError from "@/components/ui/property/PropertyError";

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Determine property type from URL path
  const type: 'sale' | 'rent' = typeof window !== 'undefined' && window.location.pathname.includes('satilik') ? 'sale' : 'rent';

  useEffect(() => {
    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error('Emlak bulunamadı');
      }
      
      const data = await response.json();
      setProperty(data.property);
    } catch (error) {
      console.error('Property fetch error:', error);
      setError('Emlak yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PropertyLoading />;
  }

  if (error || !property) {
    return <PropertyError error={error} type={type} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with title and basic info */}
      <PropertyHero property={property} type={type} />
      
      {/* Gallery Section */}
      <PropertyGallery images={property.images} property={property} type={type} />
      
      {/* Content Section with all property details */}
      <div ref={contentRef}>
        <PropertyContent 
          property={property} 
          type={type}
          isVisible={isVisible}
        />
      </div>
    </div>
  );
}
