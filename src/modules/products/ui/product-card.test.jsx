import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from './product-card';


// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    Link: ({ children, to }) => <a href={to}>{children}</a>
}));

const mockProduct = {
    id: '1',
    brand: 'TestBrand',
    model: 'TestModel',
    price: '100',
    imgUrl: 'http://test.com/img.jpg',
};

describe('ProductCard', () => {
    it('should render product details', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('TestBrand')).toBeInTheDocument();
        expect(screen.getByText('TestModel')).toBeInTheDocument();
        expect(screen.getByText('100 €')).toBeInTheDocument();
    });

    it('should link to product detail page', () => {
        render(<ProductCard product={mockProduct} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/product/1');
    });

    it('should render "N/A" if price is missing', () => {
        const productWithoutPrice = { ...mockProduct, price: '' };
        render(<ProductCard product={productWithoutPrice} />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });
});
