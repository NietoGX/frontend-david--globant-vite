import { useEffect, useState, useCallback } from 'react';

export function useIntersectionObserver({
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
} = {}) {
    const [entry, setEntry] = useState();
    const [node, setNode] = useState(null);

    const frozen = entry?.isIntersecting && freezeOnceVisible;

    const updateEntry = ([entry]) => {
        setEntry(entry);
    };

    useEffect(() => {
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || frozen || !node) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(updateEntry, observerParams);

        observer.observe(node);

        return () => observer.disconnect();
    }, [node, JSON.stringify(threshold), root, rootMargin, frozen]);

    const ref = useCallback((node) => {
        setNode(node);
    }, []);

    return [ref, !!entry?.isIntersecting];
}
