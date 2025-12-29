'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, capitalize } from '@/utils/calc';
import { formatearFecha } from '@/utils/seasons';

/**
 * Componente para mostrar el resumen de la cotización
 * @param {Object} props - Props del componente
 * @param {Object} props.result - Resultado del cálculo
 */
export default function SummaryCard({ result }) {
  if (!result) return null;

  const {
    nombreCliente,
    temporadaPredominante,
    fechaInicio,
    fechaSalida,
    noches,
    huespedes,
    diasPorTemporada,
    desglosePorTemporada,
    festivosEnRango,
    tarifaExtra,
    cleaningFee,
    costoBase,
    huespedesExtras,
    costoHuespedesExtras,
    subtotalAntesDescuento,
    descuento,
    tipoDescuento,
    montoDescuento,
    totalAlojamiento,
    totalFinal,
  } = result;
  
  // Para compatibilidad con el formato anterior
  const temporada = temporadaPredominante || result.temporada;
  const tarifaBase = result.tarifaBase;

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
        {nombreCliente && (
          <p className="text-lg text-primary-600 mt-2 font-semibold">
            {nombreCliente}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Apartamento en Santa Marta
        </p>
      </div>

      {/* Detalles de la reserva */}
      <div className="space-y-4 mb-6">
        {fechaInicio && fechaSalida && (
          <>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-semibold text-gray-900">
                {formatearFecha(fechaInicio)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-semibold text-gray-900">
                {formatearFecha(fechaSalida)}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Número de noches:</span>
          <span className="font-semibold text-gray-900">{noches}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Número de huéspedes:</span>
          <span className="font-semibold text-gray-900">{huespedes}</span>
        </div>
      </div>

      {/* Valor por noche */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Valor por noche:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(Math.round(costoBase / noches))}
            </span>
          </div>
          
          {descuento > 0 && (
            <>
              <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                <div className="flex flex-col">
                  <span className="text-green-700 font-medium">Valor por noche con descuento:</span>
                  <span className="text-xs text-green-600 mt-1">
                    Descuento {descuento}% aplicado · Ahorras {formatCurrency(Math.round(montoDescuento / noches))} por noche
                  </span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(Math.round((costoBase - montoDescuento) / noches))}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desglose por temporada (si hay múltiples) */}
      {desglosePorTemporada && Object.keys(desglosePorTemporada).length > 1 && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h3 className="text-sm font-semibold text-primary-800 mb-3">
            Desglose por temporada:
          </h3>
          <div className="space-y-2">
            {Object.entries(desglosePorTemporada).map(([tipo, data]) => (
              <div key={tipo} className="flex justify-between text-sm">
                <span className="text-primary-700 capitalize">
                  {tipo} ({data.dias} {data.dias === 1 ? 'noche' : 'noches'}):
                </span>
                <span className="font-semibold text-primary-800">
                  {formatCurrency(data.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desglose de costos */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Alojamiento ({noches} {noches === 1 ? 'noche' : 'noches'}):
          </span>
          <span className="text-gray-900">{formatCurrency(costoBase)}</span>
        </div>

        {huespedesExtras > 0 && costoHuespedesExtras > 0 && (
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

        {descuento > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">
              - Descuento {descuento}%:
            </span>
            <span className="text-green-700 font-semibold">
              -{formatCurrency(montoDescuento)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-600">+ Fee de limpieza:</span>
          <span className="text-gray-900">{formatCurrency(cleaningFee)}</span>
        </div>

        {/* Total Final */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-primary-500">
          <span className="text-xl font-bold text-gray-900">Total Final:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalFinal)}
          </span>
        </div>
      </div>

      {/* Aviso de descuento (si aplica) */}
      {descuento > 0 && (
        <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎉</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800 mb-2">
                ¡Excelente noticia!
              </h3>
              <p className="text-green-700 font-medium">
                Con el descuento del <span className="font-bold text-xl">{descuento}%</span> aplicado, 
                estás ahorrando <span className="font-bold text-xl">{formatCurrency(montoDescuento)}</span> en tu estancia.
              </p>
              {tipoDescuento && (
                <p className="text-sm text-green-600 mt-2">
                  Tipo de descuento: {tipoDescuento}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
