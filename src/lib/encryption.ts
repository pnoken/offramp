import crypto from "crypto";

const algorithm = "aes-256-cbc";

// The `key` should ideally be stored securely (e.g., environment variables or a secrets manager)
const key = crypto.randomBytes(32); // Replace this with a securely stored and consistent key for decryption
const iv = crypto.randomBytes(16); // Replace this with the IV used during encryption (stored alongside the encrypted data)

// Encrypt function
export function encrypt(text: string): { encryptedData: string; iv: string } {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: iv.toString("hex") };
}

// Decrypt function
export function decrypt(encryptedData: string, ivHex: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
