"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChartProps,
  BarChartProps,
  ChartContainerProps,
  LineChartProps,
  PieChartProps,
} from "@/types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ChartContainer({ title, children, description }: ChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BarChartCard({
  title,
  data,
  dataKey,
  xAxisKey,
  description,
  color = "#8884d8",
}: BarChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ChartContainer>
  );
}

export function PieChartCard({
  title,
  data,
  dataKey,
  description,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"],
}: PieChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ChartContainer>
  );
}

export function LineChartCard({
  title,
  data,
  dataKey,
  xAxisKey,
  description,
  color = "#8884d8",
}: LineChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={color} />
      </LineChart>
    </ChartContainer>
  );
}

export function AreaChartCard({
  title,
  data,
  dataKey,
  xAxisKey,
  description,
  color = "#8884d8",
}: AreaChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
      </AreaChart>
    </ChartContainer>
  );
}
