import { Country, State, City } from 'country-state-city';
import { 
  getCityNames, 
  getDistrictsByCityCode, 
  isCityName,
  cityNamesByCode
} from 'turkey-neighbourhoods';

// Target countries we want to support
const TARGET_COUNTRIES = ['TR', 'DE', 'AE', 'US', 'CH', 'GB', 'NO'];

export type LocationOption = {
  value: string;
  label: string;
};

// Get all supported countries
export const getCountries = (): LocationOption[] => {
  return Country.getAllCountries()
    .filter(country => TARGET_COUNTRIES.includes(country.isoCode))
    .map(country => ({
      value: country.isoCode,
      label: country.name
    }));
};

// Get states/cities for a country
export const getStates = (countryCode: string): LocationOption[] => {
  return State.getStatesOfCountry(countryCode)
    .map(state => ({
      value: state.isoCode,
      label: state.name
    }));
};

// Get cities for a state or country
export const getCities = (countryCode: string, stateCode?: string): LocationOption[] => {
  if (countryCode === 'TR') {
    // For Turkey, use the turkey-neighbourhoods package
    const cityNames = getCityNames();
    return cityNames.map(cityName => ({
      value: cityName,
      label: cityName
    }));
  }

  // For other countries, use country-state-city package
  if (stateCode) {
    const stateCities = City.getCitiesOfState(countryCode, stateCode);
    return stateCities ? stateCities.map(city => ({
      value: city.name,
      label: city.name
    })) : [];
  }

  const countryCities = City.getCitiesOfCountry(countryCode);
  return countryCities ? countryCities.map(city => ({
    value: city.name,
    label: city.name
  })) : [];
};

// Get all cities for a country (when state/province is not applicable)
export const getAllCitiesOfCountry = (countryCode: string): LocationOption[] => {
  return getCities(countryCode);
};

// Get districts for a city
export const getDistricts = (countryCode: string, cityName: string): LocationOption[] => {
  if (countryCode === 'TR' && isCityName(cityName)) {
    // Find the city code for the given city name
    const cityCode = Object.keys(cityNamesByCode).find(
      code => (cityNamesByCode as any)[code] === cityName
    );
    
    if (cityCode) {
      const districts = getDistrictsByCityCode(cityCode);
      return districts.map(district => ({
        value: district,
        label: district
      }));
    }
  }
  return [];
};

// Find location names from codes
export const findLocationNames = (
  countryCode: string,
  stateCode: string | null,
  cityName: string,
  districtName?: string
): { country: string; state: string; city: string; district: string } => {
  const country = Country.getCountryByCode(countryCode);
  const state = stateCode ? State.getStateByCodeAndCountry(stateCode, countryCode) : null;
  
  return {
    country: country?.name || '',
    state: state?.name || '',
    city: cityName || '',
    district: districtName || ''
  };
};

// Get formatted location string
export const getFormattedLocation = (
  countryCode: string,
  stateCode: string | null,
  cityName: string,
  districtName?: string
): string => {
  const names = findLocationNames(countryCode, stateCode, cityName, districtName);
  const parts = [names.district, names.city, names.state, names.country].filter(Boolean);
  return parts.join(', ');
};
