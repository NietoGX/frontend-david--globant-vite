import { createContext, useContext, useMemo } from 'react';
import { initialize } from '@/modules/shared/infrastructure/bootstrap';

const { productsFacade } = initialize();

export const ProductsContext = createContext(undefined);

export function ProductsProvider({ children }) {
    const value = useMemo(() => ({
        getProductList: async (search) => productsFacade.getProductList(search),
        getProductDetail: async (id) => productsFacade.getProductDetail(id),
    }), []);

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
