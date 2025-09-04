
"use client";

import { useEffect, useState } from "react";
import { useWaterLogs } from "@/lib/useWaterLogs";
import { useTheme } from "next-themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const chartConfig = {
  liters: {
    label: "Liters Saved (Actual)",
    color: "#2563eb", // blue
  },
  projection: {
    label: "Projected Liters",
    color: "#22c55e", // green
  },
} satisfies ChartConfig;

const FutureImpact = () => {
  const chartData = useWaterLogs();
  const { resolvedTheme } = useTheme();
  const [labelColor, setLabelColor] = useState("#000");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLabelColor(resolvedTheme === "dark" ? "#fff" : "#000");
  }, [resolvedTheme]);

  if (!mounted) {
    return (
      <Card className="w-full min-h-[460px] flex flex-col justify-between text-center">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Future Impact Projection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-5xl sm:text-6xl font-bold text-gray-400">
            --
          </div>
        </CardContent>
        <div className="px-6 pb-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Projected water savings will appear here once data is recorded.
        </div>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="w-full h-full flex flex-col justify-between text-center">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Future Impact Projection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-5xl sm:text-6xl font-bold text-gray-400">
            No Data
          </div>
        </CardContent>
        <div className="px-6 pb-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Once water saving logs are recorded, your future impact projection will
          update in real time.
        </div>
      </Card>
    );
  }

  // ✅ Calculate projection
  const totalSaved = chartData.reduce((sum, item) => sum + item.liters, 0);
  const daysSoFar = new Date().getDate();
  const totalDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const avgDaily = totalSaved / daysSoFar;
  const projection = Math.round(avgDaily * totalDays);

  // ✅ Chart Data
  const lineData = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    return {
      day: `Day ${day}`,
      actual:
        day <= daysSoFar ? Math.round((totalSaved / daysSoFar) * day) : null,
      projection: Math.round(avgDaily * day),
    };
  });

  return (
    <Card className="w-full h-full flex flex-col justify-between text-center">
      {/* Title */}
      <CardHeader>
        <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Future Impact Projection
        </CardTitle>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="w-full h-[260px] sm:h-[320px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={resolvedTheme === "dark" ? "#333" : "#e0e0e0"}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  stroke={labelColor}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  stroke={labelColor}
                />
                <ChartTooltip content={<ChartTooltipContent />} />

                {/* Actual Line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke={chartConfig.liters.color}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Actual Saved"
                />

                {/* Projection Line */}
                <Line
                  type="monotone"
                  dataKey="projection"
                  stroke={chartConfig.projection.color}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Projected"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>

      {/* Description */}
      <div className="px-8 pb-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
        At this pace, you’ll save around{" "}
        <b className="font-semibold">{projection}L</b> of water by the end of
        this month.  
        (Avg {avgDaily.toFixed(1)} L/day over {daysSoFar} days)
      </div>
    </Card>
  );
};

export default FutureImpact;

