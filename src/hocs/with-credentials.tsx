import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { loadStoredCredentials } from '@/lib/wallet-slice';
import VerifiableCredentialsForm from '@/components/credentials/verifiable-credentials-form';
import { useAppDispatch } from '@/hooks/use-app-dispatch';

export const withCredentials = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const WithCredentials = (props: P) => {
        const [isChecking, setIsChecking] = useState(true);
        const dispatch = useAppDispatch();
        const customerCredentials = useSelector((state: RootState) => state.wallet.customerCredentials);

        useEffect(() => {
            const loadCredentials = async () => {
                await dispatch(loadStoredCredentials());
            };
            loadCredentials();
        }, [dispatch]);

        useEffect(() => {
            if (customerCredentials !== undefined) {
                setIsChecking(false);
            }
        }, [customerCredentials]);

        if (isChecking) {
            return <div>Checking credentials...</div>;
        }

        if (customerCredentials.length === 0) {
            return <VerifiableCredentialsForm onComplete={() => dispatch(loadStoredCredentials())} />;
        }

        return <WrappedComponent {...props} />;
    };

    WithCredentials.displayName = `WithCredentials(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithCredentials;
};