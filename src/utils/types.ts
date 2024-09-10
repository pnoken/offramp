interface EncryptedPrivateKey {
    encryptedPrivateKey: ArrayBuffer;
    iv: ArrayBuffer;
    salt: ArrayBuffer;
}

interface PortableDid {
    uri: string;
    document: {};
    keySet: {};
    metadata: {};
}

export type { EncryptedPrivateKey, PortableDid }