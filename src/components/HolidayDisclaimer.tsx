import React from "react";
import { Info } from "lucide-react"; // Optional: lucide-react icons

const HolidayDisclaimer = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-4 mb-4">
      <div className="flex items-start gap-2">
        <Info className="w-5 h-5 mt-1 text-blue-500" />
        <div className="text-start">
          <p className="font-semibold mb-4">Holiday Definitions:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
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
    </div>
  );
};

export default HolidayDisclaimer;
