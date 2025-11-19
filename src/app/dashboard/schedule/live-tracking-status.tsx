"use client"

import { useEffect, useMemo, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"

interface LiveTrackingStatusProps {
  appointmentId: string
}

interface LiveTrackingState {
  technicianLatitude: number | null
  technicianLongitude: number | null
  status: string | null
  lastUpdated: Date | null
}

export function LiveTrackingStatus({ appointmentId }: LiveTrackingStatusProps) {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const [state, setState] = useState<LiveTrackingState>({
    technicianLatitude: null,
    technicianLongitude: null,
    status: null,
    lastUpdated: null,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchOnce = async () => {
      try {
        const { data, error } = await supabase
          .from("service_appointments")
          .select("status, technician_latitude, technician_longitude")
          .eq("id", appointmentId)
          .maybeSingle()

        if (error) {
          console.warn("Failed to fetch live tracking data:", error.message)
          if (!cancelled) setError("Unable to update technician location right now.")
          return
        }

        if (!data || cancelled) return

        const status = data.status as string | null
        const technicianLatitude =
          typeof data.technician_latitude === "number" ? data.technician_latitude : null
        const technicianLongitude =
          typeof data.technician_longitude === "number" ? data.technician_longitude : null

        setState({
          technicianLatitude,
          technicianLongitude,
          status,
          lastUpdated: new Date(),
        })
        setError(null)
      } catch (fetchError: any) {
        console.warn("Unexpected error fetching live tracking data:", fetchError)
        if (!cancelled) setError("Unable to update technician location right now.")
      }
    }

    // Initial fetch
    fetchOnce()

    // Poll every 5 seconds while mounted
    const interval = setInterval(fetchOnce, 5000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [appointmentId, supabase])

  if (error) {
    return (
      <p className="text-xs text-rose-700">
        {error}
      </p>
    )
  }

  if (!state.status) {
    return (
      <p className="text-xs text-sky-900/80">
        Checking for technician location…
      </p>
    )
  }

  if (state.technicianLatitude == null || state.technicianLongitude == null) {
    return (
      <p className="text-xs text-sky-900/80">
        Technician is {state.status.toLowerCase().replace("_", " ")}. Location will appear here once their GPS is
        available.
      </p>
    )
  }

  return (
    <div className="space-y-1 text-xs text-sky-900/90">
      <p>
        Technician is <span className="font-semibold">{state.status.toLowerCase().replace("_", " ")}</span>.
      </p>
      <p>
        Latest coordinates:{" "}
        <span className="font-mono">
          {state.technicianLatitude.toFixed(5)}, {state.technicianLongitude.toFixed(5)}
        </span>
      </p>
      {state.lastUpdated && (
        <p className="text-sky-900/70">
          Last update at{" "}
          {state.lastUpdated.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      )}
    </div>
  )
}

