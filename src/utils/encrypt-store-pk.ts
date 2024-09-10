import { EncryptedPrivateKey } from "./types";

export const encryptPrivateKey = async (privateKey: string, passphrase: string): Promise<EncryptedPrivateKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    derivedKey,
    encoder.encode(privateKey)
  );

  return {
    encryptedPrivateKey: Array.from(new Uint8Array(encryptedData)),
    iv: Array.from(iv),
    salt: Array.from(salt)
  };
};

const storeEncryptedPrivateKey = async (privateKeyJwk: JsonWebKey, passphrase: string): Promise<void> => {
  const privateKey = JSON.stringify(privateKeyJwk);
  const { encryptedPrivateKey, iv, salt } = await encryptPrivateKey(privateKey, passphrase);

  // Store encrypted key, IV, and salt in localStorage
  localStorage.setItem("encryptedPrivateKey", JSON.stringify({
    encryptedPrivateKey,
    iv,
    salt
  }));
};
