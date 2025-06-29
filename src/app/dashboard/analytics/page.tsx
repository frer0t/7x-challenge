"use client";

import { Eye, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AnalyticsLoadingSkeleton } from "@/components/analytics/AnalyticsLoadingSkeleton";
import { demoAnalyticsData } from "@/components/analytics/demoData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "@/types";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchAnalytics();
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/habits/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <AnalyticsLoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Detailed Analytics */}
        {analyticsData || demoMode ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold mb-4">
                Analytics{" "}
                {demoMode && (
                  <span className="text-sm text-muted-foreground">
                    (Demo Data)
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
                <Button
                  onClick={() => setDemoMode(!demoMode)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {demoMode ? "Hide Demo" : "View Demo"}
                </Button>
              </div>
            </div>

            <AnalyticsDashboard
              data={demoMode ? demoAnalyticsData : analyticsData!}
            />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-4">
                <div className="text-muted-foreground">
                  No analytics data available yet. Start completing habits to
                  see detailed insights!
                </div>
                <Button onClick={() => setDemoMode(true)} variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
