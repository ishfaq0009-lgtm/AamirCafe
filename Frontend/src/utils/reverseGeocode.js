/**
 * Reverse geocode — converts lat/lng to a full address using
 * OpenStreetMap Nominatim (free, no API key needed).
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AamirCafe-App/1.0',
        Accept: 'application/json',
      },
    })

    if (!res.ok) throw new Error('Reverse geocode failed')

    const data = await res.json()
    const a = data.address || {}

    // Build street from house number + road
    const streetParts = []
    if (a.house_number) streetParts.push(a.house_number)
    if (a.road || a.street || a.pedestrian) {
      streetParts.push(a.road || a.street || a.pedestrian)
    }
    if (streetParts.length === 0 && (a.neighbourhood || a.suburb)) {
      streetParts.push(a.neighbourhood || a.suburb)
    }

    const street = streetParts.join(' ')

    // City — try multiple fallbacks
    const city =
      a.city ||
      a.town ||
      a.village ||
      a.municipality ||
      a.county ||
      a.state_district ||
      ''

    // Zip / postcode
    const zipCode = a.postcode || ''

    return {
      street: street || '',
      city: city || '',
      zipCode: zipCode || '',
      fullAddress: data.display_name || '',
    }
  } catch (err) {
    console.error('Reverse geocode error:', err)
    return null
  }
}