import HealthCard from "@components/shared/health-card";
import { generateLabelsForTimeRange, mapBackendDataToChart, TimeRange } from "../helper";

import {
  Line,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  TimeScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  ArcElement
);

interface ChartSystolicProps {
  systolicPressure?: number
  date?: string
  timeRange?: TimeRange
  records?: Record<string, any>[] // Dữ liệu từ backend
}

const ChartSystolic : React.FC<ChartSystolicProps> = ({ 
  systolicPressure, 
  date, 
  timeRange = 'daily', 
  records = [] 
}) => {

  // Generate labels dựa trên timeRange
  const labels = generateLabelsForTimeRange(timeRange, date);
  
  // Map data từ backend hoặc sử dụng single value
  const chartData = records.length > 0 
    ? mapBackendDataToChart(records, 'systolic', timeRange)
    : (date ? [{ x: new Date(date), y: systolicPressure || 0 }] : []);

  console.log("[ChartSystolic] records:", records);
  console.log("[ChartSystolic] chartData:", chartData);

  // Tính Y range dựa trên data
  const values = chartData.map(d => d.y).filter((y): y is number => y !== null && y> 0);
  const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : (systolicPressure || 0);
  const yMin = Math.max(0, avgValue - 20);
  const yMax = avgValue + 20;

  // Cấu hình scales dựa trên timeRange
  const getScaleConfig = () => {
    switch (timeRange) {
      case 'daily':
        return {
          x: {
            type: "time" as const,
            time: {
              unit: "hour" as const,
              displayFormats: {
                hour: "HH:mm",
              },
            },
            ticks: {
              source: "auto" as const,
              stepSize: 1,
              autoSkip: false, 
            },
          },
        };
      case 'weekly':
        return {
          x: {
            type: "time" as const,
            time: {
              unit: "day" as const,
              displayFormats: {
                day: "dd/MM",
              },
            },
            ticks: {
              source: "auto" as const,
              stepSize: 1,
              autoSkip: false, 
            },
          },
        };
      case 'monthly':
        return {
          x: {
            type: "time" as const,
            time: {
              unit: "day" as const,
              displayFormats: {
                day: "dd",
              },
            },
            ticks: {
              source: "auto" as const,
              stepSize: 1,
              autoSkip: false, 
            },
          },
        };
      default:
        return {
          x: {
            type: "time" as const,
            time: {
              unit: "hour" as const,
              displayFormats: {
                hour: "HH:mm",
              },
            },
            ticks: {
              source: "auto" as const,
              stepSize: 1,
              autoSkip: false, 
            },
          },
        };
    }
  };

  const optionsLine : ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      ...getScaleConfig(),
      y: {
        beginAtZero: false,
        min: yMin,
        max: yMax,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const systolicData = {
    // labels: labels,
    datasets: [
      {
        label: "Systolic Pressure",
        data: chartData,
        borderColor: "#d75721ff",
        backgroundColor: "rgba(243, 57, 19, 0.2)",
        tension: 0.3,
        pointBackgroundColor: chartData.map(d => d.y !== null && d.y < 90 ? 'red' : '#d75721ff'),
        pointRadius: chartData.map(d => d.y !== null && d.y < 90 ? 6 : 3),
      },
    ],
  };

  return (
    <HealthCard
      title="Systolic Pressure"
      status="Normal"
      statusColor="green"
      info={<h1 style={{ fontSize: 20, fontWeight: "bold" }}>{systolicPressure} mmHg</h1>}
      chart={<Line data={systolicData} options={optionsLine}/>}
    />
  )
}

export default ChartSystolic;