/* eslint-disable @typescript-eslint/no-explicit-any */
// File: /app/admin/analytics/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Users, Globe } from "lucide-react";
import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Custom colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

type ProductDetails = {
  id: string;
  old_name: string;
  new_name: string;
  description: string;
  generated_link: string;
};

type ProductAnalytics = {
  totalClicks: number;
  uniqueVisitors: number;
  countries: { country: string; count: number }[];
  product?: ProductDetails;
  details?: any[];
};

export default function ProductAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/analytics/${id}?detailed=true`);
        setAnalytics(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalytics();
    }
  }, [id]);

  // Prepare data for country distribution pie chart
  const countryPieData =
    analytics?.countries.map((country) => ({
      name: country.country,
      value: country.count,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          {loading ? (
            <>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">
                {analytics?.product?.new_name ||
                  analytics?.product?.old_name ||
                  "Product Analytics"}
              </h1>
              <p className="text-muted-foreground">
                Detailed analytics and visitor statistics
              </p>
            </>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.totalClicks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All-time page views
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Unique Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.uniqueVisitors || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Distinct IP addresses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.countries.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Geographic reach
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geography Distribution</CardTitle>
                  <CardDescription>
                    Visitor breakdown by country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {countryPieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={countryPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {countryPieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No country data available yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visitor Engagement</CardTitle>
                  <CardDescription>
                    Views to unique visitor ratio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Views",
                            value: analytics?.totalClicks || 0,
                          },
                          {
                            name: "Unique Visitors",
                            value: analytics?.uniqueVisitors || 0,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="value"
                          fill="hsl(var(--primary))"
                          name="Count"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Details about this product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Original Name
                      </h3>
                      <p>{analytics?.product?.old_name || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        New Name
                      </h3>
                      <p>{analytics?.product?.new_name || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Generated Link
                    </h3>
                    <p className="break-all">
                      {analytics?.product?.generated_link || "N/A"}
                    </p>
                  </div>

                  {analytics?.product?.description && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </h3>
                      <p>{analytics?.product?.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    window.open(analytics?.product?.generated_link, "_blank")
                  }
                >
                  Visit Product Page
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>
                  Visitor distribution by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.countries && analytics.countries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium">
                            Country
                          </th>
                          <th className="text-right py-2 px-4 font-medium">
                            Visitors
                          </th>
                          <th className="text-right py-2 px-4 font-medium">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.countries.map((country, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-muted/20"
                          >
                            <td className="py-2 px-4">
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                {country.country}
                              </div>
                            </td>
                            <td className="text-right py-2 px-4">
                              {country.count}
                            </td>
                            <td className="text-right py-2 px-4">
                              {(
                                (country.count / analytics.uniqueVisitors) *
                                100
                              ).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No country data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
