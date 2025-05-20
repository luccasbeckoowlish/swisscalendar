import React from 'react';

interface YearSelectProps {
  label?: string;
  year: number;
  onChange: (newYear: number) => void;
  range?: number;
  startYear?: number;
}

export const YearSelect: React.FC<YearSelectProps> = ({
  label = 'Year',
  year,
  onChange,
  range = 10,
  startYear = new Date().getFullYear(),
}) => {
  const years = Array.from({ length: range }, (_, i) => startYear + i);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <select
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-2 py-2 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors duration-200"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
