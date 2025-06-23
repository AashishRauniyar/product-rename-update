import axios from 'axios';
import NodeCache from 'node-cache';

// Cache IP lookup results to reduce API calls and improve performance
// Set TTL to 1 day (86400 seconds)
const geoCache = new NodeCache({ stdTTL: 86400 });

interface IpInfoResponse {
  ip: string;
  country: string;
  city?: string;
  region?: string;
}

/**
 * Get country information from an IP address
 * Uses free IP geolocation API with fallbacks
 */
export async function getIpInfo(ip: string): Promise<IpInfoResponse | null> {
  // Skip for localhost or invalid IPs
  if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || !ip) {
    return {
      ip,
      country: 'Local',
    };
  }
  
  // Check cache first
  const cachedResult = geoCache.get<IpInfoResponse>(ip);
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    // First try using ipapi.co (free tier - 1000 requests/day)
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    
    if (response.data && response.data.country_name) {
      const result: IpInfoResponse = {
        ip,
        country: response.data.country_name,
        city: response.data.city,
        region: response.data.region,
      };
      
      // Cache the result
      geoCache.set(ip, result);
      return result;
    }
  } catch (error) {
    console.warn(`First IP lookup service failed for ${ip}:`, error);
  }
  
  try {
    // Fallback to ip-api.com (free tier - 45 requests/minute)
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    
    if (response.data && response.data.country) {
      const result: IpInfoResponse = {
        ip,
        country: response.data.country,
        city: response.data.city,
        region: response.data.regionName,
      };
      
      // Cache the result
      geoCache.set(ip, result);
      return result;
    }
  } catch (error) {
    console.warn(`Second IP lookup service failed for ${ip}:`, error);
  }
  
  // Return unknown if all lookups fail
  const fallbackResult = {
    ip,
    country: 'Unknown',
  };
  
  // Still cache the failed result to prevent repeated API calls
  geoCache.set(ip, fallbackResult);
  return fallbackResult;
}

/**
 * Clear the geolocation cache (for testing purposes)
 */
export function clearGeoCache(): void {
  geoCache.flushAll();
}