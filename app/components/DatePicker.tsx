'use client';
import { useFormikContext } from 'formik';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ErrorMessage } from 'formik';

type FormikDatePickerProps = {
  name: string;
  label: string;
};

// Define a proper type for form values instead of using any
type FormValues = Record<string, unknown>;

// Helper function to parse different date formats
const parseDate = (dateValue: string | null | undefined): Date | undefined => {
  if (!dateValue) return undefined;

  // Try different date formats
  const formats = [
    'yyyy-MM-dd', // ISO format from database
    'MM/dd/yyyy', // US format
    'dd/MM/yyyy', // European format
    'yyyy-MM-dd HH:mm:ss', // DateTime format
  ];

  for (const formatStr of formats) {
    try {
      const parsed = parse(dateValue, formatStr, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      // Continue to next format - removed unused error parameter
    }
  }

  // Try native Date parsing as fallback
  try {
    const nativeDate = new Date(dateValue);
    if (isValid(nativeDate)) {
      return nativeDate;
    }
  } catch {
    // Removed unused error parameter
    console.warn('Could not parse date:', dateValue);
  }

  return undefined;
};

export function DatePicker({ name, label }: FormikDatePickerProps) {
  const { setFieldValue, values } = useFormikContext<FormValues>();
  const rawValue = values[name];

  console.log(`DatePicker ${name} - Raw value:`, rawValue); // Debug log

  const parsedDate = parseDate(
    typeof rawValue === 'string' ? rawValue : undefined
  );
  console.log(`DatePicker ${name} - Parsed date:`, parsedDate); // Debug log

  return (
    <fieldset className='flex flex-col gap-1'>
      <label htmlFor={name} className='medium leading-6 text-neutral-900'>
        {label}
        <span className='text-secondary-700'> *</span>
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start border border-neutral-400 text-left font-normal text-black',
              !parsedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {parsedDate && isValid(parsedDate) ? (
              format(parsedDate, 'MM/dd/yyyy')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='min-w-[270px] border border-neutral-400 p-3'
          align='start'
        >
          <Calendar
            mode='single'
            selected={parsedDate}
            onSelect={(selectedDate) => {
              if (selectedDate && isValid(selectedDate)) {
                // Store in database-friendly format (YYYY-MM-DD)
                const formatted = format(selectedDate, 'yyyy-MM-dd');
                console.log(`DatePicker ${name} - Setting value:`, formatted); // Debug log
                setFieldValue(name, formatted);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <ErrorMessage
        name={name}
        component='div'
        className='text-sm text-red-500'
      />
    </fieldset>
  );
}

export default DatePicker;
