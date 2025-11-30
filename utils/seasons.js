/**
 * Festivos y temporadas turísticas en Colombia
 * Diciembre 2025 - Febrero 2027
 */

/**
 * Festivos fijos y móviles de Colombia
 * Incluye puentes festivos y días importantes
 */
export const FESTIVOS_COLOMBIA = {
  2025: [
    { date: '2025-12-08', name: 'Día de la Inmaculada Concepción', bridge: false },
    { date: '2025-12-25', name: 'Navidad', bridge: false },
    { date: '2025-12-31', name: 'Fin de Año', bridge: false },
  ],
  2026: [
    { date: '2026-01-01', name: 'Año Nuevo', bridge: false },
    { date: '2026-01-12', name: 'Día de los Reyes Magos', bridge: true },
    { date: '2026-03-23', name: 'Día de San José', bridge: true },
    { date: '2026-04-02', name: 'Jueves Santo', bridge: false },
    { date: '2026-04-03', name: 'Viernes Santo', bridge: false },
    { date: '2026-05-01', name: 'Día del Trabajo', bridge: false },
    { date: '2026-05-18', name: 'Ascensión del Señor', bridge: true },
    { date: '2026-06-08', name: 'Corpus Christi', bridge: true },
    { date: '2026-06-15', name: 'Sagrado Corazón de Jesús', bridge: true },
    { date: '2026-06-29', name: 'San Pedro y San Pablo', bridge: true },
    { date: '2026-07-20', name: 'Día de la Independencia', bridge: false },
    { date: '2026-08-07', name: 'Batalla de Boyacá', bridge: false },
    { date: '2026-08-17', name: 'Asunción de la Virgen', bridge: true },
    { date: '2026-10-12', name: 'Día de la Raza', bridge: true },
    { date: '2026-11-02', name: 'Día de Todos los Santos', bridge: true },
    { date: '2026-11-16', name: 'Independencia de Cartagena', bridge: true },
    { date: '2026-12-08', name: 'Día de la Inmaculada Concepción', bridge: false },
    { date: '2026-12-25', name: 'Navidad', bridge: false },
    { date: '2026-12-31', name: 'Fin de Año', bridge: false },
  ],
  2027: [
    { date: '2027-01-01', name: 'Año Nuevo', bridge: false },
    { date: '2027-01-11', name: 'Día de los Reyes Magos', bridge: true },
    { date: '2027-02-14', name: 'San Valentín (comercial)', bridge: false },
  ],
};

/**
 * Definición de temporadas turísticas en Santa Marta, Colombia
 * Basado en patrones históricos de turismo
 */
export const TEMPORADAS_TURISTICAS = [
  // 2025
  {
    inicio: '2025-12-15',
    fin: '2026-01-15',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Navidad y Año Nuevo',
  },
  
  // 2026
  {
    inicio: '2026-01-16',
    fin: '2026-03-15',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Inicio de año y carnavales',
  },
  {
    inicio: '2026-03-16',
    fin: '2026-04-01',
    tipo: 'media',
    descripcion: 'Temporada Media - Pre Semana Santa',
  },
  {
    inicio: '2026-04-02',
    fin: '2026-04-12',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Semana Santa',
  },
  {
    inicio: '2026-04-13',
    fin: '2026-05-31',
    tipo: 'media',
    descripcion: 'Temporada Media - Post Semana Santa',
  },
  {
    inicio: '2026-06-01',
    fin: '2026-06-30',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Vacaciones mitad de año',
  },
  {
    inicio: '2026-07-01',
    fin: '2026-09-30',
    tipo: 'media',
    descripcion: 'Temporada Media - Segundo semestre',
  },
  {
    inicio: '2026-10-01',
    fin: '2026-10-18',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Puente de Octubre',
  },
  {
    inicio: '2026-10-19',
    fin: '2026-11-30',
    tipo: 'baja',
    descripcion: 'Temporada Baja - Pre navidad',
  },
  {
    inicio: '2026-12-01',
    fin: '2027-01-15',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Navidad y Año Nuevo',
  },
  
  // 2027
  {
    inicio: '2027-01-16',
    fin: '2027-02-28',
    tipo: 'alta',
    descripcion: 'Temporada Alta - Inicio de año',
  },
];

/**
 * Determina la temporada turística para un rango de fechas
 * @param {Date} fechaInicio - Fecha de check-in
 * @param {Date} fechaSalida - Fecha de check-out
 * @returns {Object} - Información de la temporada
 */
export function determinarTemporada(fechaInicio, fechaSalida) {
  const inicio = new Date(fechaInicio);
  const salida = new Date(fechaSalida);
  
  // Validaciones
  if (inicio >= salida) {
    throw new Error('La fecha de salida debe ser posterior a la fecha de ingreso');
  }
  
  const noches = Math.ceil((salida - inicio) / (1000 * 60 * 60 * 24));
  
  if (noches < 1) {
    throw new Error('La estancia debe ser de al menos 1 noche');
  }
  
  // Encontrar temporadas que intersectan con la estancia
  const temporadasEnEstancia = [];
  let diasPorTemporada = { alta: 0, media: 0, baja: 0 };
  
  for (let i = 0; i < noches; i++) {
    const diaActual = new Date(inicio);
    diaActual.setDate(diaActual.getDate() + i);
    
    const temporada = encontrarTemporadaParaDia(diaActual);
    diasPorTemporada[temporada.tipo]++;
    
    if (!temporadasEnEstancia.find(t => t.tipo === temporada.tipo)) {
      temporadasEnEstancia.push(temporada);
    }
  }
  
  // Determinar la temporada predominante
  const temporadaPredominante = Object.keys(diasPorTemporada).reduce((a, b) =>
    diasPorTemporada[a] > diasPorTemporada[b] ? a : b
  );
  
  return {
    temporada: temporadaPredominante,
    noches,
    diasPorTemporada,
    temporadasEnEstancia,
    fechaInicio: fechaInicio,
    fechaSalida: fechaSalida,
    esFestivo: verificarSiFestivo(fechaInicio, fechaSalida),
  };
}

/**
 * Encuentra la temporada para un día específico
 * @param {Date} fecha - Fecha a verificar
 * @returns {Object} - Temporada correspondiente
 */
function encontrarTemporadaParaDia(fecha) {
  const fechaStr = fecha.toISOString().split('T')[0];
  
  for (const temporada of TEMPORADAS_TURISTICAS) {
    if (fechaStr >= temporada.inicio && fechaStr <= temporada.fin) {
      return temporada;
    }
  }
  
  // Si no se encuentra en rangos definidos, usar temporada baja por defecto
  return {
    inicio: fechaStr,
    fin: fechaStr,
    tipo: 'baja',
    descripcion: 'Temporada Baja - Default',
  };
}

/**
 * Verifica si alguna fecha del rango coincide con festivos
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaSalida - Fecha de salida
 * @returns {Array} - Lista de festivos en el rango
 */
function verificarSiFestivo(fechaInicio, fechaSalida) {
  const inicio = new Date(fechaInicio);
  const salida = new Date(fechaSalida);
  const festivosEnRango = [];
  
  const year = inicio.getFullYear();
  const festivos = FESTIVOS_COLOMBIA[year] || [];
  
  for (const festivo of festivos) {
    const fechaFestivo = new Date(festivo.date);
    if (fechaFestivo >= inicio && fechaFestivo < salida) {
      festivosEnRango.push(festivo);
    }
  }
  
  // Verificar también el año siguiente si cruza años
  if (inicio.getFullYear() !== salida.getFullYear()) {
    const festivosSiguienteYear = FESTIVOS_COLOMBIA[salida.getFullYear()] || [];
    for (const festivo of festivosSiguienteYear) {
      const fechaFestivo = new Date(festivo.date);
      if (fechaFestivo >= inicio && fechaFestivo < salida) {
        festivosEnRango.push(festivo);
      }
    }
  }
  
  return festivosEnRango;
}

/**
 * Calcula el precio considerando múltiples temporadas en una estancia
 * @param {Date} fechaInicio - Fecha de check-in
 * @param {Date} fechaSalida - Fecha de check-out
 * @param {number} huespedes - Número de huéspedes
 * @param {Object} tarifas - Tarifas base por temporada
 * @param {number} tarifaExtra - Tarifa por huésped adicional
 * @param {number} cleaningFee - Fee de limpieza
 * @returns {Object} - Cálculo detallado
 */
export function calcularReservaConFechas({
  fechaInicio,
  fechaSalida,
  huespedes,
  tarifas,
  tarifaExtra,
  cleaningFee,
}) {
  const info = determinarTemporada(fechaInicio, fechaSalida);
  const { noches, diasPorTemporada } = info;
  
  // Validar huéspedes
  if (huespedes < 1 || huespedes > 5) {
    throw new Error('El número de huéspedes debe estar entre 1 y 5');
  }
  
  // Calcular costo por cada temporada
  let costoBase = 0;
  const desglosePorTemporada = {};
  
  for (const [tipo, dias] of Object.entries(diasPorTemporada)) {
    if (dias > 0) {
      const tarifa = tarifas[tipo];
      const costo = tarifa * dias;
      costoBase += costo;
      desglosePorTemporada[tipo] = {
        dias,
        tarifaPorNoche: tarifa,
        subtotal: costo,
      };
    }
  }
  
  // Cálculo de huéspedes extras
  const huespedesExtras = Math.max(0, huespedes - 4);
  const costoHuespedesExtras = huespedesExtras * tarifaExtra * noches;
  
  // Total de alojamiento
  const totalAlojamiento = costoBase + costoHuespedesExtras;
  
  // Total final
  const totalFinal = totalAlojamiento + cleaningFee;
  
  return {
    fechaInicio,
    fechaSalida,
    noches,
    huespedes,
    temporadaPredominante: info.temporada,
    diasPorTemporada,
    desglosePorTemporada,
    festivosEnRango: info.esFestivo,
    costoBase,
    huespedesExtras,
    costoHuespedesExtras,
    tarifaExtra,
    cleaningFee,
    totalAlojamiento,
    totalFinal,
  };
}

/**
 * Formatea una fecha en formato legible
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export function formatearFecha(fecha) {
  const date = new Date(fecha);
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Obtiene la fecha mínima permitida (hoy)
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export function obtenerFechaMinima() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

/**
 * Obtiene la fecha máxima permitida (febrero 2027)
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export function obtenerFechaMaxima() {
  return '2027-02-28';
}
