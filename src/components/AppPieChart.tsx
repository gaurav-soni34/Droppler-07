
"use client";

import * as React from "react";
import { useWaterLogs } from "@/lib/useWaterLogs";
import { useTheme } from "next-themes";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Light & Dark theme colors for pie segments
const COLORS_LIGHT = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
const COLORS_DARK = [
  "#60a5fa",
  "#fde68a",
  "#4ade80",
  "#fb923c",
  "#f472b6",
];

const chartConfig = {
  liters: { label: "Liters Saved/Wasted" },
} satisfies ChartConfig;

const AppPieChart = () => {
  const chartData = useWaterLogs(); // Realtime water logs
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = React.useState(COLORS_LIGHT);
  const [labelColor, setLabelColor] = React.useState("#000");

  React.useEffect(() => {
    if (resolvedTheme === "dark") {
      setColors(COLORS_DARK);
      setLabelColor("#fff");
    } else {
      setColors(COLORS_LIGHT);
      setLabelColor("#000");
    }
  }, [resolvedTheme]);

  if (!chartData || chartData.length === 0) {
    return <p>No water usage data yet.</p>;
  }

  const totalLiters = chartData.reduce((acc, curr) => acc + curr.liters, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Water Usage Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[500px] aspect-square"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="liters"
                nameKey="className"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={labelColor}
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="text-3xl font-bold"
                          >
                            {totalLiters.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="text-sm text-muted-foreground"
                          >
                            Liters
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col text-center gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month{" "}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total water usage for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppPieChart;
