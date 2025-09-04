
"use client";

import { useWaterLogs } from "@/lib/useWaterLogs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  liters: {
    label: "Liters Saved/Wasted",
    color: "#2563eb", // same blue as AppBarChart
  },
} satisfies ChartConfig;

const ChartArea = () => {
  const logs = useWaterLogs(); // realtime data
  const { resolvedTheme } = useTheme();
  const [labelColor, setLabelColor] = useState("#000");

  useEffect(() => {
    setLabelColor(resolvedTheme === "dark" ? "#fff" : "#000");
  }, [resolvedTheme]);

  const chartData = logs
    ? logs.map((log) => ({
        className: log.className || "Class",
        liters: log.liters || 0, // liters saved/wasted
      }))
    : [];

  if (!chartData.length) return <p>No water usage data yet.</p>;

  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg shadow-md w-full">
      <h1 className="mb-6 text-xl font-semibold">💧 Water Saved by Classes</h1>
      <ChartContainer config={chartConfig} className="min-h-[500px] w-full">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} stroke={resolvedTheme === "dark" ? "#333" : "#e0e0e0"} />
            <XAxis
              dataKey="className"
              tickLine={false}
              tickMargin={10}
              stroke={resolvedTheme === "dark" ? "#fff" : "#000"}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              stroke={resolvedTheme === "dark" ? "#fff" : "#000"}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Area
              dataKey="liters"
              type="natural"
              fill={chartConfig.liters.color}
              stroke={chartConfig.liters.color}
              fillOpacity={0.4}
            >
              <LabelList dataKey="liters" position="top" fill={labelColor} fontSize={12} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ChartArea;






