import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useUrlState() {
    const [searchParams, setSearchParams] = useSearchParams();

    const setParams = useCallback(
        (updates) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            });
            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    return { searchParams, setParams };
}