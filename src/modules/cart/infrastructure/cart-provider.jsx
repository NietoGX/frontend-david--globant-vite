import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { initialize } from '@/modules/shared/infrastructure/bootstrap';

export const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const facades = useMemo(() => initialize(), []);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const savedCount = localStorage.getItem('cartCount');
        if (savedCount) {
            setCartCount(parseInt(savedCount, 10));
        }
    }, []);

    const addToCart = useCallback(async (item) => {
        const count = await facades.cartFacade.addToCart(item);
        setCartCount(count);
        localStorage.setItem('cartCount', count.toString());
        return count;
    }, [facades]);

    const value = useMemo(() => ({
        cartCount,
        addToCart,
    }), [cartCount, addToCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
