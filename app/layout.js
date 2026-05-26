export const metadata = {
  title: 'HookMachine — Generador de Hooks Fitness',
  description: 'Genera hooks fitness virales con IA para Instagram y Twitter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
