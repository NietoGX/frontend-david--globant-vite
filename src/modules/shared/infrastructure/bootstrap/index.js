import { GetProductList } from '@/modules/products/application/get-product-list.use-case';
import { GetProductDetail } from '@/modules/products/application/get-product-detail.use-case';
import { ProductRepositoryApi } from '@/modules/products/infrastructure/product-repository-api';
import { ProductsFacade } from '@/modules/products/products-facade';
import { AddToCart } from '@/modules/cart/application/add-to-cart.use-case';
import { CartRepositoryApi } from '@/modules/cart/infrastructure/cart-repository-api';
import { CartFacade } from '@/modules/cart/cart-facade';
import { Ioc } from '../core/Ioc';
import { IID } from './IID';

let isInitialized = false;
let facades = null;

export function initialize() {
    if (isInitialized && facades) return facades;

    Ioc.instance
        .singleton(IID.productRepository, () => new ProductRepositoryApi())
        .singleton(IID.getProductListUseCase, () => new GetProductList())
        .singleton(IID.getProductDetailUseCase, () => new GetProductDetail())

        .singleton(IID.cartRepository, () => new CartRepositoryApi())
        .singleton(IID.addToCartUseCase, () => new AddToCart());

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
