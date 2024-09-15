import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { getStoredCredential } from '@/utils/secure-storage';
import VerifiableCredentialsForm from '@/components/credentials/verifiable-credentials-form';

export const withCredentials = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const WithCredentials = (props: P) => {
        const [hasCredentials, setHasCredentials] = useState(false);
        const [isChecking, setIsChecking] = useState(true);
        const customerCredentials = useSelector((state: RootState) => state.wallet.customerCredentials);

        useEffect(() => {
            const checkCredentials = async () => {
                const storedCredentials = await getStoredCredential();
                setHasCredentials(storedCredentials !== null && storedCredentials.length > 0);
                setIsChecking(false);
            };
            checkCredentials();
        }, [customerCredentials]);

        if (isChecking) {
            return <div>Checking credentials...</div>;
        }

        if (!hasCredentials) {
            return <VerifiableCredentialsForm onComplete={() => setHasCredentials(true)} />;
        }

        return <WrappedComponent {...props} />;
    };

    WithCredentials.displayName = `WithCredentials(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithCredentials;
};