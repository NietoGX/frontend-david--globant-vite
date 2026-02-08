import { describe, it, expect, vi } from 'vitest';
import { GetProductList } from './get-product-list.use-case';

describe('GetProductList Use Case', () => {
    const mockProducts = [
        {
            id: '1',
            brand: 'Acer',
            model: 'Iconia Talk S',
            price: '170',
            imgUrl: ''
        },
        {
            id: '2',
            brand: 'Samsung',
            model: 'Galaxy S21',
            price: '800',
            imgUrl: ''
        }
    ];

    const mockRepository = {
        getProducts: vi.fn().mockResolvedValue(mockProducts),
        getProductDetail: vi.fn()
    };

    it('should return products matching combined brand and model search', async () => {
        const useCase = new GetProductList(mockRepository);
        const result = await useCase.execute('acer iconia');

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should return empty if one word does not match', async () => {
        const useCase = new GetProductList(mockRepository);
        const result = await useCase.execute('acer galaxy');

        expect(result).toHaveLength(0);
    });
});
