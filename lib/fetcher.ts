type FetchMethod = (
  url: string,
  options?: {
    body?: Record<string, unknown>;
    cache?: RequestCache;
    headers?: HeadersInit;
    responseType?: 'json' | 'stream' | 'text';
    signal?: AbortSignal;
  },
) => Promise<any>;

class Fetcher {
  get: FetchMethod = async (url, options) => {
    if (options?.responseType === 'json') {
      const res = await fetch(url);

      return await res.json();
    }

    if (options?.responseType === 'text') {
      const res = await fetch(url);

      return await res.text();
    }

    return fetch(url);
  };

  post: FetchMethod = async (url, options) => {
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(options?.body),
      cache: options?.cache,
      headers: options?.headers,
      signal: options?.signal,
    };

    if (options?.responseType === 'json') {
      const res = await fetch(url, fetchOptions);

      return await res.json();
    }

    return fetch(url, fetchOptions);
  };

  put: FetchMethod = async (url, options) => {
    const fetchOptions = {
      method: 'PUT',
      body: JSON.stringify(options?.body),
      headers: options?.headers,
      signal: options?.signal,
    };

    if (options?.responseType === 'json') {
      const res = await fetch(url, fetchOptions);

      return await res.json();
    }

    return fetch(url, fetchOptions);
  };

  patch: FetchMethod = async (url, options) => {
    const fetchOptions = {
      method: 'PATCH',
      body: JSON.stringify(options?.body),
      headers: options?.headers,
      signal: options?.signal,
    };

    if (options?.responseType === 'json') {
      const res = await fetch(url, fetchOptions);

      return await res.json();
    }

    return fetch(url, fetchOptions);
  };

  async delete(url: string) {
    return fetch(url, { method: 'DELETE' });
  }
}

export const fetcher = new Fetcher();
