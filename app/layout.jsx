import './globals.css'
import { Archivo } from 'next/font/google'

const archivo = Archivo({ subsets: ['latin'] })

export const metadata = {
  title: 'Delventto - Calculadora de Tarifas',
  description: 'Calculadora de tarifas para apartamento de alquiler en Santa Marta',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={archivo.className}>{children}</body>
    </html>
  )
}
