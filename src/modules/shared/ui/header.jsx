import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/modules/cart/infrastructure/cart-provider';
import { useState, useEffect } from 'react';

export function Header() {
    const { cartCount } = useCart();
    const count = cartCount;
    const [mounted, setMounted] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-xl font-bold tracking-tight text-foreground group flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center rounded-lg">P</span>
                        <span>Phone<span className="text-muted-foreground font-light">Store</span></span>
                    </Link>

                    {/* Breadcrumbs - Simple implementation based on route */}
                    <nav className="hidden md:flex items-center text-sm text-muted-foreground font-medium" aria-label="Breadcrumb">
                        <Link to="/" className="hover:text-foreground transition-colors duration-200">Home</Link>
                        {pathname?.includes('/product/') && (
                            <>
                                <span className="mx-3 text-muted-foreground/50" aria-hidden="true">/</span>
                                <span className="text-foreground" aria-current="page">Product</span>
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <button className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200 relative" aria-label="Shopping Cart">
                            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                            {mounted && count > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300 ring-2 ring-background">
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
