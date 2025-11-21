"use client";

import { useState } from "react";

interface FloatingInputProps {
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
}

export default function FloatingInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder,
  options,
  rows,
  min,
  max,
  step,
  className = ""
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== "" && value !== undefined && value !== null;

  const baseInputClasses = `
    w-full px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 
    border-2 border-gray-200 dark:border-gray-600 rounded-xl
    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
    transition-all duration-300 ease-in-out
    placeholder-transparent peer
    ${className}
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-300 ease-in-out pointer-events-none
    ${isFocused || hasValue 
      ? 'top-2 text-xs text-blue-500 dark:text-blue-400 font-medium' 
      : 'top-4 text-base text-gray-500 dark:text-gray-400'
    }
  `;

  if (type === "select" && options) {
    return (
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={baseInputClasses}
        >
          <option value="" disabled hidden></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className={labelClasses}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          rows={rows || 4}
          placeholder={placeholder || ""}
          className={`${baseInputClasses} resize-none`}
        />
        <label className={labelClasses}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder={placeholder || ""}
        min={min}
        max={max}
        step={step}
        className={baseInputClasses}
      />
      <label className={labelClasses}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}
