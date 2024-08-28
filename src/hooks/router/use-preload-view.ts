import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface PreloadConfig {
    paths: string[];  // Array of paths to preload
    callback?: () => void;  // Optional callback after preload
}

export function usePreloadView(config: PreloadConfig) {
    const { paths, callback } = config;
    const router = useRouter();

    useEffect(() => {
        // Preload the specified paths
        paths.forEach((path) => {
            router.prefetch(path);
        });

        // Call the optional callback function
        if (callback) {
            callback();
        }
    }, [paths, callback, router]);
}
