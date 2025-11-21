"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/types/property";
import PropertyDetailIrem from "@/components/ui/property/property-detail-irem";
import PropertyLoading from "@/components/ui/property/PropertyLoading";
import PropertyError from "@/components/ui/property/PropertyError";

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackType = useMemo<"sale" | "rent">(() => {
    const normalized = slug?.toLowerCase() || "";
    if (normalized.includes("kiralik") || normalized.includes("rent")) {
      return "rent";
    }
    return "sale";
  }, [slug]);

  async function fetchProperty() {
    try {
      setLoading(true);
      const encodedSlug = encodeURIComponent(slug);
      const response = await fetch(`/api/properties/slug/${encodedSlug}`);

      if (!response.ok) {
        throw new Error("Property not found");
      }

      const data = await response.json();
      setProperty(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  if (loading) {
    return <PropertyLoading />;
  }

  if (error || !property) {
    return (
      <PropertyError
        error={error || "Property not found"}
        type={fallbackType}
        backHref="/property"
        backLabel="← Gayrimenkul haritasına dön"
      />
    );
  }

  const backHref = `/property?type=${property.type}`;

  return (
    <PropertyDetailIrem
      property={property}
      type={property.type}
      backHref={backHref}
      backLabel="Gayrimenkul haritasına dön"
    />
  );
}
