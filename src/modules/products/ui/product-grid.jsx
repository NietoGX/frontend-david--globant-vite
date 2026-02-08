import { ProductCard } from './product-card';

export function ProductGrid({ products }) {
    if (products.length === 0) {
        return (
            <div className="w-full text-center py-20 text-gray-500">
                No products found.
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((product) => (
                <li key={product.id}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}
