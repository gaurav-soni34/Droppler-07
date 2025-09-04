

// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { addWaterLog } from "@/lib/firebaseLogs";
// import { rtdb } from "@/lib/firebase";
// import { ref, get } from "firebase/database";

// const categories = [
//   {
//     heading: "💧 Water Usage",
//     actions: [
//       { label: "Drank Water (+1L)", liters: 1 },
//       { label: "Washroom (+1L)", liters: 1 },
//     ],
//   },
//   {
//     heading: "🚰 Report Issues",
//     actions: [
//       { label: "Leaking Tap (+10L Saved)", liters: 10 },
//       { label: "Overflow in Tank (+5L Saved)", liters: 5 },
//       { label: "Washroom Waste (+5L Saved)", liters: 5 },
//     ],
//   },
//   {
//     heading: "✅ Positive Actions",
//     actions: [
//       { label: "Brought Personal Bottle (+2L Saved)", liters: 2 },
//       { label: "Used Refill Station (+2L Saved)", liters: 2 },
//     ],
//   },
// ];

// export default function ReportPage() {
//   const searchParams = useSearchParams();
//   const studentId = searchParams.get("studentId");

//   const [student, setStudent] = useState<any>(null);

//   // ✅ Fetch student info
//   useEffect(() => {
//     if (!studentId) return;

//     const studentRef = ref(rtdb, `students/${studentId}`);
//     get(studentRef)
//       .then((snapshot) => {
//         if (snapshot.exists()) {
//           setStudent({ id: studentId, ...snapshot.val() });
//         } else {
//           setStudent(null);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching student:", err);
//         setStudent(null);
//       });
//   }, [studentId]);

//   const handleAction = async (action: any) => {
//     if (!student) return;
//     try {
//       await addWaterLog(student.class, student.id, action.liters, action.label);
//       alert(`✅ ${action.label} logged for ${student.name}`);
//     } catch (err) {
//       console.error("Failed to log action:", err);
//       alert("❌ Failed to log action. Check console.");
//     }
//   };

//   if (!studentId) return <p className="p-6">❌ Invalid student QR</p>;
//   if (!student) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">📱 Report Water Usage</h1>
//       <h2 className="font-semibold mb-4">
//         {student.name} ({student.class})
//       </h2>

//       {categories.map((cat) => (
//         <div key={cat.heading} className="mb-6">
//           <h3 className="text-lg font-bold mb-2">{cat.heading}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {cat.actions.map((action) => (
//               <button
//                 key={action.label}
//                 className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 onClick={() => handleAction(action)}
//               >
//                 {action.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { addWaterLog } from "@/lib/firebaseLogs";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

const categories = [
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

export default function ReportPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const [student, setStudent] = useState<any>(null);

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
  const sendToN8n = async (actionLabel: string, studentName: string) => {
    try {
      await fetch("https://adittya.app.n8n.cloud/webhook/99969aa6-308e-4a72-96b7-1db43ba653d0", {
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

  const handleAction = async (action: any, category: string) => {
    if (!student) return;
    try {
      await addWaterLog(student.class, student.id, action.liters, action.label);

      // ✅ If it's under "Report Issues", also send to n8n
      if (category === "🚰 Report Issues") {
        await sendToN8n(action.label, student.name);
      }

      alert(`✅ ${action.label} logged for ${student.name}`);
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
