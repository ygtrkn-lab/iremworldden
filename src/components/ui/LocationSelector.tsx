"use client";

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getCountries, getStates, getAllCitiesOfCountry, getDistricts, LocationOption } from '@/data/locations';

interface LocationSelectorProps {
  onChange: (location: {
    country: string;
    state: string | null;
    city: string;
    district?: string;
  }) => void;
  initialValues?: {
    country: string;
    state: string | null;
    city: string;
    district?: string;
  };
}

export default function LocationSelector({ onChange, initialValues }: LocationSelectorProps) {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<LocationOption | null>(null);
  const [selectedState, setSelectedState] = useState<LocationOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<LocationOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationOption | null>(null);

  // Load countries on mount
  useEffect(() => {
    const countryOptions = getCountries();
    setCountries(countryOptions);

    // Set initial values if provided
    if (initialValues) {
      const country = countryOptions.find(c => c.value === initialValues.country);
      if (country) {
        setSelectedCountry(country);
        
        // For Turkey, load cities directly (no states)
        if (country.value === 'TR') {
          const cityOptions = getAllCitiesOfCountry(country.value);
          setCities(cityOptions);
          
          const city = cityOptions.find(c => c.value === initialValues.city);
          if (city) {
            setSelectedCity(city);
            
            // Load districts if city is selected
            const districtOptions = getDistricts(country.value, city.value);
            setDistricts(districtOptions);

            if (initialValues.district) {
              const district = districtOptions.find(d => d.value === initialValues.district);
              if (district) {
                setSelectedDistrict(district);
              }
            }
          }
        } else {
          // For other countries, use states
          const stateOptions = getStates(country.value);
          setStates(stateOptions);

          if (initialValues.state) {
            const state = stateOptions.find(s => s.value === initialValues.state);
            if (state) {
              setSelectedState(state);
            }
          }

          const cityOptions = getAllCitiesOfCountry(country.value);
          setCities(cityOptions);

          const city = cityOptions.find(c => c.value === initialValues.city);
          if (city) {
            setSelectedCity(city);
          }
        }
      }
    }
  }, [initialValues]);

  // Handle country change
  const handleCountryChange = (option: LocationOption | null) => {
    setSelectedCountry(option);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setStates([]);
    setCities([]);
    setDistricts([]);

    if (option) {
      if (option.value === 'TR') {
        // For Turkey, load cities directly
        const cityOptions = getAllCitiesOfCountry(option.value);
        setCities(cityOptions);
      } else {
        // For other countries, load states first
        const stateOptions = getStates(option.value);
        setStates(stateOptions);
        
        // If country has no states, load cities directly
        if (stateOptions.length === 0) {
          const cityOptions = getAllCitiesOfCountry(option.value);
          setCities(cityOptions);
        }
      }

      onChange({
        country: option.value,
        state: null,
        city: '',
        district: undefined
      });
    }
  };

  // Handle state change (only for non-Turkey countries)
  const handleStateChange = (option: LocationOption | null) => {
    setSelectedState(option);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setDistricts([]);

    if (selectedCountry && option) {
      const cityOptions = getAllCitiesOfCountry(selectedCountry.value);
      setCities(cityOptions);

      onChange({
        country: selectedCountry.value,
        state: option.value,
        city: '',
        district: undefined
      });
    }
  };

  // Handle city change
  const handleCityChange = (option: LocationOption | null) => {
    setSelectedCity(option);
    setSelectedDistrict(null);
    setDistricts([]);

    if (selectedCountry && option) {
      // Load districts when city is selected (for Turkey)
      if (selectedCountry.value === 'TR') {
        const districtOptions = getDistricts(selectedCountry.value, option.value);
        setDistricts(districtOptions);
      }

      onChange({
        country: selectedCountry.value,
        state: selectedState?.value || null,
        city: option.value,
        district: undefined
      });
    }
  };

  // Handle district change
  const handleDistrictChange = (option: LocationOption | null) => {
    setSelectedDistrict(option);

    if (selectedCountry && selectedCity) {
      onChange({
        country: selectedCountry.value,
        state: selectedState?.value || null,
        city: selectedCity.value,
        district: option?.value
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Country Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ülke
        </label>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries}
          isClearable
          isSearchable
          placeholder="Ülke seçin..."
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            menu: base => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
        />
      </div>

      {/* City Select - Show for Turkey immediately after country selection */}
      {selectedCountry && selectedCountry.value === 'TR' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Şehir
          </label>
          <Select
            value={selectedCity}
            onChange={handleCityChange}
            options={cities}
            isClearable
            isSearchable
            placeholder="Şehir seçin..."
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
        </div>
      )}

      {/* District Select - Show for Turkey when city is selected */}
      {selectedCountry && selectedCountry.value === 'TR' && selectedCity && districts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            İlçe
          </label>
          <Select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            options={districts}
            isClearable
            isSearchable
            placeholder="İlçe seçin..."
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
        </div>
      )}

      {/* State Select - Show only for non-Turkey countries */}
      {selectedCountry && selectedCountry.value !== 'TR' && states.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Eyalet/Bölge
          </label>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            options={states}
            isClearable
            isSearchable
            placeholder="Eyalet/Bölge seçin..."
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
        </div>
      )}

      {/* City Select - Show for non-Turkey countries after state selection */}
      {selectedCountry && selectedCountry.value !== 'TR' && cities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Şehir
          </label>
          <Select
            value={selectedCity}
            onChange={handleCityChange}
            options={cities}
            isClearable
            isSearchable
            placeholder="Şehir seçin..."
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
        </div>
      )}
    </div>
  );
}
