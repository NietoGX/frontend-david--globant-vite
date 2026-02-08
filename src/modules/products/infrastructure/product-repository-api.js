import { HttpClient } from '@/modules/shared/infrastructure/http-client';
import { CacheManager } from '@/modules/shared/infrastructure/cache-manager';
import { ProductListDtoSchema, ProductDetailDtoSchema } from './product-dto';
import { Product } from '../domain/product';
import { ProductDetail } from '../domain/product-detail';

const CACHE_KEY_PRODUCTS = 'products_list';
const CACHE_KEY_PRODUCT_DETAIL_PREFIX = 'product_detail_';
const ONE_HOUR = 3600;

export class ProductRepositoryApi {
    async getProducts() {
        const cached = CacheManager.get(CACHE_KEY_PRODUCTS);
        if (cached) return cached.map(p => new Product(p));

        const productsData = await HttpClient.get('/product', {
            schema: ProductListDtoSchema
        });

        const products = productsData.map(p => new Product(p));

        CacheManager.set(CACHE_KEY_PRODUCTS, productsData, ONE_HOUR);
        return products;
    }

    async getProductDetail(id) {
        const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${id}`;
        const cached = CacheManager.get(cacheKey);
        if (cached) return new ProductDetail(cached);

        const productData = await HttpClient.get(`/product/${id}`, {
            schema: ProductDetailDtoSchema
        });

        const product = new ProductDetail(productData);

        CacheManager.set(cacheKey, productData, ONE_HOUR);
        return product;
    }
}
