# 🤖 Instrucciones para GitHub Copilot - Proyecto Delventto

Este documento proporciona instrucciones detalladas para trabajar con GitHub Copilot en el proyecto Delventto, facilitando futuras modificaciones y mantenimiento del código.

## 📋 Tabla de Contenidos

1. [Contexto del Proyecto](#contexto-del-proyecto)
2. [Arquitectura y Patrones](#arquitectura-y-patrones)
3. [Guías de Modificación Comunes](#guías-de-modificación-comunes)
4. [Prompts Útiles para Copilot](#prompts-útiles-para-copilot)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Casos de Uso Frecuentes](#casos-de-uso-frecuentes)

---

## 🎯 Contexto del Proyecto

### Propósito
Calculadora web de tarifas para apartamento de alquiler turístico en Santa Marta, Colombia. Sistema inteligente que detecta temporadas turísticas y calcula costos considerando múltiples tarifas según fechas.

### Stack Tecnológico
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TailwindCSS 3.4
- **Animaciones**: Framer Motion 11
- **Exportación**: jsPDF + html2canvas
- **Lenguaje**: JavaScript (JSX)

### Estructura de Datos Principal

```javascript
// Resultado de cálculo
{
  nombreCliente: string,
  fechaInicio: 'YYYY-MM-DD',
  fechaSalida: 'YYYY-MM-DD',
  noches: number,
  huespedes: number (1-5),
  temporadaPredominante: 'alta' | 'media' | 'baja',
  diasPorTemporada: { alta: number, media: number, baja: number },
  desglosePorTemporada: Object,
  festivosEnRango: Array<Festivo>,
  costoBase: number,
  huespedesExtras: number,
  costoHuespedesExtras: number,
  subtotalAntesDescuento: number,
  descuento: number,
  montoDescuento: number,
  totalAlojamiento: number,
  totalFinal: number
}
```

---

## 🏗️ Arquitectura y Patrones

### Patrón de Componentes

**Client Components** (con `'use client'`):
- Todos los componentes usan hooks de React
- Manejan estado local con `useState`
- Utilizan efectos con `useEffect`

**Estructura típica**:
```jsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  const handleAction = () => {
    // lógica
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* JSX */}
    </motion.div>
  );
}
```

### Separación de Responsabilidades

1. **`app/page.jsx`**: Lógica de negocio, estado, validaciones
2. **`components/`**: Componentes reutilizables sin lógica de negocio
3. **`utils/calc.js`**: Funciones puras de cálculo
4. **`utils/seasons.js`**: Datos de temporadas y lógica de fechas

### Flujo de Datos

```
Usuario ingresa datos
    ↓
app/page.jsx (validación)
    ↓
utils/seasons.js (determinarTemporada)
    ↓
utils/seasons.js (calcularReservaConFechas)
    ↓
components/SummaryCard.jsx (visualización)
```

---

## 🔧 Guías de Modificación Comunes

### 1. Cambiar Tarifas por Defecto

**Archivo**: `utils/calc.js`

**Prompt para Copilot**:
```
Actualiza las tarifas por defecto en utils/calc.js:
- Temporada alta: mínimo 600000, máximo 660000, default 630000
- Temporada media: mínimo 400000, máximo 460000, default 430000
- Temporada baja: mínimo 300000, máximo 360000, default 330000
- Huésped adicional: 70000
- Limpieza: 90000
```

**Ubicación exacta**: Líneas 3-22

---

### 2. Agregar Nueva Temporada

**Archivo**: `utils/seasons.js`

**Prompt para Copilot**:
```
Agrega una nueva temporada en utils/seasons.js en el array TEMPORADAS_TURISTICAS:
- Fecha inicio: '2027-03-01'
- Fecha fin: '2027-03-31'
- Tipo: 'media'
- Descripción: 'Temporada Media - Marzo 2027'
```

**Ubicación**: Array `TEMPORADAS_TURISTICAS` (líneas ~60-160)

**Importante**: 
- Mantener orden cronológico
- No dejar gaps entre temporadas
- Formato de fecha: 'YYYY-MM-DD'

---

### 3. Agregar Festivos de un Nuevo Año

**Archivo**: `utils/seasons.js`

**Prompt para Copilot**:
```
Agrega los festivos de Colombia para el año 2028 en utils/seasons.js:
- Año Nuevo: 1 de enero (no bridge)
- Reyes Magos: 8 de enero (bridge)
[lista completa de festivos...]
```

**Ubicación**: Objeto `FESTIVOS_COLOMBIA` (líneas ~14-40)

**Formato**:
```javascript
2028: [
  { date: '2028-01-01', name: 'Año Nuevo', bridge: false },
  { date: '2028-01-08', name: 'Reyes Magos', bridge: true },
]
```

---

### 4. Modificar Validaciones

**Archivo**: `app/page.jsx`

**Prompt para Copilot**:
```
En app/page.jsx, modifica la función handleCalcular para:
- Cambiar el número máximo de huéspedes de 5 a 6
- Agregar validación de estancia mínima de 2 noches
- Agregar validación de estancia máxima de 30 noches
```

**Ubicación**: Función `handleCalcular` (líneas ~73-125)

---

### 5. Personalizar Estilos del Tema

**Archivo**: `tailwind.config.js`

**Prompt para Copilot**:
```
Actualiza los colores del tema en tailwind.config.js:
- Cambiar primary-500 de '#025DE1' a '#FF6B6B' (rojo coral)
- Cambiar secondary-500 de '#DFFF68' a '#4ECDC4' (turquesa)
- Mantener todos los demás tonos proporcionales
```

**Ubicación**: `theme.extend.colors` (líneas ~10-50)

---

### 6. Agregar Nuevo Campo al Formulario

**Prompt para Copilot**:
```
En app/page.jsx, agrega un nuevo campo al formulario:
- Campo: "Número de mascotas"
- Tipo: number
- Valores: 0-2
- Estado: useState con nombre 'mascotas'
- Componente: Input
- Ubicación: Después del campo de huéspedes
```

**Pasos**:
1. Agregar estado: `const [mascotas, setMascotas] = useState('0');`
2. Agregar componente en el JSX
3. Actualizar función de cálculo si aplica

---

### 7. Modificar Diseño del PDF

**Archivo**: `app/page.jsx`

**Prompt para Copilot**:
```
En la función handleExportPDF de app/page.jsx:
- Cambiar orientación del PDF a horizontal ('landscape')
- Aumentar la escala del canvas a 3
- Cambiar tamaño de página a 'letter'
```

**Ubicación**: Función `handleExportPDF` (líneas ~157-186)

---

### 8. Agregar Nueva Función de Cálculo

**Archivo**: `utils/calc.js`

**Prompt para Copilot**:
```
Crea una nueva función en utils/calc.js llamada 'calcularDescuentoPorDias':
- Parámetros: noches (number)
- Retorna: porcentaje de descuento (number)
- Lógica:
  - 7-13 noches: 5% descuento
  - 14-20 noches: 10% descuento
  - 21+ noches: 15% descuento
  - Menos de 7: 0% descuento
- Incluir JSDoc
```

**Estilo del proyecto**:
```javascript
/**
 * Descripción de la función
 * @param {type} paramName - Descripción
 * @returns {type} - Descripción del retorno
 */
export function nombreFuncion(paramName) {
  // implementación
}
```

---

## 💡 Prompts Útiles para Copilot

### Para Debugging

```
Analiza la función calcularReservaConFechas en utils/seasons.js 
y explica por qué el cálculo de descuento podría estar dando resultados incorrectos
```

```
Revisa el componente SummaryCard y encuentra posibles causas de que 
no se muestre correctamente el desglose por temporada cuando hay múltiples temporadas
```

### Para Refactoring

```
Refactoriza la función handleCalcular en app/page.jsx para:
- Extraer las validaciones a funciones separadas
- Mejorar la legibilidad
- Mantener la misma funcionalidad
```

```
Optimiza el componente Input.jsx para aceptar un prop 'error' 
que muestre mensajes de error debajo del input con estilo rojo
```

### Para Agregar Features

```
Implementa una función de autocompletado para el campo nombreCliente 
que sugiera nombres de clientes anteriores almacenados en localStorage
```

```
Agrega un botón "Compartir" en SummaryCard.jsx que copie 
un resumen de la cotización al portapapeles en formato texto plano
```

### Para Testing

```
Crea casos de prueba para la función determinarTemporada en utils/seasons.js:
- Test 1: Estancia en una sola temporada
- Test 2: Estancia que cruza dos temporadas
- Test 3: Estancia con fines de semana en temporada baja
- Test 4: Fecha de salida antes de fecha de entrada (debe fallar)
```

---

## ✅ Mejores Prácticas

### Convenciones de Código

1. **Nombres de variables**:
   - camelCase para variables y funciones
   - PascalCase para componentes
   - UPPER_SNAKE_CASE para constantes

2. **Componentes**:
   - Un componente por archivo
   - Nombre del archivo = nombre del componente
   - Siempre usar `export default`

3. **Imports**:
   ```javascript
   // 1. React y hooks
   import React, { useState, useEffect } from 'react';
   
   // 2. Librerías externas
   import { motion } from 'framer-motion';
   
   // 3. Componentes locales
   import Input from '@/components/Input';
   
   // 4. Utils y helpers
   import { formatCurrency } from '@/utils/calc';
   ```

4. **Estilos con Tailwind**:
   - Usar clases utilitarias de Tailwind
   - Para estilos condicionales, usar template literals
   - Breakpoints: mobile-first (sin prefijo), luego `md:`, `lg:`

### Validaciones

Siempre validar:
- Rangos numéricos (min/max)
- Formatos de fecha ('YYYY-MM-DD')
- Tipos de datos esperados
- Valores requeridos

### Performance

- Usar `useMemo` para cálculos costosos
- Usar `useCallback` para funciones pasadas como props
- Evitar re-renders innecesarios

---

## 🎯 Casos de Uso Frecuentes

### Caso 1: Cliente Solicita Cambio de Tarifa

**Escenario**: "Necesito subir las tarifas de temporada alta en $20,000"

**Prompt**:
```
Incrementa en 20000 pesos las tarifas de temporada alta en utils/calc.js:
- Sube min, max y default en 20000
- Mantén el mismo rango de diferencia entre min y max
```

**Verificar**: Probar con fechas en temporada alta y confirmar nuevos valores.

---

### Caso 2: Agregar Nueva Temporada Alta

**Escenario**: "Necesito agregar temporada alta para el Carnaval de Barranquilla"

**Prompt**:
```
Agrega una nueva temporada alta en utils/seasons.js para el Carnaval de Barranquilla 2027:
- Fecha inicio: '2027-02-27'
- Fecha fin: '2027-03-03'
- Tipo: 'alta'
- Descripción: 'Temporada Alta - Carnaval de Barranquilla'
```

**Verificar**: Probar con fechas en ese rango y confirmar que detecta temporada alta.

---

### Caso 3: Modificar Diseño del Resumen

**Escenario**: "Quiero que el resumen muestre el logo de Delventto arriba"

**Prompt**:
```
En components/SummaryCard.jsx:
1. Importa una imagen del logo desde /public/logo.png
2. Agrégala en el header antes del título
3. Aplica estilos: ancho 120px, centrado, margen inferior 16px
```

**Verificar**: Ver en el resumen y en el PDF exportado.

---

### Caso 4: Cambiar Lógica de Descuentos

**Escenario**: "Los descuentos deben aplicarse DESPUÉS de sumar el cleaning fee"

**Prompt**:
```
En utils/seasons.js, función calcularReservaConFechas:
Modifica la lógica para que el descuento se aplique sobre 
(costoBase + costoHuespedesExtras + cleaningFee) 
en lugar de solo sobre (costoBase + costoHuespedesExtras)
```

**Verificar**: Hacer cálculo manual y comparar resultados.

---

### Caso 5: Agregar Validación Especial

**Escenario**: "No permitir reservas de menos de 3 noches en temporada alta"

**Prompt**:
```
En app/page.jsx, función handleCalcular:
Agrega una validación que:
- Verifique si la temporada predominante es 'alta'
- Si es alta y noches < 3, muestre error: 
  "La estancia mínima en temporada alta es de 3 noches"
```

**Verificar**: Intentar reservar 1-2 noches en temporada alta.

---

### Caso 6: Exportar Configuración

**Escenario**: "Quiero poder exportar y cargar configuraciones de tarifas"

**Prompt**:
```
Implementa dos funciones en app/page.jsx:
1. exportarConfiguracion(): 
   - Crea JSON con todas las tarifas actuales
   - Descarga como config-tarifas.json

2. importarConfiguracion(file):
   - Lee archivo JSON
   - Actualiza todos los estados de tarifas
   - Valida formato antes de aplicar

Agrega botones en el formulario para estas acciones
```

---

## 🎨 Guía de Estilos Visuales

### Paleta de Colores del Proyecto

```javascript
Primary (Azul):
- 500: #025DE1 (Principal)
- Hover: 600-700
- Backgrounds: 50-100
- Borders: 200-300

Secondary (Verde Lima):
- 500: #DFFF68 (Botones secundarios)
- Uso: Descuentos, highlights positivos

Gray (Neutrales):
- 50-200: Backgrounds
- 300-500: Borders y textos secundarios
- 600-900: Textos principales
```

### Componentes de UI

**Botón Primary**:
```jsx
className="bg-gradient-to-r from-primary-600 to-primary-500 
           text-white font-semibold py-3 px-6 rounded-lg 
           hover:from-primary-700 hover:to-primary-600 
           transition-all duration-200 shadow-md hover:shadow-lg"
```

**Botón Secondary**:
```jsx
className="border-2 border-gray-300 text-gray-700 
           font-semibold rounded-lg hover:bg-gray-50 
           transition-all duration-200"
```

**Input**:
```jsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:border-transparent transition-all duration-200"
```

**Card**:
```jsx
className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8"
```

---

## 🚨 Advertencias Importantes

### ⚠️ NO Modificar Sin Cuidado

1. **`utils/seasons.js` - Array TEMPORADAS_TURISTICAS**:
   - Mantener orden cronológico estricto
   - No dejar gaps entre fechas
   - Verificar que no haya solapamientos

2. **`utils/calc.js` - DEFAULT_RATES**:
   - Asegurar que `min < default < max`
   - Los valores se usan en validaciones

3. **`app/page.jsx` - Lógica de cálculo**:
   - Cualquier cambio debe probarse exhaustivamente
   - Impacta directamente en los cobros a clientes

### ⚠️ Validar Siempre

- Fechas en formato correcto ('YYYY-MM-DD')
- Números positivos en tarifas
- Rangos min/max coherentes
- Cálculos con múltiples temporadas

---

## 📖 Recursos de Aprendizaje

### Documentación Oficial
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Patrones del Proyecto
- Client Components con `'use client'`
- Separación lógica/presentación
- Funciones puras en utils
- Validaciones defensivas

---

## 🤝 Colaboración con Copilot

### Mejores Prácticas al usar Copilot

1. **Sé específico**: Menciona archivos, funciones y líneas exactas
2. **Da contexto**: Explica qué hace actualmente el código
3. **Define expectativas**: Di qué resultado esperas
4. **Pide explicaciones**: Usa "explica" antes de modificar
5. **Valida siempre**: Prueba el código generado

### Ejemplo de Prompt Efectivo

❌ **Mal**:
```
Cambia las tarifas
```

✅ **Bien**:
```
En el archivo utils/calc.js, líneas 3-22, actualiza el objeto DEFAULT_RATES:
- Temporada alta default: cambia de 590000 a 620000
- Mantén los valores min y max proporcionales (diferencia de 60000)
- No modifies las otras temporadas
```

---

## 📞 Soporte y Contacto

Para dudas sobre:
- **Arquitectura del proyecto**: Revisar este documento
- **Bugs o errores**: Crear issue con descripción detallada
- **Nuevas features**: Consultar con el equipo de desarrollo

---

**Última actualización**: Diciembre 29, 2025  
**Versión del proyecto**: 1.0.0  
**Mantenedor**: Equipo Delventto

---

## 🎓 Ejercicios de Práctica

### Ejercicio 1: Agregar Campo de Email
Agrega un campo de email al formulario y muéstralo en el resumen PDF.

### Ejercicio 2: Validación de Fin de Semana
Implementa una validación que aplique un cargo extra de $50,000 si el check-in es viernes o sábado.

### Ejercicio 3: Historial de Cotizaciones
Guarda las últimas 5 cotizaciones en localStorage y muestra un dropdown para cargarlas.

### Ejercicio 4: Modo Oscuro
Implementa un toggle de modo oscuro usando Tailwind dark mode.

### Ejercicio 5: Multi-idioma
Agrega soporte para inglés con un selector de idioma.

---

✨ **¡Feliz codificación con GitHub Copilot!** ✨
