import { DidDht, DidJwk } from '@web5/dids';

export const resolveDID = async (did: string) => {
    try {
        if (did.startsWith('did:dht:')) {
            const resolvedDid = await DidDht.resolve(did);
            return resolvedDid.didDocument;
        } else if (did.startsWith('did:jwk:')) {
            const resolvedDid = await DidJwk.resolve(did);
            return resolvedDid.didDocument;
        } else {
            throw new Error('Unsupported DID method');
        }
    } catch (error) {
        console.error('DID resolution failed:', error);
        return null;
    }
};