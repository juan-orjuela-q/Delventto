'use client';

import React from 'react';

/**
 * Componente Input reutilizable
 * @param {Object} props - Props del componente
 * @param {string} props.label - Etiqueta del input
 * @param {string} props.type - Tipo de input (text, number, etc.)
 * @param {string|number} props.value - Valor del input
 * @param {Function} props.onChange - Callback cuando cambia el valor
 * @param {number} props.min - Valor mínimo (para type="number")
 * @param {number} props.max - Valor máximo (para type="number")
 * @param {number} props.step - Paso del input (para type="number")
 * @param {string} props.placeholder - Placeholder del input
 * @param {boolean} props.required - Si el campo es requerido
 * @param {string} props.className - Clases CSS adicionales
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
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
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
        {...props}
      />
    </div>
  );
}
