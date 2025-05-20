import React from 'react';
import clsx from 'clsx';

interface WorkdaysCheckboxGroupProps {
  label?: string;
  weekdays: string[];
  selectedDays: string[];
  onToggle: (day: string) => void;
}

export const WorkdaysCheckboxGroup: React.FC<WorkdaysCheckboxGroupProps> = ({
  label = 'Work Days',
  weekdays,
  selectedDays,
  onToggle,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {weekdays.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(day)}
              className={clsx(
                'px-3 py-1 rounded-xl border text-sm transition-colors duration-200 cursor-pointer',
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              )}              
              aria-pressed={isSelected}
            >
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
