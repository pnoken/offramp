// Function to derive a key from the user's password
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Function to encrypt data
export async function encryptData(password: string, data: string): Promise<{ iv: Uint8Array, encryptedData: ArrayBuffer }> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const enc = new TextEncoder();
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(data)
    );
    return { iv, encryptedData };
}

// Function to decrypt data
export async function decryptData(password: string, iv: Uint8Array, encryptedData: ArrayBuffer): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Use the same salt for decryption
    const key = await deriveKey(password, salt);
    const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedData
    );
    const dec = new TextDecoder();
    return dec.decode(decryptedData);
}