import { useEffect, useState } from 'react'
import { breakpoints } from '../../styles/breakpoints'

export function BreakpointIndicator() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Solo se muestra en desarrollo (npm run dev), nunca en el build de producción
  if (!import.meta.env.DEV) return null

  const label =
    width < breakpoints.tablet ? 'mobile' : width < breakpoints.desktop ? 'tablet' : 'desktop'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        background: 'black',
        color: 'lime',
        fontSize: 12,
        padding: '4px 8px',
        borderRadius: 4,
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      {width}px — {label}
    </div>
  )
}