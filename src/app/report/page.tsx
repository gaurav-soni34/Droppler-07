"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { addWaterLog } from "@/lib/firebaseLogs";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

type Action = { label: string; liters: number };

const categories: { heading: string; actions: Action[] }[] = [
  {
    heading: "💧 Water Usage",
    actions: [
      { label: "Drank Water (+1L)", liters: 1 },
      { label: "Washroom (+1L)", liters: 1 },
    ],
  },
  {
    heading: "🚰 Report Issues",
    actions: [
      { label: "Leaking Tap (+10L Saved)", liters: 10 },
      { label: "Overflow in Tank (+5L Saved)", liters: 5 },
      { label: "Washroom Waste (+5L Saved)", liters: 5 },
    ],
  },
  {
    heading: "✅ Positive Actions",
    actions: [
      { label: "Brought Personal Bottle (+2L Saved)", liters: 2 },
      { label: "Used Refill Station (+2L Saved)", liters: 2 },
    ],
  },
];

type Student = {
  id: string;
  name?: string;
  class?: string;
} & Record<string, unknown>;

export default function ReportPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const [student, setStudent] = useState<Student | null>(null);

  // ✅ Fetch student info
  useEffect(() => {
    if (!studentId) return;

    const studentRef = ref(rtdb, `students/${studentId}`);
    get(studentRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setStudent({ id: studentId, ...snapshot.val() });
        } else {
          setStudent(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching student:", err);
        setStudent(null);
      });
  }, [studentId]);

  // ✅ Send event to n8n webhook
  // const sendToN8n = async (actionLabel: string, studentName: string) => {
  //   try {
  //     await fetch("https://arflux.app.n8n.cloud/webhook-test/99e2942e-7786-4b20-bea6-9cfab5cc1f66", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         message: `🚨 Issue reported: ${actionLabel}`,
  //         student: studentName,
  //         timestamp: new Date().toISOString(),
  //       }),
  //     });
  //   } catch (err) {
  //     console.error("❌ Failed to send data to n8n:", err);
  //   }
  // };

  const sendToN8n = async (actionLabel: string, studentName: string) => {
    try {
      await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `🚨 Issue reported: ${actionLabel}`,
          student: studentName,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("❌ Failed to send data to n8n:", err);
    }
  };

  const handleAction = async (action: Action, category: string) => {
    if (!student) return;

    // runtime guards because realtime snapshot may be partial
    if (!student.id || !student.class) {
      console.error("Student object missing id or class:", student);
      alert("❌ Unable to log action: missing student metadata.");
      return;
    }

    try {
      await addWaterLog(
        String(student.class),
        String(student.id),
        action.liters,
        action.label,
      );

      // ✅ If it's under "Report Issues", also send to n8n
      if (category === "🚰 Report Issues") {
        await sendToN8n(action.label, String(student.name ?? "Unknown"));
      }

      alert(`✅ ${action.label} logged for ${student.name ?? student.id}`);
    } catch (err) {
      console.error("Failed to log action:", err);
      alert("❌ Failed to log action. Check console.");
    }
  };

  if (!studentId) return <p className="p-6">❌ Invalid student QR</p>;
  if (!student) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📱 Report Water Usage</h1>
      <h2 className="font-semibold mb-4">
        {student.name} ({student.class})
      </h2>

      {categories.map((cat) => (
        <div key={cat.heading} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{cat.heading}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cat.actions.map((action) => (
              <button
                key={action.label}
                className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleAction(action, cat.heading)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
