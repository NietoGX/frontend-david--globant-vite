import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { ProductsProvider } from '@/modules/products/infrastructure/products-provider';
import { Ioc } from '@/modules/shared/infrastructure/core/Ioc';
import { IID } from '@/modules/shared/infrastructure/bootstrap/IID';
import { resetInitialize } from '@/modules/shared/infrastructure/bootstrap';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
};
global.localStorage = localStorageMock;

const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn()
};

const mockCacheManager = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
};

describe('HomePage E2E', () => {
    beforeEach(() => {
        resetInitialize();
        Ioc.instance.reset();

        Ioc.instance.override({
            [IID.httpClient]: () => mockHttpClient,
            [IID.cacheManager]: () => mockCacheManager
        });

        vi.clearAllMocks();
    });

    afterEach(() => {
        resetInitialize();
        Ioc.instance.reset();
    });

    it('should render page title and load products from API', async () => {
        const mockProducts = [
            { id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: '/img1.jpg' },
            { id: '2', brand: 'Samsung', model: 'Galaxy S24', price: '899', imgUrl: '/img2.jpg' }
        ];

        mockCacheManager.get.mockReturnValue(null);
        mockHttpClient.get.mockResolvedValue(mockProducts);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <HomePage />
                </ProductsProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Mobile Shop')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.getByText('iPhone 15')).toBeInTheDocument();
            expect(screen.getByText('Samsung')).toBeInTheDocument();
            expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
        });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/product', expect.any(Object));
        expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should use cached products when available', async () => {
        const mockProducts = [
            { id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: '/img1.jpg' }
        ];

        mockCacheManager.get.mockReturnValue(mockProducts);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <HomePage />
                </ProductsProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });

        expect(mockHttpClient.get).not.toHaveBeenCalled();
        expect(mockCacheManager.get).toHaveBeenCalled();
    });

    it('should show loading state initially', () => {
        mockCacheManager.get.mockReturnValue(null);
        mockHttpClient.get.mockImplementation(() => new Promise(() => { }));

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <HomePage />
                </ProductsProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
