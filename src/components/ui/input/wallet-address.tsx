import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface WalletInputProps {
  label: string;
  placeholder: string;
  value: string;
  selectValue: string;
  onChange: (value: string) => void;
  isReadOnly?: boolean;
}

export const WalletInput: React.FC<WalletInputProps> = ({
  label,
  selectValue,
  placeholder,
  onChange,
  value,
  isReadOnly = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-4 sm:py-6 px-4 sm:px-6 relative w-full min-h-fit bg-white/10 flex flex-col items-center rounded-2xl border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between w-full font-medium mb-4 text-white/80">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold">{label}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center bg-white/20 text-white py-2 px-3 rounded-lg transition-colors duration-300 hover:bg-white/30 mb-2 sm:mb-0 sm:mr-3"
        >
          <Image
            src={`/images/currencies/${selectValue.toLowerCase()}.png`}
            alt={`${selectValue} logo`}
            width={20}
            height={20}
            className="rounded-full mr-2"
          />
          <span className="text-sm sm:text-base font-semibold">
            {selectValue}
          </span>
        </motion.button>
        <input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          readOnly={isReadOnly}
          className="flex-grow bg-transparent text-white outline-none text-sm sm:text-xl w-full sm:w-auto"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </motion.div>
  );
};
