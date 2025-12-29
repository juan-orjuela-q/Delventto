# GitHub Copilot Instructions - Delventto Project

## Project Context

This is a **Next.js 14 web application** for calculating rental rates for a vacation apartment in Santa Marta, Colombia. It features an intelligent system that automatically detects tourist seasons and calculates costs across multiple rate periods.

## Key Technical Details

### Architecture
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (JSX)
- **Styling**: TailwindCSS 3.4 with custom theme
- **State Management**: React hooks (useState, useEffect)
- **All components are Client Components** (use `'use client'` directive)

### Project Structure
```
app/
  ├── layout.jsx      - Root layout with Archivo font
  ├── page.jsx        - Main logic (488 lines)
  └── globals.css     - Global styles

components/
  ├── Input.jsx       - Reusable input component
  ├── DateInput.jsx   - Date selector
  └── SummaryCard.jsx - Summary with breakdown

utils/
  ├── calc.js         - Pure calculation functions
  └── seasons.js      - Season detection logic (412 lines)
```

### Core Business Logic

1. **Season Detection** (`utils/seasons.js`):
   - Determines season for each night in a stay
   - Handles multi-season reservations
   - Elevates weekends in low season to medium season
   - Returns breakdown by season type

2. **Rate Calculation** (`utils/seasons.js` - `calcularReservaConFechas`):
   ```javascript
   Total = Σ(rate per season × nights per season) +
           (extra guests × extraRate × totalNights) -
           (subtotal × discount / 100) +
           cleaningFee
   ```

3. **Validation Rules**:
   - Guests: 1-5 (extra charge only for 5th guest)
   - Date range: December 2025 - February 2027
   - Rates must be within defined min/max ranges
   - Check-out must be after check-in

## Code Style Guidelines

### Component Pattern
```jsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* JSX content */}
    </motion.div>
  );
}
```

### Naming Conventions
- Variables/functions: `camelCase`
- Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: Match component name

### TailwindCSS Patterns
- Mobile-first responsive design
- Use custom theme colors: `primary-*`, `secondary-*`
- Consistent spacing: `p-4`, `gap-4`, `mb-6`
- Animations with Framer Motion

### Import Order
1. React and hooks
2. External libraries
3. Local components (use `@/` alias)
4. Utils and helpers

## Common Tasks

### Modifying Rates
**File**: `utils/calc.js` (lines 3-22)
```javascript
export const DEFAULT_RATES = {
  alta: { min: 560000, max: 620000, default: 590000 },
  // ... modify values here
};
```

### Adding Seasons
**File**: `utils/seasons.js` (TEMPORADAS_TURISTICAS array)
- Maintain chronological order
- No gaps between dates
- Format: `'YYYY-MM-DD'`

### Adding Holidays
**File**: `utils/seasons.js` (FESTIVOS_COLOMBIA object)
```javascript
2027: [
  { date: '2027-01-01', name: 'Holiday Name', bridge: false },
]
```

### Form Validation
**File**: `app/page.jsx` (handleCalcular function, lines ~73-125)
- Add validation checks before calculation
- Set error messages with `setError()`

## Important Constraints

### DO NOT:
- Change season order in `TEMPORADAS_TURISTICAS`
- Create gaps between season dates
- Modify calculation logic without thorough testing
- Remove `'use client'` directive from components
- Break the date format (`'YYYY-MM-DD'`)

### ALWAYS:
- Validate user inputs
- Test with multiple season scenarios
- Maintain min < default < max in rate ranges
- Use Framer Motion for animations
- Follow existing component patterns

## Data Flow

```
User Input (app/page.jsx)
    ↓
Validation (handleCalcular)
    ↓
Season Detection (utils/seasons.js - determinarTemporada)
    ↓
Cost Calculation (utils/seasons.js - calcularReservaConFechas)
    ↓
Display Summary (components/SummaryCard.jsx)
    ↓
Export PDF (app/page.jsx - handleExportPDF)
```

## Key Functions

### `determinarTemporada(fechaInicio, fechaSalida)`
- **Location**: `utils/seasons.js`
- **Purpose**: Detect season for date range
- **Returns**: Object with season info and day breakdown

### `calcularReservaConFechas(params)`
- **Location**: `utils/seasons.js`
- **Purpose**: Calculate total cost with multi-season support
- **Returns**: Complete breakdown including discounts

### `formatCurrency(amount)` & `formatNumber(amount)`
- **Location**: `utils/calc.js`
- **Purpose**: Format numbers as Colombian pesos

## Testing Checklist

When making changes, test:
- ✅ Single-season stays
- ✅ Multi-season stays
- ✅ Weekend detection in low season
- ✅ Holiday detection
- ✅ 5-guest scenarios
- ✅ Discount calculations
- ✅ PDF export
- ✅ Date validation
- ✅ Responsive design

## Color Theme

```javascript
Primary (Blue): #025DE1 (and shades 50-900)
Secondary (Lime): #DFFF68 (and shades 50-900)
Dark: #212321 (and shades 50-900)
Gray: Standard gray scale
```

## Useful Prompts for Copilot

**Explaining Code**:
```
Explain how the multi-season calculation works in utils/seasons.js
```

**Refactoring**:
```
Refactor handleCalcular in app/page.jsx to extract validation logic
```

**Adding Features**:
```
Add email field to the form and include it in the PDF export
```

**Debugging**:
```
Find why discount calculation might be incorrect in calcularReservaConFechas
```

## Additional Resources

- Full documentation: `README.md`
- Detailed instructions: `COPILOT_INSTRUCTIONS.md`
- Current date context: December 29, 2025

## Project Status

- ✅ Version 1.0.0 - Production ready
- ✅ Fully functional calculator
- ✅ PDF export working
- ✅ Responsive design
- 🔜 Future: Excel export, booking history, email integration

---

**When in doubt**: Refer to existing patterns in the codebase. Consistency is key!
