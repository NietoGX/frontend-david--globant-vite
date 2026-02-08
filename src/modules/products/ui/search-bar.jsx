import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

export function SearchBar({ resultCount }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [term, setTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const currentSearch = searchParams.get('search') || '';
            if (currentSearch === term) return;

            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('search', term);
            } else {
                params.delete('search');
            }
            navigate(`${pathname}?${params.toString()}`, { replace: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [term, navigate, pathname, searchParams]);

    return (
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4" role="search">
            <div className="relative w-full md:w-80 group">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Search for a brand or model..."
                    aria-label="Search products"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background shadow-sm focus:ring-1 focus:ring-primary transition-all outline-none text-sm placeholder:text-muted-foreground"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Found <span className="text-foreground font-bold">{resultCount}</span> devices
            </div>
        </div>
    );
}
