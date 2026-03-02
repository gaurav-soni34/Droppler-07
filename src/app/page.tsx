

"use client";

import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import ChartArea from "@/components/ChartArea";
import QRScansToday from "@/components/QRScansToday";
import EnvironmentalImpact from "@/components/EnvironmentalImpact";
import FutureImpact from "@/components/futureImpact";

const Homepage = () => {
  return (
    <div className=" p-4 sm:p-6 lg:p-8">
      <div className="w-full flex items-center justify-center text-center mb-16 px-4">
        <h1 className="text-2xl sm:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Droppler - The Dash
          <span className="ml-3 text-base sm:text-xl font-medium text-gray-600 dark:text-gray-400 italic">
            A Real Time Dashboard · Tap · Scan · Report
          </span>
        </h1>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {/* Bar Chart */}
        <div className="bg-primary-foreground p-4 rounded-xl shadow-sm md:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart />
        </div>

        {/* 2Card */}

        <div className="bg-primary-foreground p-4 rounded-xl shadow-sm">
          <QRScansToday />
        </div>

        {/* Pie Chart */}
        <div className="bg-primary-foreground p-4 rounded-xl shadow-sm">
          <AppPieChart />
        </div>

        {/* 3Card */}
        <div className="bg-primary-foreground p-4 rounded-xl shadow-sm">
          <EnvironmentalImpact />
        </div>

        {/* Area Chart */}
        <div className="bg-primary-foreground p-4 rounded-xl shadow-sm md:col-span-8 xl:col-span-2 2xl:col-span-2">
         
          <ChartArea />
        </div>

        <div className="bg-primary-foreground p-4 rounded-xl shadow-sm ">
          <FutureImpact />
        </div>

        {/* 4Card */}
        {/* <div className="bg-primary-foreground p-4 rounded-xl shadow-sm">
          Test
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
