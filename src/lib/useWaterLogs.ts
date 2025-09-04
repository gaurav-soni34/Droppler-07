// lib/useWaterLogs.ts
"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "./firebase";

export function useWaterLogs() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const logsRef = ref(rtdb, "logs");
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();

        // Convert nested logs into array for charts
        const chartData: any[] = [];
        Object.entries(val).forEach(([className, students]) => {
          let totalLiters = 0;
          Object.values(students as any).forEach((student: any) => {
            Object.values(student as any).forEach((log: any) => {
              totalLiters += log.liters;
            });
          });
          chartData.push({
            className,
            liters: totalLiters,
          });
        });

        setData(chartData);
      } else {
        setData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return data;
}
