// lib/useWaterLogs.ts
"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "./firebase";

export function useWaterLogs() {
  const [data, setData] = useState<{ className: string; liters: number }[]>([]);

  useEffect(() => {
    const logsRef = ref(rtdb, "logs");
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();

        // Convert nested logs into array for charts
        const chartData: { className: string; liters: number }[] = [];
        Object.entries(val ?? {}).forEach(([className, studentsObj]) => {
          let totalLiters = 0;
          if (typeof studentsObj !== "object" || studentsObj === null) return;
          Object.values(studentsObj as Record<string, unknown>).forEach((studentObj) => {
            if (typeof studentObj !== "object" || studentObj === null) return;
            Object.values(studentObj as Record<string, unknown>).forEach((log) => {
              if (!log || typeof log !== "object") return;
              const maybe = log as Record<string, unknown>;
              const liters = maybe["liters"];
              if (typeof liters === "number") totalLiters += liters;
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
