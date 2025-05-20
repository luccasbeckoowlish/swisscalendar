import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

const HolidayDisclaimer = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left"
        aria-expanded={open}
        aria-controls="holiday-disclaimer-content"
      >
        <Info className="w-5 h-5 text-blue-500" />
        <span className="font-semibold text-lg flex-1">Holiday Definitions</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-blue-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-500" />
        )}
      </button>

      <div
        id="holiday-disclaimer-content"
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-64 opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"
        }`}
      >
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>
            <strong>🎉 Workday Off:</strong> A public holiday that falls on a regular workday (e.g. Tuesday) — a day off that would normally be a working day.
          </li>
          <li>
            <strong>🔗 Bridge Day:</strong> A working day between a holiday and the weekend, often taken off to create a longer break.
          </li>
          <li>
            <strong>🌟 Long Weekend:</strong> A situation where the holiday creates an extended weekend (e.g. a holiday on Friday or Monday).
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HolidayDisclaimer;
