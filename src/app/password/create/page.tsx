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
        //router.push('/account/privatekey/import');
        if (e.target.value !== password) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === confirmPassword) {
            handleStorePassword().then(() => router.push('/account/privatekey/import'));

        } else {
            setPasswordError("Passwords do not match");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-8 w-2/3 mx-auto mt-10">
            <form
                onSubmit={handleSubmit}
                className="text-white max-w-lg mx-auto w-full md:w-1/2"
            >
                <div className="bg-gray-800 mb-4 text-white p-8 rounded-lg">
                    <h3 className="text-lg font-semibold">Always choose a strong password!
                    </h3>
                    <p className="text-gray-600">
                        Recommended security practice
                    </p>
                </div>
                <div className="mb-4">


                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            placeholder="Enter Password"
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

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                            value={confirmPassword}
                            placeholder="Confirm Password"
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
                <p className="mb-4 text-gray-800 text-sm">
                    Passwords should be at least 8 characters in length, including letters and numbers
                </p>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Continue
                </button>
            </form>
            {/* Right Section - What is a private key? */}
            <div className="md:w-1/2 space-y-4">
                <div className="bg-gray-800 text-white p-8 rounded-lg">
                    <h3 className="text-lg font-semibold">Why do I need to enter a password?
                    </h3>
                    <p className="text-gray-600">
                        For your wallet protection, SubWallet locks your wallet after 15 minutes of inactivity. You will need this password to unlock it.
                    </p>
                </div>
                <div className="bg-gray-800 text-white p-8 rounded-lg">
                    <h3 className="text-lg font-semibold">Can I recover a password?
                    </h3>
                    <p className="text-gray-600">
                        The password is stored securely on your device. We will not be able to recover it for you, so make sure you remember it!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPasswordForm;
