import Redis from 'ioredis';

const TTL_DEFAULT = 60;

const redis = new Redis(process.env.REDIS_URL as string);

export const setValueToCache = async (key: string, value: string, expires = TTL_DEFAULT) =>
  redis.set(key, value, 'EX', expires);

export const removeValueFromCache = async (key: string) => redis.del(key);

export const getValueFromCache = async (key: string): Promise<string | null> =>
  redis.get(key) as unknown as string | null;

export const fetchCachedData = async <T>(key: string, callback: () => T, expires = TTL_DEFAULT) => {
  const cachedData = await getValueFromCache(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await callback();

  await setValueToCache(key, JSON.stringify(response), expires);

  return response;
};
