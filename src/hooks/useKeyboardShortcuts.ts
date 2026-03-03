import { useEffect } from 'react'
import { useStore } from '../store/useStore'

// Bloomberg-style keyboard shortcuts — all use Alt modifier to avoid browser conflicts
// Alt+1-5: right panel tabs
// Alt+G:   toggle globe
// Alt+N/C/X/K/A: right panel tabs by letter
// Alt+R:   switch to Regime NEXUS sub-tab
// Alt+M:   switch to Monte Carlo
// Alt+E:   switch to Edge Playbook

export function useKeyboardShortcuts() {
  const setRightPanelTab = useStore((s) => s.setRightPanelTab)
  const setNexusSubTab   = useStore((s) => s.setNexusSubTab)
  const setShowGlobe     = useStore((s) => s.setShowGlobe)
  const showGlobe        = useStore((s) => s.showGlobe)

  useEffect(() => {
    const TAB_KEYS: Record<string, Parameters<typeof setRightPanelTab>[0]> = {
      '1': 'news',
      '2': 'country',
      '3': 'nexus',
      '4': 'chat',
      '5': 'alerts',
      'n': 'news',
      'c': 'country',
      'x': 'nexus',
      'k': 'chat',
      'a': 'alerts',
    }

    const NEXUS_KEYS: Record<string, string> = {
      'r': 'regime',
      'm': 'mc',
      'v': 'vol',
      'f': 'futures',
      'o': 'options',
      'y': 'yields',
      't': 'transmit',
      'h': 'checklist',
      'e': 'edge',
      'l': 'log',
      'p': 'portfolio',
      'd': 'calendar',
      's': 'research',
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      // Only fire on Alt+key, but not when focused on input/textarea/select
      if (!ev.altKey) return
      const tag = (ev.target as HTMLElement).tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return

      const k = ev.key.toLowerCase()

      if (TAB_KEYS[k]) {
        ev.preventDefault()
        setRightPanelTab(TAB_KEYS[k])
        // If switching to nexus panel, don't change sub-tab
      }

      if (ev.altKey && k === 'g') {
        ev.preventDefault()
        setShowGlobe(!showGlobe)
      }

      // Alt+Shift+key → NEXUS sub-tab
      if (ev.altKey && ev.shiftKey && NEXUS_KEYS[k]) {
        ev.preventDefault()
        setRightPanelTab('nexus')
        setNexusSubTab(NEXUS_KEYS[k])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setRightPanelTab, setNexusSubTab, setShowGlobe, showGlobe])
}
