
// "use client";

// import {
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart";
// import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"; 
// import { useWaterLogs } from "@/lib/useWaterLogs";

// const chartConfig = {
//   liters: {
//     label: "Liters Saved/Wasted",
//     color: "#2563eb",
//   },
// } satisfies ChartConfig;

// const AppBarChart = () => {
//   const chartData = useWaterLogs();

//   if (!chartData || chartData.length === 0) {
//     return <p>No water usage data yet.</p>;
//   }

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h1 className="mb-6 text-xl font-semibold">💧 Water Saved by Classes</h1>
//       <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
//         <BarChart width={600} height={300} data={chartData}>
//           <CartesianGrid vertical={false} stroke="#e0e0e0" />
//           <XAxis dataKey="className" tickLine={false} tickMargin={10} />
//           <YAxis tickLine={false} tickMargin={10} />
//           <ChartTooltip content={<ChartTooltipContent />} />
//           <ChartLegend content={<ChartLegendContent />} />
          
//           <Bar dataKey="liters" fill={chartConfig.liters.color} radius={[6, 6, 0, 0]}>
//             {/* 🔥 Bar ke upar liters label */}
//             <LabelList dataKey="liters" position="top" fill="#333" fontSize={12} />
//           </Bar>
//         </BarChart>
//       </ChartContainer>
//     </div>
//   );
// };

// export default AppBarChart;

//responsive 
// "use client";

// import {
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart";
// import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts"; 
// import { useWaterLogs } from "@/lib/useWaterLogs";

// const chartConfig = {
//   liters: {
//     label: "Liters Saved/Wasted",
//     color: "#2563eb",
//   },
// } satisfies ChartConfig;

// const AppBarChart = () => {
//   const chartData = useWaterLogs();

//   if (!chartData || chartData.length === 0) {
//     return <p>No water usage data yet.</p>;
//   }

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md w-full">
//       <h1 className="mb-6 text-xl font-semibold">💧 Water Saved by Classes</h1>
//       <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
//         {/* ✅ Responsive container */}
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <CartesianGrid vertical={false} stroke="#e0e0e0" />
//             <XAxis dataKey="className" tickLine={false} tickMargin={10} />
//             <YAxis tickLine={false} tickMargin={10} />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <ChartLegend content={<ChartLegendContent />} />
            
//             <Bar dataKey="liters" fill={chartConfig.liters.color} radius={[6, 6, 0, 0]}>
//               {/* 🔥 Bar ke upar liters label */}
//               <LabelList dataKey="liters" position="top" fill="#333" fontSize={12} />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </ChartContainer>
//     </div>
//   );
// };

// export default AppBarChart;


// RESPONSIVE PLUS DARK MODE

"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts"; 
import { useWaterLogs } from "@/lib/useWaterLogs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const chartConfig = {
  liters: {
    label: "Liters Saved/Wasted",
    color: "#2563eb", // Blue bar
  },
} satisfies ChartConfig;

const AppBarChart = () => {
  const chartData = useWaterLogs();
  const { resolvedTheme } = useTheme();
  const [labelColor, setLabelColor] = useState("#000");

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setLabelColor("#fff");
    } else {
      setLabelColor("#000");
    }
  }, [resolvedTheme]);

  if (!chartData || chartData.length === 0) {
    return <p>No water usage data yet.</p>;
  }

  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg shadow-md w-full">
      <h1 className="mb-6 text-xl font-semibold">💧 Water Saved by Classes</h1>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
            
            <Bar dataKey="liters" fill={chartConfig.liters.color} radius={[6, 6, 0, 0]}>
              <LabelList 
                dataKey="liters" 
                position="top" 
                fill={labelColor} 
                fontSize={12} 
                //formatter={(value) => value + "+"} // 1+, 2+
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;
