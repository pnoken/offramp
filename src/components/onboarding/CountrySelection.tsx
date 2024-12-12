import React from "react";

const COUNTRIES = ["Uganda", "Nigeria", "Ghana", "Kenya"];

interface CountrySelectionProps {
  onCountrySelect: (country: string) => void;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({
  onCountrySelect,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Your Country</h2>
      <div className="grid grid-cols-2 gap-4">
        {COUNTRIES.map((country) => (
          <button
            key={country}
            onClick={() => onCountrySelect(country)}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountrySelection;
