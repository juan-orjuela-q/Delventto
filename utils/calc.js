/**
 * Tarifas por defecto según temporada
 */
export const DEFAULT_RATES = {
  alta: {
    min: 560000,
    max: 620000,
    default: 590000,
  },
  media: {
    min: 360000,
    max: 420000,
    default: 390000,
  },
  baja: {
    min: 260000,
    max: 320000,
    default: 290000,
  },
};

export const DEFAULT_EXTRA_GUEST_FEE = 60000;
export const DEFAULT_CLEANING_FEE = 80000;

/**
 * Calcula el costo total de la reserva
 * @param {Object} params - Parámetros de cálculo
 * @param {string} params.temporada - 'alta' | 'media' | 'baja'
 * @param {number} params.noches - Número de noches
 * @param {number} params.huespedes - Número de huéspedes (máx 5)
 * @param {number} params.tarifaBase - Tarifa base por noche según temporada
 * @param {number} params.tarifaExtra - Tarifa por huésped adicional (5°)
 * @param {number} params.cleaningFee - Fee de limpieza
 * @returns {Object} - Resultado del cálculo con desglose
 */
export function calcularReserva({
  temporada,
  noches,
  huespedes,
  tarifaBase,
  tarifaExtra,
  cleaningFee,
}) {
  // Validaciones
  if (noches < 1) {
    throw new Error('El número de noches debe ser al menos 1');
  }
  if (huespedes < 1 || huespedes > 5) {
    throw new Error('El número de huéspedes debe estar entre 1 y 5');
  }

  // Cálculo de tarifa de alojamiento base
  const costoBase = tarifaBase * noches;

  // Cálculo de tarifa por huésped adicional (solo aplica al 5° huésped)
  const huespedesExtras = Math.max(0, huespedes - 4);
  const costoHuespedesExtras = huespedesExtras * tarifaExtra * noches;

  // Total de alojamiento
  const totalAlojamiento = costoBase + costoHuespedesExtras;

  // Total final incluyendo cleaning fee
  const totalFinal = totalAlojamiento + cleaningFee;

  return {
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
  };
}

/**
 * Formatea un número a pesos colombianos
 * @param {number} amount - Monto a formatear
 * @returns {string} - Monto formateado
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea un número con separadores de miles (sin símbolo de moneda)
 * @param {number} amount - Monto a formatear
 * @returns {string} - Número formateado
 */
export function formatNumber(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
