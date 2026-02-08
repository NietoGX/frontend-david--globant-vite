import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../infrastructure/products-provider';

export function useProductList() {
    const { getProductList } = useProducts();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;

    const searchTerm = searchParams.get('search') || undefined;

    useEffect(() => {
        setIsLoading(true);
        // Reset page when search changes
        setPage(1);
        getProductList(searchTerm)
            .then(setProducts)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [getProductList, searchTerm]);

    const visibleProducts = products.slice(0, page * PAGE_SIZE);
    const hasMore = visibleProducts.length < products.length;

    const loadMore = () => {
        setPage((prev) => prev + 1);
    };

    return {
        products: visibleProducts,
        isLoading,
        loadMore,
        hasMore,
        totalCount: products.length
    };
}
