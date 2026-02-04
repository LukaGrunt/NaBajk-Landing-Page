/**
 * GPX Parser Utility
 * Parses GPX files and calculates distance and elevation gain
 */

interface TrackPoint {
  lat: number
  lon: number
  ele: number | null
}

interface GpxParseResult {
  distance_km: number
  elevation_m: number
  trackPoints: TrackPoint[]
  error?: string
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Parse GPX XML content and extract track points
 */
function extractTrackPoints(gpxContent: string): TrackPoint[] {
  const points: TrackPoint[] = []

  // Parse track points from <trkpt> elements
  // GPX format: <trkpt lat="..." lon="..."><ele>...</ele></trkpt>
  const trkptRegex = /<trkpt[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/trkpt>/gi

  let match
  while ((match = trkptRegex.exec(gpxContent)) !== null) {
    const lat = parseFloat(match[1])
    const lon = parseFloat(match[2])
    const innerContent = match[3]

    // Extract elevation if present
    let ele: number | null = null
    const eleMatch = innerContent.match(/<ele>([^<]+)<\/ele>/i)
    if (eleMatch) {
      ele = parseFloat(eleMatch[1])
      if (isNaN(ele)) ele = null
    }

    if (!isNaN(lat) && !isNaN(lon)) {
      points.push({ lat, lon, ele })
    }
  }

  // Also try route points <rtept> if no track points found
  if (points.length === 0) {
    const rteptRegex = /<rtept[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/rtept>/gi

    while ((match = rteptRegex.exec(gpxContent)) !== null) {
      const lat = parseFloat(match[1])
      const lon = parseFloat(match[2])
      const innerContent = match[3]

      let ele: number | null = null
      const eleMatch = innerContent.match(/<ele>([^<]+)<\/ele>/i)
      if (eleMatch) {
        ele = parseFloat(eleMatch[1])
        if (isNaN(ele)) ele = null
      }

      if (!isNaN(lat) && !isNaN(lon)) {
        points.push({ lat, lon, ele })
      }
    }
  }

  return points
}

/**
 * Calculate total distance from track points
 * Returns distance in kilometers
 */
function calculateTotalDistance(points: TrackPoint[]): number {
  if (points.length < 2) return 0

  let totalDistance = 0
  for (let i = 1; i < points.length; i++) {
    totalDistance += haversineDistance(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    )
  }

  return totalDistance
}

/**
 * Calculate total elevation gain from track points
 * Only counts positive elevation changes (climbing)
 * Returns elevation in meters
 */
function calculateElevationGain(points: TrackPoint[]): number {
  if (points.length < 2) return 0

  let totalGain = 0
  let lastValidEle: number | null = null

  for (const point of points) {
    if (point.ele !== null) {
      if (lastValidEle !== null) {
        const diff = point.ele - lastValidEle
        if (diff > 0) {
          totalGain += diff
        }
      }
      lastValidEle = point.ele
    }
  }

  return totalGain
}

/**
 * Parse a GPX file content and return distance and elevation
 */
export function parseGpx(gpxContent: string): GpxParseResult {
  try {
    const trackPoints = extractTrackPoints(gpxContent)

    if (trackPoints.length === 0) {
      return {
        distance_km: 0,
        elevation_m: 0,
        trackPoints: [],
        error: 'No track points found in GPX file',
      }
    }

    const distance_km = calculateTotalDistance(trackPoints)
    const elevation_m = calculateElevationGain(trackPoints)

    return {
      distance_km: Math.round(distance_km * 100) / 100, // Round to 2 decimal places
      elevation_m: Math.round(elevation_m), // Round to whole meters
      trackPoints,
    }
  } catch (err) {
    return {
      distance_km: 0,
      elevation_m: 0,
      trackPoints: [],
      error: err instanceof Error ? err.message : 'Failed to parse GPX file',
    }
  }
}

/**
 * Read a GPX file and parse it
 */
export async function parseGpxFile(file: File): Promise<GpxParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      if (!content) {
        resolve({
          distance_km: 0,
          elevation_m: 0,
          trackPoints: [],
          error: 'Failed to read file',
        })
        return
      }
      resolve(parseGpx(content))
    }

    reader.onerror = () => {
      resolve({
        distance_km: 0,
        elevation_m: 0,
        trackPoints: [],
        error: 'Failed to read file',
      })
    }

    reader.readAsText(file)
  })
}
