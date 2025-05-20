import React, { useEffect, useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import HolidayDisclaimer from './HolidayDisclaimer';
import { WorkdaysCheckboxGroup } from './WorkdaysCheckboxGroup';
import { YearSelect } from './YearSelect';
import { CantonSelect } from './CantonSelect';
import HolidayLegend from './HolidayLegend';

const cantonMap = {
  AG: 'Aargau',
  BE: 'Bern',
  ZH: 'Zürich',
  LU: 'Luzern',
  GE: 'Genève',
  TI: 'Ticino',
  VD: 'Vaud',
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SwissHolidayTracker() {
  const currentYear = new Date().getFullYear();
  const [canton, setCanton] = useState('AG');
  const [year, setYear] = useState(currentYear);
  const [workdays, setWorkdays] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const renderEventContent = (eventInfo) => {
    return (
      <div
        className="whitespace-pre-wrap text-xs p-1 rounded-md text-black"
        style={{
          backgroundColor: eventInfo.event.backgroundColor,
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };
  
  // Load saved preferences
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('holidayPrefs'));
    console.log('prefs', prefs)
    if (prefs) {
      setCanton(prefs.canton);
      setYear(Number(prefs.year));
      setWorkdays(prefs.workdays);
    }
    setIsInitialized(true); 
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const prefs = { canton, year, workdays };
    localStorage.setItem('holidayPrefs', JSON.stringify(prefs));
  }, [canton, year, JSON.stringify(workdays)]); 

  const saveInLocalStorage = () => {
    if (!isInitialized) return;
    const prefs = { canton, year, workdays };
    localStorage.setItem('holidayPrefs', JSON.stringify(prefs));
    console.log(prefs)
  }


  const fetchAndRenderHolidays = useCallback(async () => {
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/CH`);
      const all = await res.json();
      const cantonCode = canton;
      console.log('cancon code', cantonCode)
      const filtered = all.filter(h => {
        // Inclui feriados nacionais (sem counties) ou específicos do cantão
        return !h.counties || h.counties.includes(`CH-${cantonCode}`);
      });
      console.log(filtered)
      const normalizedWorkdays = workdays.map(d => d.toLowerCase());
      const getWeekdayName = (date: Date) =>
        date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const isWorkday = (date: Date) =>
        normalizedWorkdays.includes(getWeekdayName(date));
  
      const holidayEvents = filtered.map(holiday => {
        const [year, month, day] = holiday.date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
        const weekday = getWeekdayName(dateObj);
        const holidayFallsOnWorkday = isWorkday(dateObj);

        let title = holiday.localName;
        let color = '#ccc';

        const prevDay = new Date(dateObj);
        prevDay.setDate(prevDay.getDate() - 1);
        const nextDay = new Date(dateObj);
        nextDay.setDate(nextDay.getDate() + 1);
        const dayBeforePrev = new Date(prevDay);
        dayBeforePrev.setDate(prevDay.getDate() - 1);
        const dayAfterNext = new Date(nextDay);
        dayAfterNext.setDate(nextDay.getDate() + 1);

        const isBridgeBefore = isWorkday(prevDay) && !isWorkday(dayBeforePrev);
        const isBridgeAfter = isWorkday(nextDay) && !isWorkday(dayAfterNext);
        const isBridgeDay = isBridgeBefore || isBridgeAfter;

        const isLongWeekend = (() => {
          if (weekday === 'friday' && !isWorkday(nextDay)) return true;
          if (weekday === 'monday' && !isWorkday(prevDay)) return true;
          if (weekday === 'thursday' && !isWorkday(nextDay)) return true;
          if (weekday === 'tuesday' && !isWorkday(prevDay)) return true;
          if (weekday === 'wednesday') {
            const thursday = new Date(dateObj);
            thursday.setDate(dateObj.getDate() + 1);
            const friday = new Date(dateObj);
            friday.setDate(dateObj.getDate() + 2);
            if (!isWorkday(thursday) && !isWorkday(friday)) return true;
          }
          return false;
        })();

        if (holidayFallsOnWorkday) {
          title += ' 🎉 (Workday Off)';
          color = '#31c48d';
        } else if (isLongWeekend) {
          title += ' 🌟 (Long Weekend)';
          color = '#60a5fa';
        } else if (isBridgeDay) {
          title += ' 🔗 (Bridge Day)';
          color = '#facc15';
        }

        return {
          title,
          start: holiday.date,
          allDay: true,
          backgroundColor: color,
          borderColor: color,
        };
      });
  
      setEvents(holidayEvents);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  }, [canton, year, workdays]);

  useEffect(() => {
    fetchAndRenderHolidays();
  }, [fetchAndRenderHolidays]);

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

  useEffect(() => {
    console.log('workdays', workdays)
    saveInLocalStorage()
  }, [workdays])

  return (
    <div className="max-w-5xl mx-auto my-8 p-4 font-sans">
      <h1 className="text-center mb-10 text-3xl font-semibold">
        Swiss Canton Holiday Tracker 🇨🇭
      </h1>
  
      <div className="controls mb-5 flex flex-wrap justify-between gap-4">
        <CantonSelect value={canton} onChange={setCanton} />
  
        <YearSelect year={year} onChange={setYear} />
  
        <WorkdaysCheckboxGroup 
          weekdays={weekdays}
          selectedDays={workdays}
          onToggle={toggleWorkday}
        />
      </div>
  
      <HolidayDisclaimer />
  
      <HolidayLegend />
  
      <div id="calendar" className="mt-4">
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
          eventContent={renderEventContent}
        />
      </div>
    </div>
  );
  
}
