// File: /components/analytics/Dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface VisitStats {
  totalClicks: number;
  uniqueVisitors: number;
  countries: { country: string; count: number }[];
}

interface GlobalStats extends VisitStats {
  totalProducts: number;
  topCountries: { country: string; count: number }[];
  products: {
    id: string;
    old_name: string;
    new_name: string;
    generated_link: string;
    total_clicks: number;
  }[];
}

export const ProductAnalytics: React.FC<{ productId: string }> = ({
  productId,
}) => {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await axios.get(`/api/analytics/${productId}`);
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [productId]);

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!stats) return <div className="p-4">No data available</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Product Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Engagement</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">{stats.totalClicks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unique Visitors</p>
              <p className="text-2xl font-bold">{stats.uniqueVisitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Top Countries</h3>
          {stats.countries.length > 0 ? (
            <ul className="space-y-2">
              {stats.countries.slice(0, 5).map((country, index) => (
                <li key={index} className="flex justify-between">
                  <span>{country.country}</span>
                  <span className="font-medium">{country.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No country data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const GlobalAnalytics: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        setLoading(true);
        const response = await axios.get("/api/analytics?sort=clicks");
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load global analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalStats();
  }, []);

  if (loading) return <div className="p-4">Loading global analytics...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!stats) return <div className="p-4">No data available</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Global Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-2xl font-bold">{stats.totalClicks}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Unique Visitors</p>
            <p className="text-2xl font-bold">{stats.uniqueVisitors}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Top Countries</h3>
            {stats.topCountries.length > 0 ? (
              <ul className="bg-gray-50 p-4 rounded-lg divide-y">
                {stats.topCountries.map((country, index) => (
                  <li key={index} className="flex justify-between py-2">
                    <span>{country.country}</span>
                    <span className="font-medium">{country.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No country data available</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Most Viewed Products</h3>
            {stats.products.length > 0 ? (
              <ul className="bg-gray-50 p-4 rounded-lg divide-y">
                {stats.products.slice(0, 5).map((product) => (
                  <li key={product.id} className="py-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{product.new_name}</span>
                      <span>{product.total_clicks} views</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {product.generated_link}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No products available</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Old Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.new_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.old_name}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={product.generated_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate block max-w-xs"
                    >
                      {product.generated_link}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.total_clicks}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={`/admin/products/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </a>
                    <a
                      href={`/admin/analytics/${product.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
