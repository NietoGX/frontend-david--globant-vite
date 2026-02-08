import { Link } from 'react-router-dom';

export function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`} className="block group h-full">
            <article className="bg-card text-card-foreground rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out border border-border p-6 flex flex-col items-center group-hover:-translate-y-1 h-full">
                <div className="relative w-full aspect-[4/5] mb-6 bg-secondary/50 rounded-lg overflow-hidden p-4">
                    {product.imgUrl ? (
                        <img
                            src={product.imgUrl}
                            alt={`${product.brand} ${product.model}`}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply dark:mix-blend-normal"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>

                <div className="text-center w-full mt-auto">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        {product.brand}
                    </h3>
                    <h2 className="text-lg font-bold text-card-foreground truncate mb-3 leading-tight">
                        {product.model}
                    </h2>
                    <span className="inline-block text-lg font-medium text-secondary-foreground bg-secondary px-3 py-1 rounded-full">
                        {product.price ? `${product.price} €` : 'N/A'}
                    </span>
                </div>
            </article>
        </Link>
    );
}
