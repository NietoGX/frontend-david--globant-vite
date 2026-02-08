import { GetProductList } from '@/modules/products/application/get-product-list.use-case';
import { GetProductDetail } from '@/modules/products/application/get-product-detail.use-case';
import { ProductRepositoryApi } from '@/modules/products/infrastructure/product-repository-api';
import { ProductsFacade } from '@/modules/products/products-facade';
import { AddToCart } from '@/modules/cart/application/add-to-cart.use-case';
import { CartRepositoryApi } from '@/modules/cart/infrastructure/cart-repository-api';
import { CartFacade } from '@/modules/cart/cart-facade';
import { HttpClient } from '../http-client';
import { CacheManager } from '../cache-manager';
import { Ioc } from '../core/Ioc';
import { IID, inject } from './IID';

let isInitialized = false;
let facades = null;

export function initialize() {
    if (isInitialized && facades) return facades;

    Ioc.instance
        .singleton(IID.cacheManager, () => new CacheManager())
        .singleton(IID.httpClient, () => new HttpClient())
        .singleton(IID.productRepository, () => new ProductRepositoryApi())
        .singleton(IID.getProductListUseCase, () => new GetProductList(inject(IID.productRepository)))
        .singleton(IID.getProductDetailUseCase, () => new GetProductDetail(inject(IID.productRepository)))

        .singleton(IID.cartRepository, () => new CartRepositoryApi())
        .singleton(IID.addToCartUseCase, () => new AddToCart(inject(IID.cartRepository)));

    facades = {
        productsFacade: new ProductsFacade(),
        cartFacade: new CartFacade()
    };

    isInitialized = true;
    return facades;
}

export function resetInitialize() {
    isInitialized = false;
    facades = null;
}
