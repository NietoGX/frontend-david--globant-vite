import { useState, useEffect } from 'react';
import { useProducts } from '../../infrastructure/products-provider';
import { useCart } from '@/modules/cart/infrastructure/cart-provider';

export function useProductDetail(productId) {
    const { getProductDetail } = useProducts();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;

        setIsLoading(true);
        getProductDetail(productId)
            .then(setProduct)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [getProductDetail, productId]);

    const handleAddToCart = async (colorCode, storageCode) => {
        if (!product) return;
        try {
            await addToCart({
                id: product.id,
                colorCode,
                storageCode
            });
            alert('Product added to cart');
        } catch (error) {
            console.error('Failed to add to cart', error);
            alert('Failed to add to cart');
        }
    };

    return {
        product,
        isLoading,
        addToCart: handleAddToCart
    };
}
