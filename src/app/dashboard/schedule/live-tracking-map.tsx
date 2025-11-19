"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface LiveTrackingMapProps {
  serviceLatitude?: number | null
  serviceLongitude?: number | null
  technicianLatitude: number
  technicianLongitude: number
}

export function LiveTrackingMap({
  serviceLatitude,
  serviceLongitude,
  technicianLatitude,
  technicianLongitude,
}: LiveTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const techMarkerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return
    }

    if (!containerRef.current) return

    const loader = new Loader({
      apiKey,
      version: "weekly",
    })

    let cancelled = false

    loader.load().then(() => {
      if (cancelled || !containerRef.current) return

      const hasServiceLocation =
        typeof serviceLatitude === "number" && typeof serviceLongitude === "number"
      const servicePosition = hasServiceLocation
        ? new google.maps.LatLng(serviceLatitude, serviceLongitude)
        : null
      const techPosition = new google.maps.LatLng(technicianLatitude, technicianLongitude)

      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(containerRef.current, {
          center: techPosition,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
        })

        // Customer / service marker
        if (servicePosition) {
          new google.maps.Marker({
            position: servicePosition,
            map: mapRef.current,
            title: "Service Location",
          })
        }

        // Technician marker
        techMarkerRef.current = new google.maps.Marker({
          position: techPosition,
          map: mapRef.current,
          title: "Technician",
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            strokeColor: "#f97316",
          },
        })

        // Fit both points
        const bounds = new google.maps.LatLngBounds()
        bounds.extend(techPosition)
        if (servicePosition) {
          bounds.extend(servicePosition)
        }
        mapRef.current.fitBounds(bounds)
      } else if (techMarkerRef.current) {
        // Update technician marker position
        techMarkerRef.current.setPosition(techPosition)
      }
    })

    return () => {
      cancelled = true
    }
  }, [serviceLatitude, serviceLongitude, technicianLatitude, technicianLongitude])

  return (
    <div
      ref={containerRef}
      className="h-64 w-full overflow-hidden rounded-2xl border border-sky-100"
    />
  )
}
