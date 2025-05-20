import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import HolidayDisclaimer from './HolidayDisclaimer';
import { WorkdaysCheckboxGroup } from './WorkdaysCheckboxGroup';
import { YearSelect } from './YearSelect';
const cantonMap = {
  AG: 'AG',
  BE: 'BE',
  ZH: 'ZH',
  LU: 'LU',
  GE: 'GE',
  TI: 'TI',
  VD: 'VD',
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SwissHolidayTracker() {
  const currentYear = new Date().getFullYear();
  const [canton, setCanton] = useState('AG');
  const [year, setYear] = useState(currentYear);
  const [workdays, setWorkdays] = useState(weekdays);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  // Load saved preferences
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('holidayPrefs'));
    if (prefs) {
      setCanton(prefs.canton);
      setYear(Number(prefs.year));
      setWorkdays(prefs.workdays);
    }
  }, []);

  // Save preferences on change
  useEffect(() => {
    const prefs = { canton, year, workdays };
    localStorage.setItem('holidayPrefs', JSON.stringify(prefs));
    fetchAndRenderHolidays();
  }, [canton, year, workdays]);

  const fetchAndRenderHolidays = async () => {
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/CH`);
      const all = await res.json();
      const cantonCode = cantonMap[canton];
      const filtered = all.filter(h => h.counties?.includes(`CH-${cantonCode}`) || !h.counties);

      const holidayEvents = filtered.map((holiday) => {
        const dateObj = new Date(holiday.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const isWorkday = workdays.includes(dayName);

        let title = holiday.localName;
        let color = '#ccc';

        if (isWorkday) {
          title += ' 🎉 (Workday Off)';
          color = '#31c48d';
        }

        const prevDay = new Date(dateObj);
        prevDay.setDate(dateObj.getDate() - 1);
        const nextDay = new Date(dateObj);
        nextDay.setDate(dateObj.getDate() + 1);
        const prevDayName = prevDay.toLocaleDateString('en-US', { weekday: 'long' });
        const nextDayName = nextDay.toLocaleDateString('en-US', { weekday: 'long' });

        const isBridgeBefore = !workdays.includes(prevDayName);
        const isBridgeAfter = !workdays.includes(nextDayName);
        const isLongWeekend =
          (dayName === 'Friday' && !workdays.includes('Saturday') && !workdays.includes('Sunday')) ||
          (dayName === 'Monday' && !workdays.includes('Sunday')) ||
          (dayName === 'Tuesday' && !workdays.includes('Monday')) ||
          (dayName === 'Thursday' && !workdays.includes('Friday'));

        if (isBridgeBefore || isBridgeAfter) {
          title += ' 🔗 (Bridge Day)';
          color = '#facc15';
        }
        if (isLongWeekend) {
          title += ' 🌟 (Long Weekend)';
          color = '#60a5fa';
        }

        return {
          title,
          start: holiday.date,
          allDay: true,
          backgroundColor: color,
          borderColor: color
        };
      });

      setEvents(holidayEvents);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(`${year}-01-01`);
    }
  }, [year]);  

  const toggleWorkday = (day) => {
    setWorkdays((prev) =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }} className="mb-10">Swiss Canton Holiday Tracker 🇨🇭</h1>

      <div className="controls mb-5" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div>
          <label>
            Canton:
            <select value={canton} onChange={(e) => setCanton(e.target.value)} style={{ marginLeft: '0.5rem' }}>
              {Object.keys(cantonMap).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </label>
        </div>

        <YearSelect year={year} onChange={setYear} />

        <WorkdaysCheckboxGroup 
          weekdays={weekdays}
          selectedDays={workdays}
          onToggle={toggleWorkday}
        />
      </div>

      <div id="calendar">
      <HolidayDisclaimer />
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          initialDate={`${year}-01-01`}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listYear'
          }}
          events={events}
        />
        
      </div>
    </div>
  );
}
