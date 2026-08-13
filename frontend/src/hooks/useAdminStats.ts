import { useEffect, useState } from 'react'
import type { DashboardStats, RecentOrderSummary } from '../types/admin'
import { getDashboardStats, getRecentOrders } from '../services/api/adminStats'

const POLL_INTERVAL_MS = 15_000 // "tiempo real o al refrescar" — criterio de RF6

interface UseAdminStatsResult {
  stats: DashboardStats | null
  recentOrders: RecentOrderSummary[]
  isLoading: boolean
  error: string | null
}

export function useAdminStats(): UseAdminStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function fetchData(isInitial: boolean) {
      if (isInitial) setIsLoading(true)
      try {
        const [statsData, ordersData] = await Promise.all([getDashboardStats(), getRecentOrders()])
        if (!isActive) return
        setStats(statsData)
        setRecentOrders(ordersData)
        setError(null)
      } catch {
        if (!isActive) return
        if (isInitial) setError('No se pudo cargar la información del panel. Intenta de nuevo.')
      } finally {
        if (isInitial && isActive) setIsLoading(false)
      }
    }

    fetchData(true)
    const intervalId = setInterval(() => fetchData(false), POLL_INTERVAL_MS)

    return () => {
      isActive = false
      clearInterval(intervalId)
    }
  }, [])

  return { stats, recentOrders, isLoading, error }
}