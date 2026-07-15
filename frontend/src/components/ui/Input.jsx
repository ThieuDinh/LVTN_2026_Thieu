import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all duration-200 outline-none
          bg-white dark:bg-zinc-900 
          text-zinc-950 dark:text-white
          border-zinc-200 dark:border-zinc-800
          focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
          disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-950
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-0.5">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-xs text-zinc-500 mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
