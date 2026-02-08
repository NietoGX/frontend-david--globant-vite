import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';

export class AddToCart {
    constructor(cartRepository = inject(IID.cartRepository)) {
        this.cartRepository = cartRepository;
    }

    async execute(item) {
        const newCount = await this.cartRepository.addToCart(item.id, item.colorCode, item.storageCode);
        return newCount;
    }
}
