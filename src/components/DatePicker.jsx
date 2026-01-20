import React from 'react';

const DatePicker = ({ label, selectedDate, onChange, minDate }) => {
  return (
    <div>
      <label htmlFor={label} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type="date"
        id={label}
        value={selectedDate}
        onChange={onChange}
        min={minDate}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default DatePicker;
