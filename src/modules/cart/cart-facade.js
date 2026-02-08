import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';

export class CartFacade {
    constructor(
        addToCartUseCase = inject(IID.addToCartUseCase)
    ) {
        this.addToCartUseCase = addToCartUseCase;
    }

    async addToCart(item) {
        return this.addToCartUseCase.execute(item);
    }
}
