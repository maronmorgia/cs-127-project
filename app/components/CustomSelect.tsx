// CustomSelect.tsx
'use client';

import { useField, useFormikContext } from 'formik';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  name: string;
  options: Option[];
  placeholder?: string;
}

export function CustomSelect({ name, options, placeholder }: CustomSelectProps) {
  const [field, , helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <Select value={field.value} onValueChange={setValue}>
      <SelectTrigger className='w-full rounded border border-neutral-400 p-2 text-neutral-900 medium '>
        <SelectValue placeholder={placeholder || 'Select'} />
      </SelectTrigger>
      <SelectContent className='border border-neutral-400'>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer medium">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
