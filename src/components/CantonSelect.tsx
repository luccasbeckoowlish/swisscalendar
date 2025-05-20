import React from 'react';

export const cantonMap = {
  AG: 'Aargau',
  BE: 'Bern',
  ZH: 'Zürich',
  LU: 'Luzern',
  GE: 'Genève',
  TI: 'Ticino',
  VD: 'Vaud',
};

export function CantonSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold">
        Canton
      </label>
      <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            padding: '0.3rem 0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            minWidth: '120px'
          }}
        >
          {Object.entries(cantonMap).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
    </div>
  );
}
