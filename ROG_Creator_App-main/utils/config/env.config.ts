import { z } from 'zod';
import { API_URL, API_KEY } from '@env';
const envSchema = z.object({
  API_URL: z.string().url(),
  API_KEY: z.string(),
});

const env = envSchema.parse({ API_URL, API_KEY });

export default env;
