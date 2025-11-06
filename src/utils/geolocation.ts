// City to coordinates mapping (latitude, longitude)
export const cityCoordinates: Record<
  string,
  { latitude: number; longitude: number }
> = {
  Mumbai: { latitude: 19.076, longitude: 72.8777 },
  Delhi: { latitude: 28.7041, longitude: 77.1025 },
  Bangalore: { latitude: 12.9716, longitude: 77.5946 },
  Hyderabad: { latitude: 17.385, longitude: 78.4867 },
  Chennai: { latitude: 13.0827, longitude: 80.2707 },
  Kolkata: { latitude: 22.5726, longitude: 88.3639 },
  Pune: { latitude: 18.5204, longitude: 73.8567 },
  Ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
  Jaipur: { latitude: 26.9124, longitude: 75.7873 },
  Surat: { latitude: 21.1702, longitude: 72.8311 },
  Lucknow: { latitude: 26.8467, longitude: 80.9462 },
  Kanpur: { latitude: 26.4499, longitude: 80.3319 },
  Nagpur: { latitude: 21.1458, longitude: 79.0882 },
  Indore: { latitude: 22.7196, longitude: 75.8577 },
  Thane: { latitude: 19.2183, longitude: 72.9781 },
  Bhopal: { latitude: 23.1815, longitude: 77.4104 },
  Visakhapatnam: { latitude: 17.6869, longitude: 83.2185 },
  'Pimpri-Chinchwad': { latitude: 18.6298, longitude: 73.7997 },
  Patna: { latitude: 25.5941, longitude: 85.1376 },
  Vadodara: { latitude: 22.3072, longitude: 73.1812 },
  Ghaziabad: { latitude: 28.6692, longitude: 77.4538 },
  Ludhiana: { latitude: 30.901, longitude: 75.8573 },
  Agra: { latitude: 27.1767, longitude: 78.0081 },
  Nashik: { latitude: 19.9975, longitude: 73.7898 },
  Faridabad: { latitude: 28.4089, longitude: 77.3178 },
};

export const getCoordinatesForCity = (cityName: string) => {
  return cityCoordinates[cityName] || null;
};

