import Config from '../config/env.config';

// const API_KEY = Config.API_KEY;
// const CORRELATION_ID = 'APP-CORRELATION-ID';

/**
 * Makes an API request to the backend
 * @param endpoint API endpoint
 * @param options Request options
 * @returns Promise with API response
 * @throws Error if request fails
 */
export async function makeApiRequest<T, B = Record<string, unknown>>(
  endpoint: string,
  options: {
    method: string;
    body?: B;
    params?: Record<string, string>;
    pathParams?: Record<string, string>;
    headers?: Record<string, string>;
  },
): Promise<T> {
  const { method, body, params, pathParams, headers = {} } = options;

  // Replace path parameters if any
  let url = endpoint;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  // Append query parameters if any
  let fullUrl = `${Config.API_URL}${url}`;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    if (queryParams.toString()) {
      fullUrl += `?${queryParams.toString()}`;
    }
  }

  // Request logs
  console.group('request logs');
  console.log('req sent to', fullUrl);
  console.log('method', method);
  console.log('params', params);
  console.log('body', JSON.stringify(body));
  console.groupEnd();
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'x-api-key': API_KEY,
        // 'x-correlation-id': CORRELATION_ID,
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.log('error', data.message);
      throw new Error(data.message);
    }
    console.log('data', data);

    console.group('response logs');
    console.log('response data', data);
    console.log('response status', response.status);
    console.groupEnd();

    return data;
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error;
  }
}
