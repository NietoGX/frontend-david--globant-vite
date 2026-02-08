import { inject, IID } from '@/modules/shared/infrastructure/bootstrap/IID';

export class GetProductList {
    constructor(repository = inject(IID.productRepository)) {
        this.repository = repository;
    }

    async execute(searchTerm) {
        const products = await this.repository.getProducts();

        if (!searchTerm) {
            return products;
        }

        const terms = searchTerm.toLowerCase().split(' ').filter(t => t.length > 0);

        return products.filter(product => {
            const productText = `${product.brand} ${product.model}`.toLowerCase();
            return terms.every(term => productText.includes(term));
        });
    }
}
