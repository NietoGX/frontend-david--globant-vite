import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Ioc } from '@/modules/shared/infrastructure/core/Ioc';
import { IID } from '@/modules/shared/infrastructure/bootstrap/IID';
import { HomePage } from '@/pages/HomePage';
import { ProductsProvider } from '@/modules/products/infrastructure/products-provider';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

const mockProducts = [
    {
        id: '1',
        brand: 'Apple',
        model: 'iPhone 15',
        price: '999',
        imgUrl: 'http://example.com/img1.jpg',
    },
    {
        id: '2',
        brand: 'Samsung',
        model: 'Galaxy S24',
        price: '899',
        imgUrl: 'http://example.com/img2.jpg',
    },
];

describe('E2E: HomePage', () => {
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

    it('should render page title and load products from API', async () => {
        (mockCacheManager.get).mockReturnValue(null);
        (mockHttpClient.get).mockResolvedValue(mockProducts);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <HomePage />
                </ProductsProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Mobile Shop')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        expect(screen.getByText('Samsung')).toBeInTheDocument();
        expect(screen.getByText('Galaxy S24')).toBeInTheDocument();

        expect(mockCacheManager.get).toHaveBeenCalledWith('products_list');
        expect(mockHttpClient.get).toHaveBeenCalledWith('/product', expect.any(Object));
        expect(mockCacheManager.set).toHaveBeenCalledWith('products_list', mockProducts, 3600);
    });

    it('should use cached products when available', async () => {
        (mockCacheManager.get).mockReturnValue(mockProducts);

        render(
            <BrowserRouter>
                <ProductsProvider>
                    <HomePage />
                </ProductsProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('iPhone 15')).toBeInTheDocument();

        expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should show loading state initially', () => {
        (mockCacheManager.get).mockReturnValue(null);
        (mockHttpClient.get).mockImplementation(() => new Promise(() => { }));

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
