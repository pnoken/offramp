import { VerifiableCredential } from '@web5/credentials';

export const verifyVC = async (vc: string): Promise<string> => {
    try {
        const result = await VerifiableCredential.verify({
            vcJwt: vc,
        });
        return result.issuer
    } catch (error) {
        console.error('Credential verification failed:', error);
        throw error; // Re-throw or return a default value
    }
};