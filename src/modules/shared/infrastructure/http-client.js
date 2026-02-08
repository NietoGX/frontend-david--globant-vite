import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://itx-frontend-test.onrender.com/api';

export class HttpClient {
    static async get(path, options) {
        return HttpClient.request(path, { ...options, method: 'GET' });
    }

    static async post(path, body, options) {
        return HttpClient.request(path, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
    }

    static async request(path, options) {
        const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (options?.schema) {
                return options.schema.parse(data);
            }

            return data;
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation Error for', path, error.errors);
                throw new Error('Data validation failed');
            }
            throw error;
        }
    }
}
