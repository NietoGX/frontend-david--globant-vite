import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter, useParams } from 'react-router-dom';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ProductsProvider } from '@/modules/products/infrastructure/products-provider';
import { CartProvider } from '@/modules/cart/infrastructure/cart-provider';
import { Ioc } from '@/modules/shared/infrastructure/core/Ioc';
import { IID } from '@/modules/shared/infrastructure/bootstrap/IID';
import { resetInitialize } from '@/modules/shared/infrastructure/bootstrap';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn()
    };
});

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

describe('ProductDetailPage E2E', () => {
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

    it('should load and display product details from API', async () => {
        const mockProduct = {
            id: '1',
            brand: 'Apple',
            model: 'iPhone 15 Pro',
            price: '1199',
            imgUrl: '/iphone15.jpg',
            cpu: 'A17 Pro',
            ram: '8GB',
            os: 'iOS 17',
            displayResolution: '2796x1290',
            battery: '3274mAh',
            primaryCamera: ['48MP'],
            secondaryCmera: ['12MP'],
            dimentions: '146.6 x 70.6 x 8.25 mm',
            weight: '187',
            options: {
                colors: [{ code: 1, name: 'Black' }],
                storages: [{ code: 1, name: '256GB' }]
            }
        };

        mockCacheManager.get.mockReturnValue(null);
        mockHttpClient.get.mockResolvedValue(mockProduct);

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Apple' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'iPhone 15 Pro' })).toBeInTheDocument();
        });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/product/1', expect.any(Object));
        expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should use cached product when available', async () => {
        const mockProduct = {
            id: '1',
            brand: 'Samsung',
            model: 'Galaxy S24',
            price: '899',
            imgUrl: '/galaxy.jpg',
            options: {
                colors: [],
                storages: []
            }
        };

        mockCacheManager.get.mockReturnValue(mockProduct);

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Samsung' })).toBeInTheDocument();
        });

        expect(mockHttpClient.get).not.toHaveBeenCalled();
        expect(mockCacheManager.get).toHaveBeenCalled();
    });

    it('should show loading state initially', () => {
        mockCacheManager.get.mockReturnValue(null);
        mockHttpClient.get.mockImplementation(() => new Promise(() => { }));

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show "Product Not Found" when API returns null', async () => {
        mockCacheManager.get.mockReturnValue(null);
        mockHttpClient.get.mockResolvedValue(null);

        render(
            <MemoryRouter initialEntries={['/product/999']}>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Product Not Found')).toBeInTheDocument();
        });
    });
});
