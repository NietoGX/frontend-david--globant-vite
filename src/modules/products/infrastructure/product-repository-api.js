import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';
import { ProductListDtoSchema, ProductDetailDtoSchema } from './product-dto';
import { Product } from '../domain/product';
import { ProductDetail } from '../domain/product-detail';

const CACHE_KEY_PRODUCTS = 'products_list';
const CACHE_KEY_PRODUCT_DETAIL_PREFIX = 'product_detail_';
const ONE_HOUR = 3600;

export class ProductRepositoryApi {
    constructor(
        httpClient = inject(IID.httpClient),
        cacheManager = inject(IID.cacheManager)
    ) {
        this.httpClient = httpClient;
        this.cacheManager = cacheManager;
    }

    async getProducts() {
        const cached = this.cacheManager.get(CACHE_KEY_PRODUCTS);
        if (cached) return cached.map(p => new Product(p));

        const productsData = await this.httpClient.get('/product', {
            schema: ProductListDtoSchema
        });

        const products = productsData.map(p => new Product(p));

        this.cacheManager.set(CACHE_KEY_PRODUCTS, productsData, ONE_HOUR);
        return products;
    }

    async getProductDetail(id) {
        const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${id}`;
        const cached = this.cacheManager.get(cacheKey);
        if (cached) return new ProductDetail(cached);

        const productData = await this.httpClient.get(`/product/${id}`, {
            schema: ProductDetailDtoSchema
        });

        const product = new ProductDetail(productData);

        this.cacheManager.set(cacheKey, productData, ONE_HOUR);
        return product;
    }
}
