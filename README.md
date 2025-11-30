# Delventto - Calculadora de Tarifas

Aplicación web para calcular tarifas de alquiler de apartamento en Santa Marta, Colombia.

## 🚀 Tecnologías

- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS**
- **Framer Motion** (animaciones)
- **jsPDF + html2canvas** (exportación a PDF)

## 📋 Características

✅ Cálculo de tarifas por temporada (Alta, Media, Baja)  
✅ Configuración flexible de tarifas base  
✅ Tarifa por huésped adicional (5° huésped)  
✅ Fee de limpieza configurable  
✅ Resumen detallado de costos  
✅ Exportación a PDF  
✅ Exportación a JSON  
✅ Diseño responsivo y moderno  
✅ Validaciones en tiempo real  
✅ Animaciones suaves  

## 🛠️ Instalación

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📦 Scripts disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build para producción
npm run start    # Ejecutar build de producción
npm run lint     # Linter
```

## 📁 Estructura del proyecto

```
delventto-calculator/
├── app/
│   ├── layout.jsx       # Layout principal
│   ├── page.jsx         # Página principal
│   └── globals.css      # Estilos globales
├── components/
│   ├── Input.jsx        # Componente input reutilizable
│   ├── Select.jsx       # Componente select reutilizable
│   └── SummaryCard.jsx  # Tarjeta de resumen
├── utils/
│   └── calc.js          # Lógica de cálculo
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 💰 Tarifas por defecto

### Temporada Alta
- Rango: $520,000 - $580,000 por noche
- Default: $550,000

### Temporada Media
- Rango: $330,000 - $380,000 por noche
- Default: $355,000

### Temporada Baja
- Rango: $240,000 - $290,000 por noche
- Default: $265,000

### Otros cargos
- Huésped adicional (5°): $40,000 por noche
- Fee de limpieza: $60,000 (fijo)

## 🧮 Fórmula de cálculo

```javascript
totalAlojamiento = tarifaBase × noches + 
                   (huéspedes > 4 ? (huéspedes - 4) × tarifaExtra × noches : 0)

totalFinal = totalAlojamiento + cleaningFee
```

## 🎨 Personalización

### Cambiar colores
Editar `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Personalizar paleta de colores
  }
}
```

### Cambiar tarifas por defecto
Editar `utils/calc.js`:
```javascript
export const DEFAULT_RATES = {
  alta: { min: 520000, max: 580000, default: 550000 },
  // ...
}
```

## 📱 Responsividad

La aplicación es completamente responsiva y se adapta a:
- 📱 Móviles (< 640px)
- 📱 Tablets (640px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🐛 Solución de problemas

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas con TailwindCSS
Verificar que `tailwind.config.js` y `postcss.config.js` estén configurados correctamente.

### PDF no se genera
Verificar que las librerías `html2canvas` y `jspdf` estén instaladas:
```bash
npm install html2canvas jspdf
```

## 📄 Licencia

Este proyecto es de uso privado para Delventto.

## 👨‍💻 Autor

Desarrollado con ❤️ para Delventto - Santa Marta, Colombia

---

**¿Preguntas o sugerencias?** Contacta al desarrollador.
