import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, useParams } from 'react-router-dom';
import { Ioc } from '@/modules/shared/infrastructure/core/Ioc';
import { IID } from '@/modules/shared/infrastructure/bootstrap/IID';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ProductsProvider } from '@/modules/products/infrastructure/products-provider';
import { CartProvider } from '@/modules/cart/infrastructure/cart-provider';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: '1' })),
    };
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

const mockProductDetail = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    price: '1199',
    imgUrl: 'http://example.com/iphone15.jpg',
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

describe('E2E: ProductDetailPage', () => {
    let mockHttpClient;
    let mockCacheManager;

    beforeEach(async () => {
        // Reset Ioc and initialize
        Ioc.instance.reset();
        const { resetInitialize } = await import('@/modules/shared/infrastructure/bootstrap');
        resetInitialize();

        mockHttpClient = {
            get: vi.fn(),
            post: vi.fn(),
        };

        mockCacheManager = {
            get: vi.fn(),
            set: vi.fn(),
            remove: vi.fn(),
        };

        // Register mocks before calling initialize()
        Ioc.instance.override({
            [IID.httpClient]: () => mockHttpClient,
            [IID.cacheManager]: () => mockCacheManager,
        });

        // Initialize will now use the mocked dependencies
        const { initialize } = await import('@/modules/shared/infrastructure/bootstrap');
        initialize();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should load and display product details from API', async () => {
        (mockCacheManager.get).mockReturnValue(null);
        (mockHttpClient.get).mockResolvedValue(mockProductDetail);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getAllByText('iPhone 15 Pro')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Apple').length).toBeGreaterThan(0);
        expect(screen.getAllByText('1199 €').length).toBeGreaterThan(0);

        expect(screen.getByText('A17 Pro')).toBeInTheDocument();
        expect(screen.getByText('8GB')).toBeInTheDocument();
        expect(screen.getByText('iOS 17')).toBeInTheDocument();

        expect(mockCacheManager.get).toHaveBeenCalledWith('product_detail_1');
        expect(mockHttpClient.get).toHaveBeenCalledWith('/product/1', expect.any(Object));
        expect(mockCacheManager.set).toHaveBeenCalledWith('product_detail_1', mockProductDetail, 3600);
    });

    it('should use cached product when available', async () => {
        (mockCacheManager.get).mockReturnValue(mockProductDetail);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getAllByText('iPhone 15 Pro')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Apple').length).toBeGreaterThan(0);

        expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should show loading state initially', () => {
        (mockCacheManager.get).mockReturnValue(null);
        (mockHttpClient.get).mockImplementation(() => new Promise(() => { }));

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show "Product Not Found" when API returns null', async () => {
        const { useParams } = await import('react-router-dom');
        useParams.mockReturnValue({ id: '999' });

        (mockCacheManager.get).mockReturnValue(null);
        (mockHttpClient.get).mockResolvedValue(null);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <CartProvider>
                        <ProductDetailPage />
                    </CartProvider>
                </ProductsProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Product Not Found')).toBeInTheDocument();
        });
    });
});
