import { useState } from 'react'

/**
 * Manages showSupports / showOpposes toggles and derives the ToggleButtonGroup value
 * and change handler — shared between PersonalidadeGraph and Explorar.
 */
export function useRelTypeToggle() {
  const [showSupports, setShowSupports] = useState(true)
  const [showOpposes, setShowOpposes] = useState(true)

  const relTypeValue = [
    ...(showSupports ? ['supports'] : []),
    ...(showOpposes ? ['opposes'] : []),
  ]

  const handleRelTypeChange = (_, newValue) => {
    if (!newValue || newValue.length === 0) return
    setShowSupports(newValue.includes('supports'))
    setShowOpposes(newValue.includes('opposes'))
  }

  return { showSupports, setShowSupports, showOpposes, setShowOpposes, relTypeValue, handleRelTypeChange }
}
