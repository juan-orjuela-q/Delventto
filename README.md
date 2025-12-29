# Delventto - Calculadora de Tarifas 🥂

Aplicación web para calcular tarifas de alquiler de apartamento en Santa Marta, Colombia. Sistema inteligente de cotización con detección automática de temporadas turísticas y manejo de múltiples tarifas según fechas.

## 🚀 Stack Tecnológico

- **Next.js 14** (App Router con React Server Components)
- **React 18** (Hooks y Client Components)
- **TailwindCSS 3.4** (Diseño responsivo y tema personalizado)
- **Framer Motion 11** (Animaciones fluidas y transiciones)
- **jsPDF + html2canvas** (Exportación a PDF de alta calidad)
- **Font: Archivo** (Google Fonts)

## 📋 Características Principales

### ✨ Funcionalidades Core
- **Selector de fechas inteligente** con validación de rango (diciembre 2025 - febrero 2027)
- **Detección automática de temporadas** (Alta, Media, Baja) según fechas seleccionadas
- **Cálculo multi-temporada** cuando una estancia abarca diferentes periodos
- **Vista previa en tiempo real** de la temporada detectada y distribución de noches
- **Base de datos completa de festivos colombianos** (2025-2027)
- **Alertas de festivos** durante la estancia del cliente
- **Sistema de descuentos** con tipos predefinidos (10% reserva directa, 15% familiar)

### 💰 Sistema de Tarifas Flexible
- Configuración independiente por temporada (Alta/Media/Baja)
- Rangos de validación por temporada
- Tarifa variable por huésped adicional (solo aplica al 5° huésped)
- Fee de limpieza configurable
- Resaltado automático de la temporada activa en el formulario

### 📊 Resumen y Exportación
- Resumen detallado con desglose completo de costos
- Desglose por temporada para estancias multi-temporada
- Exportación a PDF con diseño profesional
- Generación de nombres de archivo personalizados con cliente y fecha

### 🎨 UX/UI Avanzada
- Diseño totalmente responsivo (móvil, tablet, desktop)
- Animaciones suaves con Framer Motion
- Validaciones en tiempo real con feedback visual
- Tema de colores personalizado (Primary: Azul, Secondary: Verde Lima)
- Estados de carga y feedback de errores  

## 🛠️ Instalación y Configuración

### Requisitos Previos
- **Node.js** 18.0 o superior
- **npm** 9.0 o superior (o yarn/pnpm equivalente)
- Sistema operativo: Windows, macOS o Linux

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone https://github.com/juan-orjuela-q/Delventto.git
   cd Delventto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   El servidor se iniciará en `http://localhost:3000`

4. **Build para producción**
   ```bash
   npm run build
   npm run start
   ```

## 📦 Scripts disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build para producción
npm run start    # Ejecutar build de producción
npm run lint     # Linter
```

## 📁 Estructura del Proyecto

```
Delventto/
├── app/                          # Next.js App Router
│   ├── layout.jsx                # Layout raíz con metadata y fuente
│   ├── page.jsx                  # Página principal (488 líneas)
│   │                             # - Lógica de estado y validaciones
│   │                             # - Integración de temporadas
│   │                             # - Exportación a PDF
│   └── globals.css               # Estilos globales y utilidades Tailwind
│
├── components/                   # Componentes reutilizables
│   ├── Input.jsx                 # Input genérico con validación
│   ├── DateInput.jsx             # Selector de fechas especializado
│   ├── Select.jsx                # Select dropdown
│   └── SummaryCard.jsx           # Tarjeta de resumen con desglose (196 líneas)
│
├── utils/                        # Lógica de negocio y utilidades
│   ├── calc.js                   # Funciones de cálculo de tarifas (111 líneas)
│   │                             # - DEFAULT_RATES
│   │                             # - calcularReserva()
│   │                             # - formatCurrency()
│   │                             # - formatNumber()
│   │
│   └── seasons.js                # Temporadas y festivos (412 líneas)
│                                 # - FESTIVOS_COLOMBIA (2025-2027)
│                                 # - TEMPORADAS_TURISTICAS
│                                 # - determinarTemporada()
│                                 # - calcularReservaConFechas()
│                                 # - esFinDeSemana()
│                                 # - verificarSiFestivo()
│
├── public/                       # Assets estáticos (si aplica)
├── package.json                  # Dependencias y scripts
├── next.config.js                # Configuración de Next.js
├── tailwind.config.js            # Configuración de Tailwind (tema personalizado)
├── postcss.config.js             # Configuración de PostCSS
├── jsconfig.json                 # Aliases y configuración de JS
└── README.md                     # Documentación del proyecto
```

## 💰 Configuración de Tarifas

### Tarifas Actuales por Temporada (2025-2027)

#### Temporada Alta 🔥
- **Rango**: $560,000 - $620,000 COP por noche
- **Default**: $590,000 COP
- **Períodos**:
  - 15 diciembre - 15 enero (Navidad y Año Nuevo)
  - Semana Santa (variable según año)
  - 20 junio - 15 julio (Vacaciones mitad de año)
  - Puente de Octubre (12-13 de octubre)

#### Temporada Media ⚡
- **Rango**: $360,000 - $420,000 COP por noche
- **Default**: $390,000 COP
- **Períodos**:
  - 16 enero - 31 marzo
  - 1-14 diciembre
  - Junio (1-19)
  - Julio-Agosto (16 julio - 31 agosto)
  - Fines de semana en temporada baja

#### Temporada Baja 💚
- **Rango**: $260,000 - $320,000 COP por noche
- **Default**: $290,000 COP
- **Períodos**:
  - Abril-Mayo (excepto Semana Santa)
  - Septiembre
  - Octubre-Noviembre (entre semana)

### Cargos Adicionales
- **Huésped adicional** (5°): $60,000 COP por noche
- **Fee de limpieza**: $80,000 COP (cargo único)

### Descuentos Sugeridos
- **Reserva directa**: 10%
- **Descuento familiar**: 15%
- **Falta de amenidades**: 15%

## 🧮 Algoritmo de Cálculo

### Sistema Inteligente Multi-Temporada

El sistema calcula automáticamente el costo total considerando que una estancia puede abarcar múltiples temporadas:

```javascript
// 1. Determinar temporada para cada noche
Para cada día entre check-in y check-out:
  - Consultar TEMPORADAS_TURISTICAS
  - Si es fin de semana en temporada baja → elevar a media
  - Aplicar tarifa correspondiente a ese día específico

// 2. Acumular costos por temporada
diasPorTemporada = { alta: X, media: Y, baja: Z }
costoBase = Σ(tarifaTemporada[tipo] × diasEnTemporada[tipo])

// 3. Calcular cargos adicionales
huespedesExtras = max(0, huespedes - 4)
costoHuespedesExtras = huespedesExtras × tarifaExtra × totalNoches

// 4. Aplicar descuentos
subtotal = costoBase + costoHuespedesExtras
montoDescuento = subtotal × (descuento / 100)
totalDespuesDescuento = subtotal - montoDescuento

// 5. Total final
totalFinal = totalDespuesDescuento + cleaningFee
```

### Fórmula Detallada

```
TOTAL FINAL = 
  Σ(Tarifa[temporada_día_i] × 1 noche) +                    // Base por día
  (max(0, huéspedes - 4) × tarifaExtra × totalNoches) -     // Extras
  ((subtotal × descuento) / 100) +                          // Descuento
  cleaningFee                                               // Limpieza
```

### Reglas de Negocio

1. **Detección de Temporada**: 
   - Se consulta la fecha exacta contra `TEMPORADAS_TURISTICAS`
   - Fines de semana en temporada baja se elevan automáticamente a media
   
2. **Huésped Adicional**: 
   - Solo aplica cuando hay exactamente 5 huéspedes
   - Se cobra por noche (no por temporada)
   
3. **Descuentos**: 
   - Se aplican sobre el subtotal (base + extras)
   - No afectan al cleaning fee
   
4. **Festivos**: 
   - Se detectan y alertan
   - No modifican automáticamente la tarifa (esto depende de la temporada definida)

## 🎨 Personalización y Configuración

### Modificar Tarifas por Defecto

Editar `utils/calc.js`:

```javascript
export const DEFAULT_RATES = {
  alta: {
    min: 560000,    // Tarifa mínima permitida
    max: 620000,    // Tarifa máxima permitida
    default: 590000,// Tarifa por defecto en el formulario
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

export const DEFAULT_EXTRA_GUEST_FEE = 60000;  // Tarifa 5° huésped
export const DEFAULT_CLEANING_FEE = 80000;     // Fee de limpieza
```

### Agregar o Modificar Temporadas

Editar `utils/seasons.js`:

```javascript
export const TEMPORADAS_TURISTICAS = [
  {
    inicio: '2026-12-15',        // Fecha inicio (YYYY-MM-DD)
    fin: '2027-01-15',           // Fecha fin (YYYY-MM-DD)
    tipo: 'alta',                // 'alta' | 'media' | 'baja'
    descripcion: 'Temporada Alta - Navidad y Año Nuevo',
  },
  // ... más temporadas
];
```

### Actualizar Festivos

Editar `utils/seasons.js`:

```javascript
export const FESTIVOS_COLOMBIA = {
  2027: [
    { 
      date: '2027-01-01',        // Formato YYYY-MM-DD
      name: 'Año Nuevo',         // Nombre del festivo
      bridge: false              // true si es puente festivo
    },
    // ... más festivos
  ],
};
```

### Personalizar Tema de Colores

Editar `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#025DE1',  // Color principal (azul)
        // ... otros tonos
      },
      secondary: {
        500: '#DFFF68',  // Color secundario (verde lima)
        // ... otros tonos
      },
    },
  },
},
```

### Cambiar Fuente

Editar `app/layout.jsx`:

```javascript
import { Archivo } from 'next/font/google'
// Cambiar por otra fuente de Google Fonts:
// import { Roboto, Inter, Poppins } from 'next/font/google'

const archivo = Archivo({ subsets: ['latin'] })
```

## 📱 Diseño Responsivo

La aplicación está optimizada para todas las resoluciones:

| Dispositivo | Resolución | Características |
|------------|------------|-----------------|
| 📱 Móvil | < 640px | Layout de 1 columna, táctil optimizado |
| 📱 Tablet | 640px - 1024px | Grid de 2 columnas, inputs más grandes |
| 🖥️ Desktop | > 1024px | Grid de 3 columnas, vista completa |

### Breakpoints de Tailwind

```javascript
sm: '640px'   // Tablets pequeñas
md: '768px'   // Tablets
lg: '1024px'  // Desktop
xl: '1280px'  // Desktop grande
2xl: '1536px' // Pantallas grandes
```

## 🔧 API y Funciones Principales

### `utils/seasons.js`

#### `determinarTemporada(fechaInicio, fechaSalida)`
Determina la temporada predominante para un rango de fechas.

**Parámetros:**
- `fechaInicio` (string): Fecha check-in formato 'YYYY-MM-DD'
- `fechaSalida` (string): Fecha check-out formato 'YYYY-MM-DD'

**Retorna:**
```javascript
{
  temporada: 'alta' | 'media' | 'baja',
  noches: number,
  diasPorTemporada: { alta: number, media: number, baja: number },
  temporadasEnEstancia: Array<Temporada>,
  fechaInicio: string,
  fechaSalida: string,
  esFestivo: Array<Festivo>
}
```

#### `calcularReservaConFechas(params)`
Calcula el costo total considerando múltiples temporadas.

**Parámetros:**
```javascript
{
  nombreCliente: string,
  fechaInicio: string,
  fechaSalida: string,
  huespedes: number (1-5),
  tarifas: { alta: number, media: number, baja: number },
  tarifaExtra: number,
  cleaningFee: number,
  descuento: number (0-100),
  tipoDescuento: string
}
```

**Retorna:**
```javascript
{
  nombreCliente: string,
  fechaInicio: string,
  fechaSalida: string,
  noches: number,
  huespedes: number,
  temporadaPredominante: string,
  diasPorTemporada: Object,
  desglosePorTemporada: Object,
  festivosEnRango: Array,
  costoBase: number,
  huespedesExtras: number,
  costoHuespedesExtras: number,
  subtotalAntesDescuento: number,
  descuento: number,
  tipoDescuento: string,
  montoDescuento: number,
  tarifaExtra: number,
  cleaningFee: number,
  totalAlojamiento: number,
  totalFinal: number
}
```

### `utils/calc.js`

#### `formatCurrency(amount)`
Formatea un número a pesos colombianos con símbolo.

**Ejemplo:** `formatCurrency(550000)` → `"$550.000"`

#### `formatNumber(amount)`
Formatea un número con separadores de miles sin símbolo.

**Ejemplo:** `formatNumber(550000)` → `"550.000"`

## 🐛 Solución de Problemas

### Error: Module not found

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# En Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Problemas con TailwindCSS

1. Verificar `tailwind.config.js` incluye las rutas correctas
2. Verificar que `globals.css` tenga las directivas:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Reiniciar el servidor de desarrollo

### PDF no se genera correctamente

- Verificar instalación de dependencias:
  ```bash
  npm install html2canvas jspdf
  ```
- Verificar que el elemento `#summary-card` existe en el DOM
- Revisar la consola del navegador para errores

### Fechas no se validan correctamente

- Verificar que las fechas están en formato `YYYY-MM-DD`
- Asegurarse de que `fechaInicio < fechaSalida`
- Verificar rango permitido (dic 2025 - feb 2027)

### Los cálculos no son precisos

- Verificar que las tarifas están dentro de los rangos permitidos
- Revisar que `huespedes` esté entre 1 y 5
- Verificar que las temporadas en `seasons.js` no tienen gaps

## 🚀 Despliegue a Producción

### Vercel (Recomendado)

1. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Desplegar:
   ```bash
   vercel
   ```

3. Seguir las instrucciones en pantalla

### Build Manual

```bash
# Generar build de producción
npm run build

# Ejecutar en producción
npm run start
```

El build generado estará en `.next/`

### Variables de Entorno (si aplica)

Crear archivo `.env.local`:
```
NEXT_PUBLIC_API_URL=your_api_url
```

## 📊 Métricas del Proyecto

- **Total de líneas de código**: ~1,500+
- **Componentes React**: 5
- **Funciones utilitarias**: 8+
- **Festivos definidos**: 50+ (2025-2027)
- **Períodos de temporada**: 15+
- **Tamaño del bundle**: ~150KB (gzipped)

## 🔐 Seguridad

- ✅ Validación de entrada en cliente y servidor
- ✅ Sanitización de datos de usuario
- ✅ Sin almacenamiento de datos sensibles
- ✅ No requiere autenticación (calculadora pública)
- ✅ Exportación de PDF local (sin envío a servidor)

## 📝 Changelog

### v1.0.0 (Actual)
- ✅ Sistema completo de temporadas turísticas
- ✅ Cálculo multi-temporada en una estancia
- ✅ Detección de festivos colombianos 2025-2027
- ✅ Exportación a PDF
- ✅ Sistema de descuentos
- ✅ Validación de rangos de tarifas
- ✅ Interfaz responsiva y animada
- ✅ Vista previa en tiempo real de temporadas

### Próximas Mejoras (Roadmap)
- 🔜 Exportación a Excel/CSV
- 🔜 Historial de cotizaciones
- 🔜 Comparador de fechas
- 🔜 Envío de cotización por email
- 🔜 Modo multi-idioma (ES/EN)
- 🔜 Panel de administración para tarifas
- 🔜 Integración con calendario de disponibilidad
- 🔜 Sistema de reservas online

## 🤝 Contribución

Este es un proyecto privado para uso exclusivo de Delventto. Para sugerencias o mejoras, contactar al equipo de desarrollo.

## 📄 Licencia

Este proyecto es de uso privado y exclusivo para **Delventto - Santa Marta, Colombia**.  
Todos los derechos reservados © 2025.

## 👨‍💻 Información del Desarrollador

**Desarrollado con ❤️ para Delventto**

📍 Santa Marta, Colombia  
🏢 Apartamento de alquiler turístico  
📧 Para soporte técnico o preguntas, contactar al administrador del proyecto

---

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

**¿Necesitas ayuda?** Consulta el archivo `COPILOT_INSTRUCTIONS.md` para instrucciones detalladas sobre cómo modificar el proyecto con GitHub Copilot.
