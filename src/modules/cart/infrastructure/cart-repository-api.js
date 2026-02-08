import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';
import { AddToCartResponseSchema } from './cart-dto';

export class CartRepositoryApi {
    constructor(httpClient = inject(IID.httpClient)) {
        this.httpClient = httpClient;
    }

    async addToCart(productId, colorCode, storageCode) {
        const response = await this.httpClient.post('/cart', {
            id: productId,
            colorCode,
            storageCode
        }, {
            schema: AddToCartResponseSchema
        });

        return response.count;
    }
}
