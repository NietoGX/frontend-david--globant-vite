import { createContext, useContext, useMemo, useEffect } from 'react';
import { initialize } from '@/modules/shared/infrastructure/bootstrap';

export const ProductsContext = createContext(undefined);

export function ProductsProvider({ children }) {
    const facades = useMemo(() => initialize(), []);

    const value = useMemo(() => ({
        getProductList: async (search) => facades.productsFacade.getProductList(search),
        getProductDetail: async (id) => facades.productsFacade.getProductDetail(id),
    }), [facades]);

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
}
