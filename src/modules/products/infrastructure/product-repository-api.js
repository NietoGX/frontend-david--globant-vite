import { HttpClient } from '@/modules/shared/infrastructure/http-client';
import { CacheManager } from '@/modules/shared/infrastructure/cache-manager';
import { ProductListDtoSchema, ProductDetailDtoSchema } from './product-dto';

const CACHE_KEY_PRODUCTS = 'products_list';
const CACHE_KEY_PRODUCT_DETAIL_PREFIX = 'product_detail_';
const ONE_HOUR = 3600;

export class ProductRepositoryApi {
    async getProducts() {
        const cached = CacheManager.get(CACHE_KEY_PRODUCTS);
        if (cached) return cached;

        const products = await HttpClient.get('/product', {
            schema: ProductListDtoSchema
        });

        CacheManager.set(CACHE_KEY_PRODUCTS, products, ONE_HOUR);
        return products;
    }

    async getProductDetail(id) {
        const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${id}`;
        const cached = CacheManager.get(cacheKey);
        if (cached) return cached;

        const product = await HttpClient.get(`/product/${id}`, {
            schema: ProductDetailDtoSchema
        });

        CacheManager.set(cacheKey, product, ONE_HOUR);
        return product;
    }
}
