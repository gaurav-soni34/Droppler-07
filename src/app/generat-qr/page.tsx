


"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { rtdb } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useTheme } from "next-themes";

interface Student { id: string; name: string; className: string; }

// students array ...
const students: Student[] = [
  // Class 1
  { id: "1001", name: "Aarav Mehta", className: "1st" },
  { id: "1002", name: "Ishita Sharma", className: "1st" },
  { id: "1003", name: "Kabir Verma", className: "1st" },
  { id: "1004", name: "Myra Gupta", className: "1st" },
  { id: "1005", name: "Vivaan Singh", className: "1st" },
  { id: "1006", name: "Anaya Khan", className: "1st" },

  // Class 2
  { id: "1007", name: "Reyansh Patel", className: "2nd" },
  { id: "1008", name: "Siya Agarwal", className: "2nd" },
  { id: "1009", name: "Advait Joshi", className: "2nd" },
  { id: "1010", name: "Aadhya Saxena", className: "2nd" },
  { id: "1011", name: "Atharv Nair", className: "2nd" },
  { id: "1012", name: "Pari Sharma", className: "2nd" },

  // Class 3
  { id: "1013", name: "Arjun Yadav", className: "3rd" },
  { id: "1014", name: "Navya Rathi", className: "3rd" },
  { id: "1015", name: "Krishna Malhotra", className: "3rd" },
  { id: "1016", name: "Kiara Bansal", className: "3rd" },
  { id: "1017", name: "Rudra Kapoor", className: "3rd" },
  { id: "1018", name: "Tanishka Jain", className: "3rd" },

  // Class 4
  { id: "1019", name: "Aryan Sharma", className: "4th" },
  { id: "1020", name: "Meera Chopra", className: "4th" },
  { id: "1021", name: "Dhruv Reddy", className: "4th" },
  { id: "1022", name: "Saanvi Das", className: "4th" },
  { id: "1023", name: "Yash Mishra", className: "4th" },
  { id: "1024", name: "Riya Goyal", className: "4th" },

  // Class 5
  { id: "1025", name: "Harsh Pandey", className: "5th" },
  { id: "1026", name: "Anvi Sinha", className: "5th" },
  { id: "1027", name: "Laksh Rajput", className: "5th" },
  { id: "1028", name: "Trisha Jaiswal", className: "5th" },
  { id: "1029", name: "Ayush Patel", className: "5th" },
  { id: "1030", name: "Ira Choudhary", className: "5th" },

  // Class 6
  { id: "1031", name: "Rohan Singh", className: "6th" },
  { id: "1032", name: "Sia Verma", className: "6th" },
  { id: "1033", name: "Manan Gupta", className: "6th" },
  { id: "1034", name: "Avni Sharma", className: "6th" },
  { id: "1035", name: "Dev Mehta", className: "6th" },
  { id: "1036", name: "Aarohi Khan", className: "6th" },

  // Class 7
  { id: "1037", name: "Vikram Rathore", className: "7th" },
  { id: "1038", name: "Kashvi Arora", className: "7th" },
  { id: "1039", name: "Naman Gupta", className: "7th" },
  { id: "1040", name: "Manya Bansal", className: "7th" },
  { id: "1041", name: "Arnav Sharma", className: "7th" },
  { id: "1042", name: "Pihu Jain", className: "7th" },

  // Class 8
  { id: "1043", name: "Kabir Malhotra", className: "8th" },
  { id: "1044", name: "Ridhi Verma", className: "8th" },
  { id: "1045", name: "Aditya Tiwari", className: "8th" },
  { id: "1046", name: "Niharika Singh", className: "8th" },
  { id: "1047", name: "Ayaan Khan", className: "8th" },
  { id: "1048", name: "Shruti Patel", className: "8th" },

  // Class 9
  { id: "1049", name: "Sarthak Joshi", className: "9th" },
  { id: "1050", name: "Khushi Sharma", className: "9th" },
  { id: "1051", name: "Arnav Gupta", className: "9th" },
  { id: "1052", name: "Janhvi Mehta", className: "9th" },
  { id: "1053", name: "Vivaan Saxena", className: "9th" },
  { id: "1054", name: "Tanisha Reddy", className: "9th" },

  // Class 10
  { id: "1055", name: "Raghav Kapoor", className: "10th" },
  { id: "1056", name: "Aanya Sinha", className: "10th" },
  { id: "1057", name: "Pranav Yadav", className: "10th" },
  { id: "1058", name: "Anushka Jain", className: "10th" },
  { id: "1059", name: "Kunal Verma", className: "10th" },
  { id: "1060", name: "Suhani Gupta", className: "10th" },

  // Class 11
  { id: "1061", name: "Aryan Nair", className: "11th" },
  { id: "1062", name: "Diya Sharma", className: "11th" },
  { id: "1063", name: "Yuvraj Singh", className: "11th" },
  { id: "1064", name: "Charvi Agarwal", className: "11th" },
  { id: "1065", name: "Rohan Malhotra", className: "11th" },
  { id: "1066", name: "Nisha Patel", className: "11th" },

  // Class 12
  { id: "1067", name: "Aman Gupta", className: "12th" },
  { id: "1068", name: "Muskaan Rathi", className: "12th" },
  { id: "1069", name: "Kartik Sharma", className: "12th" },
  { id: "1070", name: "Pooja Yadav", className: "12th" },
  { id: "1071", name: "Siddharth Verma", className: "12th" },
  { id: "1072", name: "Anjali Mehta", className: "12th" },
];


const LOCAL_IP = "192.168.245.96";
const PORT = 3000;

export default function GenerateQRPage() {
  const [savedStudents, setSavedStudents] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleSaveToFirebase = (student: Student) => {
    const studentRef = ref(rtdb, `students/${student.id}`);
    set(studentRef, {
      id: student.id,
      name: student.name,
      className: student.className,
    }).then(() => setSavedStudents((prev) => [...prev, student.id]));
  };

  const grouped = students.reduce<Record<string, Student[]>>((acc, s) => {
    acc[s.className] = acc[s.className] || [];
    acc[s.className].push(s);
    return acc;
  }, {});

  if (!mounted) return null;

  // QR color logic
  const qrColor = currentTheme === "dark" ? "#ffffff" : "#000000"; // white in dark, black in light
  const textColor = currentTheme === "dark" ? "text-white" : "text-gray-900";
  const cardBg = currentTheme === "dark" ? "bg-gray-800" : "bg-white";
  const shadowColor = currentTheme === "dark" ? "shadow-gray-700" : "shadow-gray-200";
  const qrBgColor = currentTheme === "dark" ? "#1f2937" : "#ffffff";

  return (
    <div className="p-6">
      <h1 className={`text-6xl font-light mb-8 text-center ${textColor}`}>
        QR is Here Buddy!
      </h1>

      {Object.keys(grouped).map((className) => (
        <div key={className} className="mb-10">
          <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
            Class {className}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {grouped[className].map((student) => {
              const reportUrl = `http://${LOCAL_IP}:${PORT}/report?studentId=${student.id}`;
              return (
                <div
                  key={student.id}
                  className={`${cardBg} border rounded-lg p-4 shadow-md ${shadowColor} flex flex-col items-center w-full`}
                >
                  <h3 className={`font-semibold text-base mb-2 text-center ${textColor}`}>
                    {student.name}
                  </h3>
                  <QRCode
                    value={reportUrl}
                    size={100}
                    fgColor={qrColor}
                    bgColor={qrBgColor}
                    level="H"
                  />
                  <button
                    className={`mt-3 px-3 py-1 rounded text-white text-sm w-full ${
                      savedStudents.includes(student.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600"
                    }`}
                    disabled={savedStudents.includes(student.id)}
                    onClick={() => handleSaveToFirebase(student)}
                  >
                    {savedStudents.includes(student.id)
                      ? "Saved"
                      : "Save to Firebase"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
