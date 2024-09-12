'use client'

import React, { useState, ChangeEvent, FormEvent } from "react";
import { encryptData } from "@/utils/password";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

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
        localStorage.setItem("iv", JSON.stringify(Array.from(iv)));
        localStorage.setItem("fs-encryptedPassword", JSON.stringify(Array.from(new Uint8Array(encryptedData))));
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === confirmPassword) {
            handleStorePassword().then(() => {
                const importType = localStorage.getItem('importType');
                if (importType === 'privateKey') {
                    router.push('/account/privatekey/import');
                } else if (importType === 'json') {
                    router.push('/account/restore-json');
                } else {
                    // Default fallback, you can change this as needed
                    router.push('/account/privatekey/import');
                }
                // Clear the importType from localStorage
                localStorage.removeItem('importType');
            });
        } else {
            setPasswordError("Passwords do not match");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl w-full space-y-8 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 bg-indigo-700 p-8 text-white">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-extrabold mb-6">Secure Your Wallet</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <ShieldCheckIcon className="h-6 w-6 text-indigo-300" />
                                    <p>Choose a strong, unique password</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <LockClosedIcon className="h-6 w-6 text-indigo-300" />
                                    <p>Your wallet locks after 15 minutes of inactivity</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="md:w-1/2 p-8">
                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={password}
                                        placeholder="Enter Password"
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={confirmPassword}
                                        placeholder="Confirm Password"
                                        onChange={handleConfirmPasswordChange}
                                        required
                                    />
                                </div>
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-600" id="password-error">
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create Password
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ConfirmPasswordForm;
