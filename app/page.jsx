'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Input from '@/components/Input';
import DateInput from '@/components/DateInput';
import SummaryCard from '@/components/SummaryCard';
import {
  DEFAULT_RATES,
  DEFAULT_EXTRA_GUEST_FEE,
  DEFAULT_CLEANING_FEE,
  formatNumber,
} from '@/utils/calc';
import {
  calcularReservaConFechas,
  obtenerFechaMinima,
  obtenerFechaMaxima,
  determinarTemporada,
} from '@/utils/seasons';

export default function Home() {
  // Estados del formulario - Fechas
  const [nombreCliente, setNombreCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [huespedes, setHuespedes] = useState('2');
  
  // Estados de tarifas configurables por temporada
  const [tarifaAlta, setTarifaAlta] = useState(DEFAULT_RATES.alta.default);
  const [tarifaMedia, setTarifaMedia] = useState(DEFAULT_RATES.media.default);
  const [tarifaBaja, setTarifaBaja] = useState(DEFAULT_RATES.baja.default);
  const [tarifaExtra, setTarifaExtra] = useState(DEFAULT_EXTRA_GUEST_FEE);
  const [cleaningFee, setCleaningFee] = useState(DEFAULT_CLEANING_FEE);
  const [descuento, setDescuento] = useState('0');
  const [tipoDescuento, setTipoDescuento] = useState('');
  
  // Estado del resultado y vista previa
  const [infoTemporada, setInfoTemporada] = useState(null);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Fechas mínima y máxima permitidas
  const fechaMinima = obtenerFechaMinima();
  const fechaMaxima = obtenerFechaMaxima();

  // Actualizar información de temporada cuando cambian las fechas
  useEffect(() => {
    if (fechaInicio && fechaSalida) {
      try {
        const info = determinarTemporada(fechaInicio, fechaSalida);
        setInfoTemporada(info);
        setError('');
      } catch (err) {
        setInfoTemporada(null);
        setError(err.message);
      }
    } else {
      setInfoTemporada(null);
    }
  }, [fechaInicio, fechaSalida]);

  // Validar y calcular
  const handleCalcular = (e) => {
    e.preventDefault();
    setError('');

    try {
      const huespedesNum = parseInt(huespedes);
      const tarifaAltaNum = parseFloat(tarifaAlta);
      const tarifaMediaNum = parseFloat(tarifaMedia);
      const tarifaBajaNum = parseFloat(tarifaBaja);
      const tarifaExtraNum = huespedesNum === 5 ? parseFloat(tarifaExtra) : 0;
      const cleaningFeeNum = parseFloat(cleaningFee);
      const descuentoNum = parseFloat(descuento) || 0;

      // Validaciones
      if (!fechaInicio || !fechaSalida) {
        setError('Debe seleccionar las fechas de ingreso y salida');
        return;
      }
      if (huespedesNum < 1 || huespedesNum > 5) {
        setError('El número de huéspedes debe estar entre 1 y 5');
        return;
      }

      // Validar rangos de tarifas
      if (tarifaAltaNum < DEFAULT_RATES.alta.min || tarifaAltaNum > DEFAULT_RATES.alta.max) {
        setError(`La tarifa alta debe estar entre $${formatNumber(DEFAULT_RATES.alta.min)} y $${formatNumber(DEFAULT_RATES.alta.max)}`);
        return;
      }
      if (tarifaMediaNum < DEFAULT_RATES.media.min || tarifaMediaNum > DEFAULT_RATES.media.max) {
        setError(`La tarifa media debe estar entre $${formatNumber(DEFAULT_RATES.media.min)} y $${formatNumber(DEFAULT_RATES.media.max)}`);
        return;
      }
      if (tarifaBajaNum < DEFAULT_RATES.baja.min || tarifaBajaNum > DEFAULT_RATES.baja.max) {
        setError(`La tarifa baja debe estar entre $${formatNumber(DEFAULT_RATES.baja.min)} y $${formatNumber(DEFAULT_RATES.baja.max)}`);
        return;
      }

      // Calcular con el nuevo sistema de fechas
      const resultado = calcularReservaConFechas({
        nombreCliente,
        fechaInicio,
        fechaSalida,
        huespedes: huespedesNum,
        tarifas: {
          alta: tarifaAltaNum,
          media: tarifaMediaNum,
          baja: tarifaBajaNum,
        },
        tarifaExtra: tarifaExtraNum,
        cleaningFee: cleaningFeeNum,
        descuento: descuentoNum,
        tipoDescuento: tipoDescuento,
      });

      setResult(resultado);
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Resetear formulario
  const handleReset = () => {
    setNombreCliente('');
    setFechaInicio('');
    setFechaSalida('');
    setHuespedes('2');
    setTarifaAlta(DEFAULT_RATES.alta.default);
    setTarifaMedia(DEFAULT_RATES.media.default);
    setTarifaBaja(DEFAULT_RATES.baja.default);
    setTarifaExtra(DEFAULT_EXTRA_GUEST_FEE);
    setCleaningFee(DEFAULT_CLEANING_FEE);
    setDescuento('0');
    setTipoDescuento('');
    setInfoTemporada(null);
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
      
      // Nombre del archivo con cliente y fecha
      const nombreArchivo = nombreCliente 
        ? `cotizacion-${nombreCliente.replace(/\s+/g, '-').toLowerCase()}-${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}.pdf`
        : `cotizacion-delventto-${Date.now()}.pdf`;
      
      pdf.save(nombreArchivo);
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
            Delventto 🥂
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
            {/* Nombre del cliente */}
            <Input
              label="Nombre del cliente"
              type="text"
              value={nombreCliente}
              onChange={setNombreCliente}
              placeholder="Ej: Juan Pérez"
            />

            {/* Selector de Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DateInput
                label="Fecha de ingreso (Check-in)"
                value={fechaInicio}
                onChange={setFechaInicio}
                min={fechaMinima}
                max={fechaMaxima}
                required
              />

              <DateInput
                label="Fecha de salida (Check-out)"
                value={fechaSalida}
                onChange={setFechaSalida}
                min={fechaInicio || fechaMinima}
                max={fechaMaxima}
                required
              />
            </div>

            {/* Información de temporada detectada */}
            {infoTemporada && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📅</span>
                  <h3 className="font-semibold text-primary-800">
                    Información de tu estancia
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-primary-600">Noches:</span>
                    <span className="ml-2 font-semibold text-primary-800">
                      {infoTemporada.noches}
                    </span>
                  </div>
                  <div>
                    <span className="text-primary-600">Temporada:</span>
                    <span className="ml-2 font-semibold text-primary-800 capitalize">
                      {infoTemporada.temporada}
                    </span>
                  </div>
                  {infoTemporada.esFestivo?.length > 0 && (
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-amber-600">🎉 {infoTemporada.esFestivo.length} festivo(s)</span>
                    </div>
                  )}
                </div>
                {Object.keys(infoTemporada.diasPorTemporada).filter(k => infoTemporada.diasPorTemporada[k] > 0).length > 1 && (
                  <div className="mt-3 pt-3 border-t border-primary-200 text-xs text-primary-700">
                    <strong>Desglose:</strong>{' '}
                    {Object.entries(infoTemporada.diasPorTemporada)
                      .filter(([, dias]) => dias > 0)
                      .map(([tipo, dias]) => `${dias} noche(s) en temporada ${tipo}`)
                      .join(' • ')}
                  </div>
                )}
              </motion.div>
            )}

            {/* Número de huéspedes */}
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

            {/* Configuración de tarifas */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Tarifas por Temporada
              </h3>
              
              <div className="space-y-4">
                {/* Tarifas por temporada */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={infoTemporada?.temporada === 'alta' ? 'ring-2 ring-primary-400 bg-primary-50 rounded-lg p-3' : ''}>
                    <Input
                      label={`Temporada Alta ($${formatNumber(DEFAULT_RATES.alta.min)} - $${formatNumber(DEFAULT_RATES.alta.max)})`}
                      type="number"
                      value={tarifaAlta}
                      onChange={setTarifaAlta}
                      min={DEFAULT_RATES.alta.min}
                      max={DEFAULT_RATES.alta.max}
                      step="1000"
                      required
                    />
                  </div>
                  <div className={infoTemporada?.temporada === 'media' ? 'ring-2 ring-primary-400 bg-primary-50 rounded-lg p-3' : ''}>
                    <Input
                      label={`Temporada Media ($${formatNumber(DEFAULT_RATES.media.min)} - $${formatNumber(DEFAULT_RATES.media.max)})`}
                      type="number"
                      value={tarifaMedia}
                      onChange={setTarifaMedia}
                      min={DEFAULT_RATES.media.min}
                      max={DEFAULT_RATES.media.max}
                      step="1000"
                      required
                    />
                  </div>
                  <div className={infoTemporada?.temporada === 'baja' ? 'ring-2 ring-primary-400 bg-primary-50 rounded-lg p-3' : ''}>
                    <Input
                      label={`Temporada Baja ($${formatNumber(DEFAULT_RATES.baja.min)} - $${formatNumber(DEFAULT_RATES.baja.max)})`}
                      type="number"
                      value={tarifaBaja}
                      onChange={setTarifaBaja}
                      min={DEFAULT_RATES.baja.min}
                      max={DEFAULT_RATES.baja.max}
                      step="1000"
                      required
                    />
                  </div>
                </div>

                {/* Otros cargos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parseInt(huespedes) === 5 && (
                    <Input
                      label="Tarifa por huésped adicional (5°)"
                      type="number"
                      value={tarifaExtra}
                      onChange={setTarifaExtra}
                      min="0"
                      step="1000"
                      required
                    />
                  )}

                  <Input
                    label="Fee de limpieza"
                    type="number"
                    value={cleaningFee}
                    onChange={setCleaningFee}
                    min="0"
                    step="1000"
                    required
                    className={parseInt(huespedes) === 5 ? '' : 'md:col-span-2'}
                  />
                </div>

                {/* Campo de descuento */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Descuento (%)"
                      type="number"
                      value={descuento}
                      onChange={(value) => {
                        setDescuento(value);
                        // Detectar tipo de descuento común
                        const num = parseFloat(value);
                        if (num === 10) setTipoDescuento('Reserva directa');
                        else if (num === 15) setTipoDescuento('Familiar/Sin amenidades');
                        else setTipoDescuento('');
                      }}
                      min="0"
                      max="100"
                      step="1"
                      placeholder="0"
                    />
                    {tipoDescuento && (
                      <div className="flex items-end pb-3">
                        <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                          ✓ {tipoDescuento}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <strong className="text-gray-700">Descuentos sugeridos:</strong><br />
                      • Reserva directa: <span className="font-semibold text-primary-600">10%</span><br />
                      • Descuento familiar: <span className="font-semibold text-primary-600">15%</span><br />
                      • Falta de amenidades: <span className="font-semibold text-primary-600">15%</span>
                    </p>
                  </div>
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
                className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-dark-500 font-semibold py-3 px-6 rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Generando PDF...' : '📄 Exportar a PDF'}
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
