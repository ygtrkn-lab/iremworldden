import dynamic from "next/dynamic";

import type { PropertyMapViewClientProps } from "./PropertyMapViewClient";

const PropertyMapView = dynamic<PropertyMapViewClientProps>(
  () => import("./PropertyMapViewClient"),
  {
    ssr: false,
    loading: (props) => {
      const { className } = (props ?? {}) as PropertyMapViewClientProps;

      return (
        <div
          className={`flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500 ${
            className ?? ""
          }`}
        >
          Harita yükleniyor...
        </div>
      );
    },
  }
);

export default PropertyMapView;
