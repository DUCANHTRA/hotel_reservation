import React from 'react';

const DatePicker = ({ label, selectedDate, onChange, minDate }) => {
  return (
    <div>
      <label htmlFor={label} className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
        {label}
      </label>
      <input
        type="date"
        id={label}
        value={selectedDate}
        onChange={onChange}
        min={minDate}
        className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
      />
    </div>
  );
};

export default DatePicker;
