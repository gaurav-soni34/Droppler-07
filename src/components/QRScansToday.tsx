

"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

const QRScansToday = () => {
  const [scanCount, setScanCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const logsRef = ref(rtdb, "logs");

    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setScanCount(0);
        return;
      }

      const logs = snapshot.val();
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

      let count = 0;
      Object.values(logs as any).forEach((students: any) => {
        Object.values(students).forEach((student: any) => {
          Object.values(student).forEach((log: any) => {
            if (log.timestamp >= startOfDay && log.timestamp < endOfDay) {
              count++;
            }
          });
        });
      });

      setScanCount(count);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Dynamic big number scaling
  const fontSizeClass =
    scanCount < 5
      ? "text-7xl sm:text-8xl"
      : scanCount < 10
      ? "text-8xl sm:text-9xl"
      : scanCount < 15
      ? "text-9xl sm:text-[9rem]"
      : "text-[9rem] sm:text-[10rem]";

  if (!mounted) {
    return (
      <Card className="w-full h-full flex flex-col justify-between text-center">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Total Scans Today
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-7xl sm:text-8xl font-bold text-gray-400">--</div>
        </CardContent>
        <div className="px-6 pb-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Realtime QR code scans will appear here as they are recorded
          throughout the day. Keep scanning to populate this dashboard metric.
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between text-center">
      {/* Title */}
      <CardHeader>
        <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Total Scans Today
        </CardTitle>
      </CardHeader>

      {/* Big Number */}
      <CardContent className="flex-1 flex items-center justify-center">
        <div
          className={`transition-all duration-500 ${fontSizeClass} font-extrabold tracking-tight leading-none ${
            resolvedTheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {scanCount}
        </div>
      </CardContent>

      {/* Description */}
      <div className="px-8 pb-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
        {scanCount === 0
          ? "No QR scans have been recorded so far today. Once students begin scanning, the live count will update instantly."
          : `A total of ${scanCount} QR scans have been logged today. This count updates automatically in real time as students across classes continue scanning.`}
      </div>
    </Card>
  );
};

export default QRScansToday;
