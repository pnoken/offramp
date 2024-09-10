import React, { ChangeEventHandler } from 'react';

interface SwapInputProps {
    label: string;
    placeholder: string;
    value: string;
    currencies: Array<string>;
    selectValue: string;
    onReset: () => void;
    onCurrencyChange: ChangeEventHandler<HTMLSelectElement>
    onChange: ChangeEventHandler<HTMLInputElement>
    isReadOnly?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
    label,
    onCurrencyChange,
    selectValue,
    currencies,
    placeholder,
    onChange,
    value,
    onReset,
    isReadOnly = false
}) => (
    <div className="py-[12px] relative w-full min-h-fit bg-white/5 flex flex-col items-center rounded-2xl border border-white/5">
        <div className="px-[15px] flex items-center justify-between w-full font-medium py-[2px] text-gray-500">
            <div className="flex items-center gap-1.5">
                <span className="text-sm">{label}</span>
                {!isReadOnly && (
                    <button
                        className="scale-0 hover:bg-white1 rounded-full hover:scale-110 transition-all overflow-hidden duration-300 max-w-[28px] max-h-[28px] text-gray-500 hover:text-white"
                        aria-label="Reset values"
                        onClick={onReset}
                        style={{ maxWidth: '200px' }}
                    >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-base" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex items-center gap-1.5">
                <button
                    className="text-sm gap-1.5 flex items-center cursor-pointer text-gray-500 stroke-gray-500 hover:text-bgGreen1 hover:stroke-bgGreen1 transition-all duration-300"
                    aria-label="Wallet Balance"
                    style={{ maxWidth: '170px' }}
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-xs relative top-[1px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                    </svg>
                    0
                </button>
            </div>
        </div>
        <div className="flex items-center relative w-full top-1">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                readOnly={isReadOnly}
                className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 transition-all border-b placeholder-shown:border-blue-gray-200 text-sm pt-4 pb-1.5 border-blue-gray-200 focus:border-gray-900 px-[15px] border-none outline-none text-white"
                style={{ paddingTop: 0, fontSize: 28 }}
            />
            <select
                id="currency-from"
                value={selectValue}
                onChange={onCurrencyChange}
                className="bg-gray-600 mr-4 outline-none rounded flex gap-1.5"
            >
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    </div>
);