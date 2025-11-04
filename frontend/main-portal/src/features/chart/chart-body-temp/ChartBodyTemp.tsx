// import HealthCard from "@components/shared/health-card";
// import { generateLabelsAround } from "../helper";

// import {
//   Line,
// } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   BarElement,
//   TimeScale,
//   ChartOptions,
// } from "chart.js";
// import "chartjs-adapter-date-fns";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   TimeScale,
//   ArcElement
// );

// interface ChartBodyTempProps {
//   bodyTemp: number
//   date: string
// }

// const ChartBodyTemp : React.FC<ChartBodyTempProps> = ({ bodyTemp, date }) => {

//   const labels = generateLabelsAround(date || '', 3)

//   const yMin = Math.max(0, bodyTemp - 20);
//   const yMax = bodyTemp + 20;

//   const getXAxisRange = (dateStr: string) => {
//     const currentDate = new Date(dateStr);
//     const startOfDay = new Date(currentDate);
//     startOfDay.setHours(0, 0, 0, 0);
    
//     const endOfDay = new Date(currentDate);
//     endOfDay.setHours(23, 59, 59, 999);
    
//     return {
//       min: startOfDay.toISOString(),
//       max: endOfDay.toISOString(),
//     };
//   };

//   const xRange = getXAxisRange(date || new Date().toISOString());

//   const optionsLine : ChartOptions<"line"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         type: "time" as const,
//         time: {
//           unit: "hour",
//           displayFormats: {
//             hour: "HH:mm",
//           },
//         },
//         ticks: {
//           source: "auto",
//           stepSize: 1,
//           autoSkip: false, 
//         },
//         min: xRange.min, // Động theo date
//         max: xRange.max, // Động theo date
//       },
//       y: {
//         beginAtZero: false,
//         min: yMin,
//         max: yMax,
//         ticks: {
//           stepSize: 10,
//         },
//       },
//     },
//   };

//   const bodyTempData = {
//     labels: labels,
//     datasets: [
//       {
//         label: "Diastolic",
//         data: [ {
//           x: new Date(date || ''), 
//           y: bodyTemp || 0
//         } ],
//         borderColor: "#2563eb",
//         backgroundColor: "rgba(37,99,235,0.2)",
//         tension: 0.3,
//       },
//     ],
//   };


//   return (
//     <HealthCard
//       title="Diastolic"
//       status="Normal"
//       statusColor="green"
//       info={<h1 style={{ fontSize: 20, fontWeight: "bold" }}>80 mmHg</h1>}
//       chart={<Line data={bodyTempData} options={optionsLine}/>}
//     />
//   )
// }

// export default ChartBodyTemp
