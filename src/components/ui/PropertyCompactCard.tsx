"use client";

import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import { generatePropertyUrl } from "@/utils/slug";
import { formatLocation, formatPrice } from "@/lib/client-utils";

interface PropertyCompactCardProps {
  property: Property;
}

export default function PropertyCompactCard({ property }: PropertyCompactCardProps) {
  const imageSrc =
    property.images?.[0] ??
    `https://source.unsplash.com/seed/${property.id}/320x240/?architecture,building`;

  const detailTags: string[] = [];
  if (property.specs.rooms) detailTags.push(property.specs.rooms);
  if (property.specs.bathrooms) detailTags.push(`${property.specs.bathrooms} banyo`);
  if (property.specs.netSize) detailTags.push(`${property.specs.netSize} m²`);

  return (
    <Link
      href={generatePropertyUrl(property)}
      className="group block rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm transition hover:border-primary-400 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/80"
    >
      <article className="flex gap-3">
        <div className="relative h-24 w-32 overflow-hidden rounded-xl bg-gray-200">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 220px, 220px"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={false}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary-500">
              {property.type === "sale" ? "Satılık" : "Kiralık"}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatPrice(property.price)} ₺
            </span>
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white">
            {property.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatLocation(property.location)}</p>
          <div className="flex flex-wrap gap-2">
            {detailTags.map((tag) => (
              <span
                key={`${property.id}-${tag}`}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
