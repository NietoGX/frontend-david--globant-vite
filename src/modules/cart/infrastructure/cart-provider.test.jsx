import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { CartProvider, useCart } from './cart-provider';

const { mockAddToCartFn } = vi.hoisted(() => ({
    mockAddToCartFn: vi.fn(),
}));

vi.mock('@/modules/shared/infrastructure/bootstrap', () => ({
    initialize: vi.fn(() => ({
        productsFacade: {
            getProductList: vi.fn(),
            getProductDetail: vi.fn(),
        },
        cartFacade: {
            addToCart: mockAddToCartFn,
        },
    })),
}));

const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key];
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

const TestComponent = ({ onAddToCart }) => {
    const { addToCart, cartCount } = useCart();

    React.useEffect(() => {
        if (onAddToCart) {
            onAddToCart();
        }
    }, [onAddToCart]);

    return (
        <div>
            <div data-testid="count">{cartCount}</div>
            <button onClick={() => addToCart({ id: '1', colorCode: 1, storageCode: 1 })}>
                Add
            </button>
        </div>
    );
};

describe('CartProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should initialize with count 0 by default', async () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });
    });

    it('should initialize with count from localStorage', async () => {
        localStorage.setItem('cartCount', '5');

        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('5');
        });
    });

    it('should update count and localStorage on addToCart', async () => {
        mockAddToCartFn.mockResolvedValue(3);

        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });

        const button = screen.getByText('Add');
        await act(async () => {
            button.click();
        });

        await waitFor(() => {
            expect(mockAddToCartFn).toHaveBeenCalled();
            expect(screen.getByTestId('count')).toHaveTextContent('3');
            expect(localStorage.getItem('cartCount')).toBe('3');
        });
    });
});
