// // lib/firebaseLogs.ts
// import { ref, push } from "firebase/database";
// import { rtdb } from "./firebase";

// export async function addWaterLog(
//   className: string,
//   student: string,
//   liters: number,
//   action: string
// ) {
//   const logsRef = ref(rtdb, `logs/${className}/${student}`);
//   await push(logsRef, {
//     liters,     // +1 for save, -1 for waste
//     action,     // e.g., "Drank Water" / "Leaking Tap"
//     time: Date.now(),
//   });
// }
// lib/firebaseLogs.ts
// import { ref, push, set, runTransaction } from "firebase/database";
// import { rtdb } from "./firebase";

// export async function addWaterLog(
//   className: string,
//   student: string,
//   liters: number,
//   action: string
// ) {
//   // 1. Raw log save (student wise inside class)
//   const logsRef = ref(rtdb, `logs/${className}/${student}`);
//   await push(logsRef, {
//     liters,     // +1 for save, -1 for waste
//     action,     // e.g., "Drank Water" / "Leaking Tap"
//     time: Date.now(),
//   });

//   // 2. Class totals aggregation (for bar chart)
//   const totalRef = ref(rtdb, `totals/${className}`);
//   await runTransaction(totalRef, (currentValue) => {
//     return (currentValue || 0) + liters;
//   });
// }

// // lib/firebaseLogs.ts
import { rtdb } from "./firebase";
import { ref, push, set, runTransaction } from "firebase/database";

export async function addWaterLog(
  className: string,
  studentId: string,
  liters: number,
  action: string
) {
  if (!className || !studentId) {
    console.error("Missing className or studentId", { className, studentId });
    throw new Error("Missing className or studentId");
  }

  // 1️⃣ Save individual student log
  const logsRef = ref(rtdb, `logs/${className}/${studentId}`);
  const newLog = push(logsRef);

  await set(newLog, {
    liters,
    action,
    timestamp: Date.now(),
  });

  // 2️⃣ Update class totals for bar chart
  const totalRef = ref(rtdb, `totals/${className}`);
  await runTransaction(totalRef, (currentValue) => (currentValue || 0) + liters);

  console.log(`✅ Logged ${action} for ${studentId} in ${className}`);
}
