'use client';

import React from 'react';

/**
 * Componente DateInput para selección de fechas
 * @param {Object} props - Props del componente
 * @param {string} props.label - Etiqueta del input
 * @param {string} props.value - Valor de la fecha (YYYY-MM-DD)
 * @param {Function} props.onChange - Callback cuando cambia la fecha
 * @param {string} props.min - Fecha mínima permitida
 * @param {string} props.max - Fecha máxima permitida
 * @param {boolean} props.required - Si el campo es requerido
 * @param {string} props.className - Clases CSS adicionales
 */
export default function DateInput({
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-pointer"
        {...props}
      />
    </div>
  );
}
