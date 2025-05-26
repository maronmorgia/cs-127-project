'use client';
import { useMemo, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls';
import '@schedule-x/theme-default/dist/index.css';
import {
  X,
  Clock,
  Calendar,
  UserRound,
  FileText,
  Edit3,
  Trash2,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

type Schedule = {
  id: number;
  facility_id: string;
  event: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  repeat_type: string;
  repeat_dates: string;
  faculty_in_charge: string;
  description: string;
  facilities?: {
    roomname: string;
    type: string;
  };
};

type Facility = {
  id: string;
  roomname: string;
  type: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  scheduleData: Schedule;
  calendarId: string;
};

type CalendarAppProps = {
  schedules: Schedule[];
  facilities: Facility[];
  onEditSchedule?: (schedule: Schedule) => void;
  onDeleteSchedule?: (scheduleId: number) => void;
};

// Helper function to get facility type color class
const getFacilityColorClass = (facilityType: string): string => {
  switch (facilityType?.toLowerCase()) {
    case 'classroom':
      return 'facility-classroom';
    case 'meeting':
      return 'facility-meeting';
    case 'laboratory':
      return 'facility-laboratory';
    default:
      return 'facility-default';
  }
};

// Helper function to get facility background color
const getFacilityBgColor = (facilityType: string): string => {
  switch (facilityType?.toLowerCase()) {
    case 'classroom':
      return 'bg-amber-600'; // #D97706
    case 'meeting':
      return 'bg-emerald-600'; // #059669
    case 'laboratory':
      return 'bg-slate-600'; // #475569
    default:
      return 'bg-gray-500';
  }
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
    >
      <div className='mx-4 w-full max-w-md'>
        <div className='rounded-xl bg-white p-6 shadow-2xl'>
          <header className='mb-4 flex items-center gap-3'>
            <AlertTriangle className='size-8 text-red-600' aria-hidden='true' />
            <div>
              <h2 id='modal-title' className='large text-neutral-800'>
                Delete Schedule
              </h2>
              <p id='modal-description' className='small text-red-600'>
                This action cannot be undone.
              </p>
            </div>
          </header>

          <section className='mb-6'>
            <p className='medium text-neutral-800'>
              Are you sure you want to delete{' '}
              <strong className='medium'>&quot;{eventTitle}&quot;</strong>? This
              will remove all related events from the calendar.
            </p>
          </section>

          <footer className='flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='medium cursor-pointer rounded-md border border-neutral-400 px-4 py-3 text-neutral-800 hover:bg-neutral-800 hover:text-white'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={onConfirm}
              className='medium cursor-pointe rounded-md border border-neutral-400 bg-red-600 px-4 py-3 text-white hover:bg-red-700'
            >
              Delete Schedule
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const EventModal = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  facilities,
  isAdminPath,
}: {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  facilities: Facility[];
  isAdminPath: boolean;
}) => {
  if (!isOpen || !event) return null;

  // Parse the description to extract details
  const descriptionParts = event.description.split('\n\n');
  const mainDescription = descriptionParts[0];
  const facultyLine = descriptionParts.find((part: string) =>
    part.startsWith('Faculty:')
  );

  const faculty = facultyLine ? facultyLine.replace('Faculty: ', '') : '';

  // Get facility info from the facilities array or schedule data
  const facility = facilities.find(
    (f) => f.id === event.scheduleData?.facility_id
  );
  const roomName =
    facility?.roomname ||
    event.scheduleData?.facilities?.roomname ||
    'Unknown Room';

  // Get facility type from schedule data or calendar ID
  const facilityType =
    facility?.type ||
    event.scheduleData?.facilities?.type ||
    event.calendarId?.replace('facility-', '') ||
    'default';

  const bgColorClass = getFacilityBgColor(facilityType);

  // Format time display
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const startTime = formatTime(event.start);
  const endTime = formatTime(event.end);

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/60'>
      <div className='relative'>
        {/* Card */}
        <div
          className={`${bgColorClass} w-80 overflow-hidden rounded-lg px-3 py-2 text-white shadow-xl`}
        >
          {/* Header */}
          <header className='flex items-center justify-between'>
            <h2 className='large'>{event.title}</h2>
            <div className='flex gap-2.5'>
              {isAdminPath && (
                <>
                  <button
                    onClick={onEdit}
                    aria-label='Edit schedule'
                    className='rounded'
                    title='Edit'
                  >
                    <Edit3 className='size-5 cursor-pointer text-white' />
                  </button>
                  <button
                    onClick={onDelete}
                    aria-label='Delete schedule'
                    className='rounded'
                    title='Delete'
                  >
                    <Trash2 className='size-5 cursor-pointer text-white' />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                aria-label='Close menu'
                className='rounded p-1.5'
                title='Close'
              >
                <X className='size-6 cursor-pointer text-white' />
              </button>
            </div>
          </header>

          {/* Content */}
          <div className='flex flex-col gap-1'>
            {/* Time */}
            <div className='flex items-center gap-2 p-0.5'>
              <Clock className='h-4 w-4 text-white' />
              <span className='small leading-5'>
                {startTime} - {endTime}
              </span>
            </div>

            {/* Event Type/Category */}
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-white'></Calendar>
              <span className='small leading-5 capitalize'>{facilityType}</span>
            </div>

            {/* Room Name */}
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-white'></MapPin>
              <span className='small leading-5'>Room {roomName}</span>
            </div>

            {/* Faculty */}
            {faculty && (
              <div className='flex items-center gap-2'>
                <UserRound className='h-4 w-4 text-white'></UserRound>
                <span className='small leading-5'>{faculty}</span>
              </div>
            )}

            {/* Description */}
            {mainDescription && (
              <div className='flex items-start gap-2'>
                <FileText className='h-4 w-4 text-white'></FileText>
                <span className='small leading-5 opacity-90'>
                  {mainDescription}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to format datetime for Schedule-X
const formatDateTimeForScheduleX = (date: string, time: string): string => {
  const cleanTime = time.length > 5 ? time.substring(0, 5) : time;
  return `${date} ${cleanTime}`;
};

// Helper function to get days array from repeat_dates string
const getDaysFromRepeatDates = (repeatDates: string): string[] => {
  const dayMappings: { [key: string]: string[] } = {
    Monday: ['Monday'],
    Tuesday: ['Tuesday'],
    Wednesday: ['Wednesday'],
    Thursday: ['Thursday'],
    Friday: ['Friday'],
    Saturday: ['Saturday'],
    Sunday: ['Sunday'],
    WF: ['Wednesday', 'Friday'],
    TTH: ['Tuesday', 'Thursday'],
    None: ['None'],
  };

  return dayMappings[repeatDates] || [];
};

// Helper function to get next occurrence of a day
const getNextOccurrence = (startDate: Date, targetDay: string): Date => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const targetDayIndex = days.indexOf(targetDay);
  const currentDayIndex = startDate.getDay();

  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }

  const nextDate = new Date(startDate);
  nextDate.setDate(startDate.getDate() + daysToAdd);
  return nextDate;
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate recurring events based on schedule
const generateRecurringEvents = (
  schedule: Schedule,
  facilities: Facility[]
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const startDate = new Date(schedule.date_start);
  const endDate = new Date(schedule.date_end);

  // Get facility info for display and color
  const facility = facilities.find((f) => f.id === schedule.facility_id);
  const facilityType = facility?.type || schedule.facilities?.type || 'default';

  // Format times with seconds
  const timeStart = formatDateTimeForScheduleX(
    schedule.date_start,
    schedule.time_start
  );
  const timeEnd = formatDateTimeForScheduleX(
    schedule.date_start,
    schedule.time_end
  );

  if (schedule.repeat_type === 'once') {
    events.push({
      id: `${schedule.id}`,
      title: schedule.event,
      start: timeStart,
      end: timeEnd,
      description: `${schedule.description}\n\nFaculty: ${schedule.faculty_in_charge}`,
      scheduleData: schedule, // Store original schedule data
      calendarId: getFacilityColorClass(facilityType), // Add calendar ID for styling
    });
  } else if (
    schedule.repeat_type === 'weekly' &&
    schedule.repeat_dates !== 'None'
  ) {
    // Weekly recurring events
    const daysToGenerate = getDaysFromRepeatDates(schedule.repeat_dates);

    daysToGenerate.forEach((targetDay) => {
      const currentDate = getNextOccurrence(startDate, targetDay);
      let eventCount = 0;

      // Generate events for each week until end date
      while (currentDate <= endDate && eventCount < 52) {
        const eventDate = formatDate(currentDate);

        events.push({
          id: `${schedule.id}-${eventDate}-${targetDay}`,
          title: schedule.event,
          start: formatDateTimeForScheduleX(eventDate, schedule.time_start),
          end: formatDateTimeForScheduleX(eventDate, schedule.time_end),
          description: `${schedule.description}\n\nFaculty: ${schedule.faculty_in_charge}`,
          scheduleData: schedule,
          calendarId: getFacilityColorClass(facilityType),
        });

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
        eventCount++;
      }
    });
  } else if (schedule.repeat_type === 'daily') {
    // Daily recurring events
    const currentDate = new Date(startDate);
    let eventCount = 0;

    while (currentDate <= endDate && eventCount < 365) {
      const eventDate = formatDate(currentDate);

      events.push({
        id: `${schedule.id}-${eventDate}-daily`,
        title: schedule.event,
        start: formatDateTimeForScheduleX(eventDate, schedule.time_start),
        end: formatDateTimeForScheduleX(eventDate, schedule.time_end),
        description: `${schedule.description}\n\nFaculty: ${schedule.faculty_in_charge}`,
        scheduleData: schedule,
        calendarId: getFacilityColorClass(facilityType),
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      eventCount++;
    }
  }

  return events;
};

export default function CalendarApp({
  schedules,
  facilities,
  onEditSchedule,
  onDeleteSchedule,
}: CalendarAppProps) {
  const pathname = usePathname();
  const isAdminPath = pathname.includes('/admin');

  const [isCalendarReady, setIsCalendarReady] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Create plugins
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const calendarControls = useMemo(() => createCalendarControlsPlugin(), []);

  // Generate events from schedules
  const events = useMemo(() => {
    console.log('Generating events from schedules:', schedules.length);

    if (!schedules || schedules.length === 0) {
      console.log('No schedules to process');
      return [];
    }

    const allEvents = schedules.flatMap((schedule) => {
      try {
        return generateRecurringEvents(schedule, facilities);
      } catch (error) {
        console.error(
          'Error generating events for schedule:',
          schedule.id,
          error
        );
        return [];
      }
    });

    console.log('Generated events:', allEvents.length);
    return allEvents;
  }, [schedules, facilities]);

  // Create calendar app with updated calendar colors and restrictions
  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events,
    plugins: [eventsService, calendarControls],
    defaultView: 'week',
    weekOptions: {
      gridHeight: 1200,
      nDays: 6,
    },
    dayBoundaries: {
      start: '07:00',
      end: '20:00',
    },
    firstDayOfWeek: 1,
    calendars: {
      'facility-classroom': {
        colorName: 'classroom',
        lightColors: {
          main: '#D97706',
          container: '#D97706',
          onContainer: '#ffffff',
        },
      },
      'facility-meeting': {
        colorName: 'meeting',
        lightColors: {
          main: '#059669',
          container: '#059669',
          onContainer: '#ffffff',
        },
      },
      'facility-laboratory': {
        colorName: 'laboratory',
        lightColors: {
          main: '#475569',
          container: '#475569',
          onContainer: '#ffffff',
        },
      },
      'facility-default': {
        colorName: 'default',
        lightColors: {
          main: '#6b7280',
          container: '#6b7280',
          onContainer: '#ffffff',
        },
      },
    },
    callbacks: {
      onEventClick: (calendarEvent) => {
        console.log('Event clicked:', calendarEvent);
        setSelectedEvent(calendarEvent as CalendarEvent);
        setIsModalOpen(true);
      },
    },
  });

  // Handle responsive view switching
  useEffect(() => {
    const handleResize = () => {
      if (calendarControls) {
        if (window.innerWidth < 760) {
          calendarControls.setView('month-agenda');
        } else {
          calendarControls.setView('week');
        }
      }
    };

    // Set initial view
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [calendarControls]);

  // Update events when schedules change
  useEffect(() => {
    if (eventsService && events) {
      console.log('Updating calendar events:', events.length);
      eventsService.set(events);
      setIsCalendarReady(true);
    }
  }, [events, eventsService]);

  const handleEditEvent = () => {
    if (selectedEvent?.scheduleData && onEditSchedule) {
      onEditSchedule(selectedEvent.scheduleData);
      setIsModalOpen(false);
    }
  };

  const handleDeleteEvent = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEvent?.scheduleData && onDeleteSchedule) {
      onDeleteSchedule(selectedEvent.scheduleData.id);
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // Show loading state
  if (!isCalendarReady && schedules.length > 0) {
    return (
      <div className='mt-8 flex h-96 items-center justify-center'>
        <div className='text-lg'>Loading calendar...</div>
      </div>
    );
  }

  return (
    <section className='mt-8'>
      {schedules.length === 0 ? (
        <article className='rounded-lg bg-gray-50 py-12 text-center'>
          <p className='text-lg text-gray-500'>No schedules found</p>
          <p className='mt-2 text-sm text-gray-400'>
            Create a schedule to see it on the calendar
          </p>
        </article>
      ) : (
        <section className='calendar-container overflow-hidden rounded-lg border shadow-sm'>
          <ScheduleXCalendar calendarApp={calendar} />
        </section>
      )}

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        facilities={facilities}
        isAdminPath={isAdminPath}
      />

      {isAdminPath && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          eventTitle={selectedEvent?.title || ''}
        />
      )}
    </section>
  );
}
