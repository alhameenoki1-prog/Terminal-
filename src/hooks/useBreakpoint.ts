import { useEffect, useState } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

function getBreakpoint(width: number): Breakpoint {
  if (width < 768)  return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() => getBreakpoint(window.innerWidth))

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? window.innerWidth
      setBp(getBreakpoint(width))
    })
    obs.observe(document.body)
    return () => obs.disconnect()
  }, [])

  return bp
}
