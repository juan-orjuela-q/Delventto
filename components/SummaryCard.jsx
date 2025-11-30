'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, capitalize } from '@/utils/calc';

/**
 * Componente para mostrar el resumen de la cotización
 * @param {Object} props - Props del componente
 * @param {Object} props.result - Resultado del cálculo
 */
export default function SummaryCard({ result }) {
  if (!result) return null;

  const {
    temporada,
    noches,
    huespedes,
    tarifaBase,
    tarifaExtra,
    cleaningFee,
    costoBase,
    huespedesExtras,
    costoHuespedesExtras,
    totalAlojamiento,
    totalFinal,
  } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8"
      id="summary-card"
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Resumen de Cotización
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Apartamento en Santa Marta
        </p>
      </div>

      {/* Detalles de la reserva */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Temporada:</span>
          <span className="font-semibold text-gray-900 capitalize">
            {capitalize(temporada)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Número de noches:</span>
          <span className="font-semibold text-gray-900">{noches}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Número de huéspedes:</span>
          <span className="font-semibold text-gray-900">{huespedes}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Tarifa base por noche:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(tarifaBase)}
          </span>
        </div>
      </div>

      {/* Desglose de costos */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Alojamiento ({noches} {noches === 1 ? 'noche' : 'noches'}):
          </span>
          <span className="text-gray-900">{formatCurrency(costoBase)}</span>
        </div>

        {huespedesExtras > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Huésped adicional ({huespedesExtras} x {noches}{' '}
              {noches === 1 ? 'noche' : 'noches'} x {formatCurrency(tarifaExtra)}):
            </span>
            <span className="text-gray-900">
              {formatCurrency(costoHuespedesExtras)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-600">Fee de limpieza:</span>
          <span className="text-gray-900">{formatCurrency(cleaningFee)}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold text-gray-700">Total alojamiento:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(totalAlojamiento)}
          </span>
        </div>

        {/* Total Final */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-primary-500">
          <span className="text-xl font-bold text-gray-900">Total Final:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalFinal)}
          </span>
        </div>
      </div>

      {/* Nota adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Nota:</span> Esta es una cotización preliminar. 
          Los precios pueden variar según disponibilidad y condiciones especiales.
        </p>
      </div>
    </motion.div>
  );
}
