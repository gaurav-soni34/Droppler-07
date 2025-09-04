// "use client";

// import { useEffect, useState } from "react";
// import { ref, onValue } from "firebase/database";
// import { rtdb } from "@/lib/firebase";
// import { useTheme } from "next-themes";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";

// // ✅ Conversion factors
// const BOTTLE_CAPACITY = 1; // 1L per bottle
// const LITERS_PER_PERSON = 7.5; // avg daily drinking water per person

// export default function EnvironmentalImpact() {
//   const [savedLiters, setSavedLiters] = useState(0);
//   const [mounted, setMounted] = useState(false);
//   const { resolvedTheme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // ✅ Fetch realtime saved liters
//   useEffect(() => {
//     const logsRef = ref(rtdb, "logs");
//     const unsubscribe = onValue(logsRef, (snapshot) => {
//       if (!snapshot.exists()) {
//         setSavedLiters(0);
//         return;
//       }

//       const logs = snapshot.val();
//       let total = 0;

//       Object.values(logs as any).forEach((students: any) => {
//         Object.values(students).forEach((student: any) => {
//           Object.values(student).forEach((log: any) => {
//             // only count positive liters = saved
//             if (log.liters > 0) {
//               total += log.liters;
//             }
//           });
//         });
//       });

//       setSavedLiters(total);
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ Derived equivalents
//   const bottles = savedLiters / BOTTLE_CAPACITY;
//   const people = savedLiters / LITERS_PER_PERSON;

//   const chartData = [
//     { name: "Water Bottles", value: bottles },
//     { name: "People/Day", value: people },
//   ];

//   const COLORS =
//     resolvedTheme === "dark"
//       ? ["#60A5FA", "#34D399"]
//       : ["#2563EB", "#059669"];

//   if (!mounted) {
//     return (
//       <Card className="w-full h-full flex flex-col justify-between text-center">
//         <CardHeader>
//           <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
//             🌍 Environmental Impact
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="flex-1 flex flex-col items-center justify-center">
//           <p className="text-muted-foreground">Loading impact...</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full h-full flex flex-col justify-between">
//       <CardHeader>
//         <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center">
//            Environmental Impact..!
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="flex-1 flex flex-col items-center justify-center">
//         <ResponsiveContainer width="100%" height={250}>
//           <PieChart>
//             <Pie
//               data={chartData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={90}
//               fill="#8884d8"
//               label
//             >
//               {chartData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>

//         {/* Small description */}
//         <div className="mt-4 text-center text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
//           So far, <span className="font-semibold">{savedLiters} liters</span> of
//           water have been saved.  
//           That’s like filling{" "}
//           <span className="font-semibold">{Math.round(bottles)} bottles</span>{" "}
//           or providing daily drinking water for{" "}
//           <span className="font-semibold">{Math.round(people)} people</span>.
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

// ✅ Conversion factors
const BOTTLE_CAPACITY = 1; // 1L per bottle
const LITERS_PER_PERSON = 7.5; // avg daily drinking water per person

export default function EnvironmentalImpact() {
  const [savedLiters, setSavedLiters] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch realtime saved liters
  useEffect(() => {
    const logsRef = ref(rtdb, "logs");
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSavedLiters(0);
        return;
      }

      const logs = snapshot.val();
      let total = 0;

      Object.values(logs as any).forEach((students: any) => {
        Object.values(students).forEach((student: any) => {
          Object.values(student).forEach((log: any) => {
            // only count positive liters = saved
            if (log.liters > 0) {
              total += log.liters;
            }
          });
        });
      });

      setSavedLiters(total);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Derived equivalents
  const bottles = savedLiters / BOTTLE_CAPACITY;
  const people = savedLiters / LITERS_PER_PERSON;

  const chartData = [
    { name: "Water Bottles", value: bottles },
    { name: "People/Day", value: people },
  ];

  const COLORS =
    resolvedTheme === "dark"
      ? ["#60A5FA", "#34D399"]
      : ["#2563EB", "#059669"];

  if (!mounted) {
    return (
      <Card className="w-full min-h-[500px] flex flex-col justify-between text-center">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            🌍 Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <p className="text-muted-foreground">Loading impact...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center">
        Environmental Impact..!
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              activeIndex={activeIndex ?? undefined}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={resolvedTheme === "dark" ? "#111827" : "#fff"}
                  strokeWidth={activeIndex === index ? 4 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${Math.round(Number(value))}`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Small description */}
        <div className="mt-4 text-center text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
          So far, <span className="font-semibold">{savedLiters} liters</span> of
          water have been saved.  
          That’s like filling{" "}
          <span className="font-semibold">{Math.round(bottles)} bottles</span>{" "}
          or providing daily drinking water for{" "}
          <span className="font-semibold">{Math.round(people)} people</span>.
        </div>
      </CardContent>
    </Card>
  );
}


