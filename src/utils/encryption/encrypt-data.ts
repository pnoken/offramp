import CryptoJS from 'crypto-js';

export const encryptData = (data: string) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, 'secret_key', { iv: iv });
    return {
        encryptedPassword: encrypted.toString(),
        iv: iv.toString()
    };
};

export const decryptData = (encryptedData: string, iv: string) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, 'secret_key', { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
};