/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RowDataPacket } from "mysql2/promise";
import db from "./db"; // Adjust the import path as necessary

// Interface for visit data
export interface VisitData extends RowDataPacket {
  id: number;
  product_id: string;
  ip_address: string;
  country: string;
  visit_date: Date;
}

// Interface for visit statistics
export interface VisitStats {
  totalClicks: number;
  uniqueVisitors: number;
  countries: CountryCount[];
}

// Interface for country breakdown
export interface CountryCount {
  country: string;
  count: number;
}

/**
 * Record a visit to a product page
 * Increments total_clicks counter and records unique visitor if IP is new
 */
export async function recordVisit(
  productId: string,
  ipAddress: string,
  country?: string
): Promise<boolean> {
  try {
    // First, increment the total_clicks counter
    await db.query(
      "UPDATE products SET total_clicks = total_clicks + 1 WHERE id = ?",
      [productId]
    );

    // Get country information based on IP if not provided
    let visitorCountry = country;
    if (!visitorCountry) {
      try {
        const { getIpInfo } = await import('./geoLocationService');
        const geoInfo = await getIpInfo(ipAddress);
        visitorCountry = geoInfo?.country || "Unknown";
      } catch (geoError) {
        console.error("❌ Error getting geolocation data:", geoError);
        visitorCountry = "Unknown";
      }
    }

    // Then try to insert a new record for this IP
    // If the IP already exists for this product, this will fail due to UNIQUE constraint
    // That's okay - we only want to count unique IPs
    try {
      await db.query(
        "INSERT INTO visit_stats (product_id, ip_address, country) VALUES (?, ?, ?)",
        [productId, ipAddress, visitorCountry]
      );
    } catch (uniqueError) {
      // Silently ignore unique constraint violations
      // This means this IP has already been counted
    }

    return true;
  } catch (error) {
    console.error("❌ Error recording visit:", error);
    throw error;
  }
}

/**
 * Get visit statistics for a product
 * Returns total clicks, unique visitors, and country breakdown
 */
export async function getVisitStats(productId: string): Promise<VisitStats> {
  try {
    // Get total clicks
    const [clickRows] = (await db.query(
      "SELECT total_clicks FROM products WHERE id = ?",
      [productId]
    )) as [RowDataPacket[], any];

    // Get unique visitors count
    const [uniqueRows] = (await db.query(
      "SELECT COUNT(*) as unique_visitors FROM visit_stats WHERE product_id = ?",
      [productId]
    )) as [RowDataPacket[], any];

    // Get country breakdown
    const [countryRows] = (await db.query(
      "SELECT country, COUNT(*) as count FROM visit_stats WHERE product_id = ? GROUP BY country ORDER BY count DESC",
      [productId]
    )) as [RowDataPacket[], any];

    return {
      totalClicks: clickRows[0]?.total_clicks || 0,
      uniqueVisitors: uniqueRows[0]?.unique_visitors || 0,
      countries: countryRows as CountryCount[],
    };
  } catch (error) {
    console.error("❌ Error getting visit stats:", error);
    throw error;
  }
}

/**
 * Get all visits for a product
 * Useful for detailed analytics
 */
export async function getVisitDetails(productId: string): Promise<VisitData[]> {
  try {
    const [rows] = (await db.query(
      "SELECT * FROM visit_stats WHERE product_id = ? ORDER BY visit_date DESC",
      [productId]
    )) as [RowDataPacket[], any];

    return rows as VisitData[];
  } catch (error) {
    console.error("❌ Error getting visit details:", error);
    throw error;
  }
}

/**
 * Get global visit statistics
 * Useful for admin dashboard
 */
export async function getGlobalVisitStats(): Promise<{
  totalProducts: number;
  totalClicks: number;
  totalUniqueVisitors: number;
  topCountries: CountryCount[];
}> {
  try {
    // Get total products count
    const [productRows] = (await db.query(
      "SELECT COUNT(*) as count FROM products"
    )) as [RowDataPacket[], any];

    // Get sum of all clicks
    const [clickRows] = (await db.query(
      "SELECT SUM(total_clicks) as total FROM products"
    )) as [RowDataPacket[], any];

    // Get unique visitors count
    const [uniqueRows] = (await db.query(
      "SELECT COUNT(DISTINCT ip_address) as count FROM visit_stats"
    )) as [RowDataPacket[], any];

    // Get top 10 countries
    const [countryRows] = (await db.query(
      "SELECT country, COUNT(*) as count FROM visit_stats GROUP BY country ORDER BY count DESC LIMIT 10"
    )) as [RowDataPacket[], any];

    return {
      totalProducts: productRows[0]?.count || 0,
      totalClicks: clickRows[0]?.total || 0,
      totalUniqueVisitors: uniqueRows[0]?.count || 0,
      topCountries: countryRows as CountryCount[],
    };
  } catch (error) {
    console.error("❌ Error getting global visit stats:", error);
    throw error;
  }
}
