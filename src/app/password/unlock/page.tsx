'use client'

import { decryptData } from "@/utils/password";
import { useState } from "react";

export default function Unlock() {
    const [password, setPassword] = useState<string>("");
    const [storedData, setStoredData] = useState<string | null>(null);

    const handleRetrievePassword = async () => {
        const ivString = localStorage.getItem("iv");
        const encryptedPasswordString = localStorage.getItem("fs-encryptedPassword");
        console.log("encryt", encryptedPasswordString);

        if (ivString && encryptedPasswordString) {
            const iv = new Uint8Array(JSON.parse(ivString));
            const encryptedPassword = new Uint8Array(JSON.parse(encryptedPasswordString));
            const decryptedPassword = await decryptData(password, iv, encryptedPassword.buffer);
            setStoredData(decryptedPassword);
        }
    };

    return (
        <div>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mb-4 p-2 border"
            />
            <button onClick={handleRetrievePassword} className="p-2 bg-green-500 text-white">
                Retrieve Password
            </button>
            {storedData && <p className="mt-4">Stored Data: {storedData}</p>}
        </div>
    );
}