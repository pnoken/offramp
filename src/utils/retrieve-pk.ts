import { EncryptedPrivateKey } from "./types";

export const decryptPrivateKey = async (encryptedPrivateKeyObj: EncryptedPrivateKey, passphrase: string): Promise<JsonWebKey> => {
    const { encryptedPrivateKey, iv, salt } = encryptedPrivateKeyObj;
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(passphrase),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new Uint8Array(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        derivedKey,
        new Uint8Array(encryptedPrivateKey)
    );

    return JSON.parse(new TextDecoder().decode(decryptedData)) as JsonWebKey;
};

const retrievePrivateKey = async (passphrase: string): Promise<JsonWebKey | null> => {
    const encryptedPrivateKeyObjJson = localStorage.getItem("encryptedPrivateKey");
    if (!encryptedPrivateKeyObjJson) throw new Error("No encrypted private key found");

    const encryptedPrivateKeyObj: EncryptedPrivateKey = JSON.parse(encryptedPrivateKeyObjJson);
    const privateKeyJwk = await decryptPrivateKey(encryptedPrivateKeyObj, passphrase);
    return privateKeyJwk;
};
