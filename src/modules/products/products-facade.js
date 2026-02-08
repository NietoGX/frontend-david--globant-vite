import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';

export class ProductsFacade {
    constructor(
        getProductListUseCase = inject(IID.getProductListUseCase),
        getProductDetailUseCase = inject(IID.getProductDetailUseCase)
    ) {
        this.getProductListUseCase = getProductListUseCase;
        this.getProductDetailUseCase = getProductDetailUseCase;
    }

    async getProductList(search) {
        return this.getProductListUseCase.execute(search);
    }

    async getProductDetail(id) {
        return this.getProductDetailUseCase.execute(id);
    }
}
