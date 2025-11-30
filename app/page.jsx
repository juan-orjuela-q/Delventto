'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Input from '@/components/Input';
import Select from '@/components/Select';
import SummaryCard from '@/components/SummaryCard';
import {
  calcularReserva,
  DEFAULT_RATES,
  DEFAULT_EXTRA_GUEST_FEE,
  DEFAULT_CLEANING_FEE,
} from '@/utils/calc';

export default function Home() {
  // Estados del formulario
  const [temporada, setTemporada] = useState('media');
  const [noches, setNoches] = useState('3');
  const [huespedes, setHuespedes] = useState('2');
  
  // Estados de tarifas configurables
  const [tarifaBase, setTarifaBase] = useState(DEFAULT_RATES.media.default);
  const [tarifaExtra, setTarifaExtra] = useState(DEFAULT_EXTRA_GUEST_FEE);
  const [cleaningFee, setCleaningFee] = useState(DEFAULT_CLEANING_FEE);
  
  // Estado del resultado
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Actualizar tarifa base cuando cambia la temporada
  const handleTemporadaChange = (value) => {
    setTemporada(value);
    setTarifaBase(DEFAULT_RATES[value].default);
  };

  // Obtener rangos de tarifa según temporada
  const tarifaRange = useMemo(() => {
    return DEFAULT_RATES[temporada];
  }, [temporada]);

  // Validar y calcular
  const handleCalcular = (e) => {
    e.preventDefault();
    setError('');

    try {
      const nochesNum = parseInt(noches);
      const huespedesNum = parseInt(huespedes);
      const tarifaBaseNum = parseFloat(tarifaBase);
      const tarifaExtraNum = parseFloat(tarifaExtra);
      const cleaningFeeNum = parseFloat(cleaningFee);

      // Validaciones
      if (nochesNum < 1) {
        setError('El número de noches debe ser al menos 1');
        return;
      }
      if (huespedesNum < 1 || huespedesNum > 5) {
        setError('El número de huéspedes debe estar entre 1 y 5');
        return;
      }
      if (tarifaBaseNum < tarifaRange.min || tarifaBaseNum > tarifaRange.max) {
        setError(
          `La tarifa base debe estar entre $${tarifaRange.min.toLocaleString()} y $${tarifaRange.max.toLocaleString()}`
        );
        return;
      }

      // Calcular
      const resultado = calcularReserva({
        temporada,
        noches: nochesNum,
        huespedes: huespedesNum,
        tarifaBase: tarifaBaseNum,
        tarifaExtra: tarifaExtraNum,
        cleaningFee: cleaningFeeNum,
      });

      setResult(resultado);
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Resetear formulario
  const handleReset = () => {
    setTemporada('media');
    setNoches('3');
    setHuespedes('2');
    setTarifaBase(DEFAULT_RATES.media.default);
    setTarifaExtra(DEFAULT_EXTRA_GUEST_FEE);
    setCleaningFee(DEFAULT_CLEANING_FEE);
    setResult(null);
    setShowResult(false);
    setError('');
  };

  // Exportar a PDF
  const handleExportPDF = async () => {
    if (!result) return;

    setIsExporting(true);
    try {
      const element = document.getElementById('summary-card');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`cotizacion-delventto-${Date.now()}.pdf`);
    } catch (err) {
      setError('Error al generar el PDF');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Exportar como JSON
  const handleExportJSON = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cotizacion-delventto-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Delventto
          </h1>
          <p className="text-lg text-gray-600">
            Calculadora de Tarifas - Apartamento en Santa Marta
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8"
        >
          <form onSubmit={handleCalcular} className="space-y-6">
            {/* Temporada */}
            <Select
              label="Temporada"
              value={temporada}
              onChange={handleTemporadaChange}
              options={[
                { value: 'baja', label: 'Temporada Baja' },
                { value: 'media', label: 'Temporada Media' },
                { value: 'alta', label: 'Temporada Alta' },
              ]}
              required
            />

            {/* Grid de inputs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Número de noches"
                type="number"
                value={noches}
                onChange={setNoches}
                min="1"
                placeholder="Ej: 3"
                required
              />

              <Input
                label="Número de huéspedes (máx. 5)"
                type="number"
                value={huespedes}
                onChange={setHuespedes}
                min="1"
                max="5"
                placeholder="Ej: 2"
                required
              />
            </div>

            {/* Configuración de tarifas */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Tarifas
              </h3>
              
              <div className="space-y-4">
                <Input
                  label={`Tarifa base por noche - Temporada ${temporada.charAt(0).toUpperCase() + temporada.slice(1)} ($${tarifaRange.min.toLocaleString()} - $${tarifaRange.max.toLocaleString()})`}
                  type="number"
                  value={tarifaBase}
                  onChange={setTarifaBase}
                  min={tarifaRange.min}
                  max={tarifaRange.max}
                  step="1000"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tarifa por huésped adicional (5°)"
                    type="number"
                    value={tarifaExtra}
                    onChange={setTarifaExtra}
                    min="0"
                    step="1000"
                    required
                  />

                  <Input
                    label="Fee de limpieza"
                    type="number"
                    value={cleaningFee}
                    onChange={setCleaningFee}
                    min="0"
                    step="1000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Calcular Cotización
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Resetear
              </button>
            </div>
          </form>
        </motion.div>

        {/* Resultado */}
        {showResult && result && (
          <>
            <SummaryCard result={result} />

            {/* Botones de exportación */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 max-w-2xl mx-auto"
            >
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Generando PDF...' : '📄 Exportar a PDF'}
              </button>
              <button
                onClick={handleExportJSON}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                💾 Exportar JSON
              </button>
            </motion.div>
          </>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>© 2025 Delventto - Apartamento en Santa Marta</p>
        </motion.div>
      </div>
    </main>
  );
}
