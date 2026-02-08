import { Ioc } from '../core/Ioc';

export const IID = {
    productRepository: 'productRepository',
    getProductListUseCase: 'getProductListUseCase',
    getProductDetailUseCase: 'getProductDetailUseCase',
    cartRepository: 'cartRepository',
    addToCartUseCase: 'addToCartUseCase',
};

export function inject(key) {
    return Ioc.instance.provideByKey(key);
}
