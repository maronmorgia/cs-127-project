'use client';

import { useFormikContext } from 'formik';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
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

export function DatePicker({ name, label }: FormikDatePickerProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  const rawValue = values[name];
  const parsedDate = rawValue
    ? parse(rawValue, 'MM/dd/yyyy', new Date())
    : undefined;

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
            {parsedDate ? (
              format(parsedDate, 'MM/dd/yyyy')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='min-w-[270px]  p-3 border border-neutral-400' align='start'>
          <Calendar
            mode='single'
            selected={parsedDate}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                const formatted = format(selectedDate, 'MM/dd/yyyy');
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
