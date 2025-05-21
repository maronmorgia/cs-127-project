'use client';

import { useState, useEffect } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';

type CustomTimePickerProps = {
  label: string;
  name: string;
};

export default function CustomTimePicker({ label, name }: CustomTimePickerProps) {
  const [hour, setHour] = useState<string>('12');
  const [minute, setMinute] = useState<string>('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const { setFieldValue } = useFormikContext<{ [key: string]: string }>();

  useEffect(() => {
    setFieldValue(name, `${hour}:${minute} ${period}`);
  }, [hour, minute, period, name, setFieldValue]);

  const handleHourChange = (value: string) => {
    const val = value.replace(/\D/g, '').slice(0, 2);
    const num = Math.min(12, Math.max(1, parseInt(val || '0', 10)));
    setHour(num.toString().padStart(2, '0'));
  };

  const handleMinuteChange = (value: string) => {
    const val = value.replace(/\D/g, '').slice(0, 2);
    const num = Math.min(59, Math.max(0, parseInt(val || '0', 10)));
    setMinute(num.toString().padStart(2, '0'));
  };

  return (
    <fieldset className="flex flex-col gap-1">
      <label htmlFor={name} className="medium leading-6 text-neutral-900">
        {label}
        <span className="text-secondary-700"> *</span>
      </label>

      <div className="flex items-center gap-3">
        {/* Hour input */}
        <input
          type="text"
          inputMode="numeric"
          value={hour}
          onChange={(e) => handleHourChange(e.target.value)}
          className="w-14 medium text-center text-neutral-900 border border-neutral-400 rounded-lg p-2 focus:outline-none"
        />

        <span className="medium text-neutral-800">:</span>

        {/* Minute input */}
        <input
          type="text"
          inputMode="numeric"
          value={minute}
          onChange={(e) => handleMinuteChange(e.target.value)}
          className="w-14 medium text-center text-neutral-900 border border-neutral-400 rounded-lg p-2 focus:outline-none"
        />

        {/* AM/PM Dropdown */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'AM' | 'PM')}
          className="medium text-neutral-900 border border-neutral-400 rounded-lg p-2.5 focus:outline-none"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      {/* Hidden Formik field */}
      <Field type="hidden" name={name} value={`${hour}:${minute} ${period}`} />
      <ErrorMessage name={name} component="div" className="text-sm text-red-500" />
    </fieldset>
  );
}
