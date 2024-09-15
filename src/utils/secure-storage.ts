import localForage from 'localforage';
import { VerifiableCredential } from '@web5/credentials';

export const storeCredential = async (credential: VerifiableCredential[]): Promise<void> => {
    await localForage.setItem('userCredential', JSON.stringify(credential));
};

export const getStoredCredential = async (): Promise<VerifiableCredential[] | null> => {
    const stored = await localForage.getItem('userCredential');
    return stored ? JSON.parse(stored as string) : null;
};