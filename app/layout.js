export const metadata = {
  title: 'HookMachine — Generador de Hooks Fitness',
  description: 'Genera hooks fitness virales con IA para Instagram y Twitter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: '#0A0A0A' }}>
        {children}
      </body>
    </html>
  )
}
