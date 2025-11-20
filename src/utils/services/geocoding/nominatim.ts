// src/services/geocoding/nominatim.ts
export type CityResult = {
  id: string;
  name: string; // display name (city, state)
  city?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_REVERSE_ENDPOINT =
  'https://nominatim.openstreetmap.org/reverse';

let endpointStatus: 'healthy' | 'unhealthy' | 'unknown' = 'unknown';

export async function checkEndpointHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${NOMINATIM_ENDPOINT}?q=Mumbai&format=json&limit=1`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'ROG-Creator-App/1.0 (contact: support@reelongo.com)',
          Accept: 'application/json',
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (res.ok) {
      endpointStatus = 'healthy';
      return true;
    } else {
      endpointStatus = 'unhealthy';
      return false;
    }
  } catch (error) {
    console.warn('[checkEndpointHealth]', error);
    endpointStatus = 'unhealthy';
    return false;
  }
}

export function isEndpointHealthy(): boolean {
  return endpointStatus === 'healthy';
}

const INDIAN_CITIES_DB: Record<string, CityResult> = {
  mumbai: {
    id: 'mumbai-mh',
    name: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
  },
  delhi: {
    id: 'delhi-dl',
    name: 'Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
  },
  bengaluru: {
    id: 'bengaluru-ka',
    name: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  hyderabad: {
    id: 'hyderabad-tg',
    name: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.385,
    longitude: 78.4867,
  },
  pune: {
    id: 'pune-mh',
    name: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5204,
    longitude: 73.8567,
  },
  kolkata: {
    id: 'kolkata-wb',
    name: 'Kolkata, West Bengal',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
  },
  chennai: {
    id: 'chennai-tn',
    name: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  ahmedabad: {
    id: 'ahmedabad-gj',
    name: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    latitude: 23.0225,
    longitude: 72.5714,
  },
  jaipur: {
    id: 'jaipur-rj',
    name: 'Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    latitude: 26.9124,
    longitude: 75.7873,
  },
  surat: {
    id: 'surat-gj',
    name: 'Surat, Gujarat',
    city: 'Surat',
    state: 'Gujarat',
    country: 'India',
    latitude: 21.167,
    longitude: 72.8311,
  },
  lucknow: {
    id: 'lucknow-up',
    name: 'Lucknow, Uttar Pradesh',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 26.8467,
    longitude: 80.9462,
  },
  chandigarh: {
    id: 'chandigarh-ch',
    name: 'Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    country: 'India',
    latitude: 30.7333,
    longitude: 76.8277,
  },
  indore: {
    id: 'indore-mp',
    name: 'Indore, Madhya Pradesh',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    latitude: 22.7196,
    longitude: 75.8577,
  },
  nagpur: {
    id: 'nagpur-mh',
    name: 'Nagpur, Maharashtra',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    latitude: 21.1458,
    longitude: 79.0882,
  },
  gurgaon: {
    id: 'gurgaon-hr',
    name: 'Gurgaon, Haryana',
    city: 'Gurgaon',
    state: 'Haryana',
    country: 'India',
    latitude: 28.4595,
    longitude: 77.0266,
  },
  noida: {
    id: 'noida-up',
    name: 'Noida, Uttar Pradesh',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.5355,
    longitude: 77.391,
  },
};

function matchIndianCities(q: string): CityResult[] {
  const lowerQuery = q.toLowerCase().trim();
  if (!lowerQuery || lowerQuery.length < 2) return [];

  return Object.entries(INDIAN_CITIES_DB)
    .filter(([key]) => key.includes(lowerQuery))
    .map(([, city]) => city)
    .slice(0, 15);
}

export async function searchCitiesNominatim(
  q: string,
  signal?: AbortSignal,
): Promise<CityResult[]> {
  if (!q || q.trim().length < 2) return [];

  const localMatches = matchIndianCities(q);
  if (localMatches.length > 0) {
    return localMatches;
  }

  if (!isEndpointHealthy()) {
    console.warn(
      '[searchCitiesNominatim] Endpoint unhealthy, using fallback list',
    );
    return Object.values(INDIAN_CITIES_DB)
      .filter(
        city =>
          city.name.toLowerCase().includes(q.toLowerCase()) ||
          city.city?.toLowerCase().includes(q.toLowerCase()),
      )
      .slice(0, 15);
  }

  try {
    const params = new URLSearchParams({
      q: `${q}, India`,
      format: 'json',
      addressdetails: '1',
      limit: '15',
      countrycodes: 'in',
    });

    const res = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'ROG-Creator-App/1.0 (contact: support@reelongo.com)',
        Accept: 'application/json',
      },
      signal,
    });

    if (!res.ok) {
      throw new Error(`Nominatim HTTP ${res.status}`);
    }

    const data = (await res.json()) as any[];
    return data
      .filter(item => {
        const address = item.address || {};
        return address.country_code === 'in' || address.country === 'India';
      })
      .map(item => {
        const address = item.address || {};
        const cityLike =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.suburb ||
          address.county;

        return {
          id: String(item.place_id),
          name:
            cityLike && address.state
              ? `${cityLike}, ${address.state}`
              : item.display_name,
          city: cityLike,
          state: address.state,
          country: address.country,
          latitude: Number(item.lat),
          longitude: Number(item.lon),
        } as CityResult;
      })
      .slice(0, 15);
  } catch (error) {
    console.warn('[searchCitiesNominatim]', error);
    return Object.values(INDIAN_CITIES_DB)
      .filter(
        city =>
          city.name.toLowerCase().includes(q.toLowerCase()) ||
          city.city?.toLowerCase().includes(q.toLowerCase()),
      )
      .slice(0, 15);
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<CityResult | null> {
  try {
    const params = new URLSearchParams({
      format: 'json',
      lat: String(latitude),
      lon: String(longitude),
      addressdetails: '1',
      zoom: '10',
    });

    const res = await fetch(
      `${NOMINATIM_REVERSE_ENDPOINT}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'ROG-Creator-App/1.0 (contact: support@reelongo.com)',
          Accept: 'application/json',
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Reverse geocoding HTTP ${res.status}`);
    }

    const item = (await res.json()) as any;
    const address = item.address || {};

    const cityLike =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      address.county;

    if (cityLike) {
      return {
        id: String(item.place_id),
        name:
          address.state && cityLike
            ? `${cityLike}, ${address.state}`
            : cityLike,
        city: cityLike,
        state: address.state,
        country: address.country,
        latitude,
        longitude,
      } as CityResult;
    }

    return null;
  } catch (error) {
    console.warn('[reverseGeocode]', error);
    return null;
  }
}

