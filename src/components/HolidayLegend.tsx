import React from 'react';

export default function HolidayLegend() {
  const items = [
    {
      label: 'Public holiday on a workday (Workday Off)',
      color: 'bg-emerald-400',
      emoji: '🎉',
    },
    {
      label: 'Bridge day (between holiday and weekend)',
      color: 'bg-yellow-400',
      emoji: '🔗',
    },
    {
      label: 'Long weekend',
      color: 'bg-blue-400',
      emoji: '🌟',
    },
    {
      label: 'Other public holiday',
      color: 'bg-gray-300',
      emoji: '',
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Legend</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map(({ label, color, emoji }) => (
          <div key={label} className="flex items-center space-x-2">
            <div className={`w-4 h-4 ${color} rounded-sm`} />
            <span className="text-sm">{emoji} {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
