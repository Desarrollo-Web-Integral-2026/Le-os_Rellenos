import { useEffect, useState } from 'react'
import { getBusinessStatus } from '../utils/businessStatus'
import type { BusinessStatus } from '../utils/businessStatus'

// Revisa el estado cada minuto — suficiente para un indicador de horario,
// sin necesidad de polling agresivo como en RF4 (stock).
const CHECK_INTERVAL_MS = 60_000

export function useBusinessStatus(): BusinessStatus {
  const [status, setStatus] = useState<BusinessStatus>(() => getBusinessStatus())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStatus(getBusinessStatus())
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [])

  return status
}