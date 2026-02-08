import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';

export class GetProductDetail {
    constructor(repository = inject(IID.productRepository)) {
        this.repository = repository;
    }

    async execute(id) {
        return this.repository.getProductDetail(id);
    }
}
