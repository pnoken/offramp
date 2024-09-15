import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Spinner from '@/components/spinner';

export const withCustomerDid = (WrappedComponent: React.ComponentType) => {
    const WithCustomerDid = (props: any) => {
        const router = useRouter();
        const [customerDid, setCustomerDid] = useLocalStorage('customerDid', null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            if (customerDid) {
                router.push("/home");
            } else {
                setIsLoading(false);
            }
        }, [router, customerDid]);

        if (isLoading) {
            return <Spinner />
        }

        return <WrappedComponent {...props} />;
    };

    WithCustomerDid.displayName = `WithCustomerDid(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithCustomerDid;
};