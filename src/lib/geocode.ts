const GOOGLE_GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

type GeocodeAddressInput = {
  street: string
  city: string
  state: string
  zipCode: string
}

export async function geocodeAddress(input: GeocodeAddressInput): Promise<{ latitude: number; longitude: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.warn('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, skipping geocoding.')
    return null
  }

  const address = `${input.street}, ${input.city}, ${input.state} ${input.zipCode}`
  const url = `${GOOGLE_GEOCODE_ENDPOINT}?address=${encodeURIComponent(address)}&key=${apiKey}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn('Geocode request failed:', response.status, await response.text())
      return null
    }

    const payload = (await response.json()) as {
      status?: string
      results?: Array<{ geometry?: { location?: { lat?: number; lng?: number } } }>
    }

    if (payload.status !== 'OK' || !payload.results?.length) {
      console.warn('Geocode returned no results:', payload.status)
      return null
    }

    const location = payload.results[0]?.geometry?.location
    if (typeof location?.lat !== 'number' || typeof location?.lng !== 'number') {
      return null
    }

    return {
      latitude: location.lat,
      longitude: location.lng,
    }
  } catch (error) {
    console.warn('Geocode lookup failed:', error)
    return null
  }
}
