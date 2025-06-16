"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCardProps } from "@/types";

export function AnalyticsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  children,
}: AnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span
              className={
                trend.isPositive === false
                  ? "text-red-600"
                  : trend.isPositive === true
                  ? "text-green-600"
                  : ""
              }
            >
              {trend.isPositive !== undefined && (trend.isPositive ? "+" : "")}
              {trend.value}%
            </span>{" "}
            {trend.label}
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
