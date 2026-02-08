import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomePage } from '@/pages/HomePage';

import * as useIntersectionObserverHook from '@/modules/shared/ui/hooks/use-intersection-observer';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useLocation: () => ({ pathname: '/' }),
    Link: ({ children, to }) => <a href={to}>{children}</a>
}));

const mockProducts = [
    {
        id: '1',
        brand: 'TestBrand',
        model: 'TestModel 1',
        price: '100',
        imgUrl: 'http://test.com/img1.jpg',
    },
    {
        id: '2',
        brand: 'TestBrand',
        model: 'TestModel 2',
        price: '200',
        imgUrl: 'http://test.com/img2.jpg',
    },
];

const mockLoadMore = vi.fn();

// Mock the product list hook with default values
const mockUseProductList = vi.fn(() => ({
    products: mockProducts,
    isLoading: false,
    loadMore: mockLoadMore,
    hasMore: true,
    totalCount: 100, // Total matches
}));

vi.mock('@/modules/products/ui/hooks/use-product-list', () => ({
    useProductList: () => mockUseProductList(),
}));


describe('HomePage UI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the visible title', async () => {
        render(<HomePage />);
        expect(await screen.findByText('Mobile Shop')).toBeInTheDocument();
    });

    it('should show result count in SearchBar', async () => {
        render(<HomePage />);
        expect(await screen.findByText('100')).toBeInTheDocument();
    });

    it('should render product cards for each product', async () => {
        render(<HomePage />);
        expect(await screen.findByText('TestModel 1')).toBeInTheDocument();
        expect(await screen.findByText('TestModel 2')).toBeInTheDocument();
    });

    it('should define a SearchBar input', async () => {
        render(<HomePage />);
        const input = await screen.findByPlaceholderText('Search for a brand or model...');
        expect(input).toBeInTheDocument();
    });

    it('should call loadMore when intersecting and hasMore is true', () => {
        // Mock IntersectionObserver to return [ref, true]
        vi.spyOn(useIntersectionObserverHook, 'useIntersectionObserver').mockReturnValue([vi.fn(), true]);

        render(<HomePage />);

        expect(mockLoadMore).toHaveBeenCalled();
    });

    it('should NOT call loadMore when NOT intersecting', () => {
        // Mock IntersectionObserver to return [ref, false]
        vi.spyOn(useIntersectionObserverHook, 'useIntersectionObserver').mockReturnValue([vi.fn(), false]);

        render(<HomePage />);

        expect(mockLoadMore).not.toHaveBeenCalled();
    });
});
