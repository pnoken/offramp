'use client'

import React, { useState, ChangeEvent, FormEvent } from "react";
import { encryptData } from "@/utils/password";
import { useRouter } from "next/navigation";

const ConfirmPasswordForm: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleStorePassword = async () => {
        const { iv, encryptedData } = await encryptData(password, password);
        // Store encrypted data and IV in localStorage or IndexedDB
        localStorage.setItem("iv", JSON.stringify(Array.from(iv)));
        localStorage.setItem("fs-encryptedPassword", JSON.stringify(Array.from(new Uint8Array(encryptedData))));
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        router.push('/account/privatekey/import');
        if (e.target.value !== password) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === confirmPassword) {
            alert("Passwords match! Form submitted.");
            handleStorePassword();
        } else {
            setPasswordError("Passwords do not match");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg mx-auto w-full lg:w-1/2 mt-10"
        >
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-300 font-bold mb-2">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-300 font-bold mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {passwordError && (
                    <p className="text-red-500 text-xs italic">{passwordError}</p>
                )}
            </div>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
                Submit
            </button>
        </form>
    );
};

export default ConfirmPasswordForm;
