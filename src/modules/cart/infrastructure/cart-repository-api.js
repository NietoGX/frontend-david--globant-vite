import { HttpClient } from '@/modules/shared/infrastructure/http-client';
import { AddToCartResponseSchema } from './cart-dto';

export class CartRepositoryApi {
    async addToCart(productId, colorCode, storageCode) {
        const response = await HttpClient.post('/cart', {
            id: productId,
            colorCode,
            storageCode
        }, {
            schema: AddToCartResponseSchema
        });

        return response.count;
    }
}
