// File: /app/admin/analytics/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { GlobalAnalytics } from "@/components/analytics/Dashboard";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive view of all product performance
          </p>
        </div>

        <GlobalAnalytics />
      </main>
    </div>
  );
}
