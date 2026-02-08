import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { initialize } from '@/modules/shared/infrastructure/bootstrap';

const { cartFacade } = initialize();

export const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const savedCount = localStorage.getItem('cartCount');
        if (savedCount) {
            setCartCount(parseInt(savedCount, 10));
        }
    }, []);

    const addToCart = useCallback(async (item) => {
        const count = await cartFacade.addToCart(item);
        setCartCount(count);
        localStorage.setItem('cartCount', count.toString());
        return count;
    }, []);

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
