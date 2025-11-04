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
import annotationPlugin from 'chartjs-plugin-annotation';

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
  ArcElement,
  annotationPlugin
);

interface ChartHeartRateProps {
  heartRate?: number
  date?: string
  timeRange?: TimeRange
  records?: Record<string, any>[] // Dữ liệu từ backend
}

const ChartHeartRate : React.FC<ChartHeartRateProps> = ({ 
  heartRate, 
  date, 
  timeRange = 'daily', 
  records = [] 
}) => {

  // Generate labels dựa trên timeRange
  const labels = generateLabelsForTimeRange(timeRange, date);

  console.log("[ChartHeartRate] records:", records);
  
  // Map data từ backend hoặc sử dụng single value
  const chartData = records.length > 0 
    ? mapBackendDataToChart(records, 'heartRate', timeRange)
    : (date ? [{ x: new Date(date), y: heartRate || 0 }] : []);

  console.log("[ChartHeartRate] chartData:", chartData);

  // Tính Y range dựa trên data
  const values = chartData.map(d => d.y).filter((y): y is number => y !== null && y > 0);
  const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : (heartRate || 0);
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

    plugins: {
      annotation: {
        annotations: {
          heartRange: {
            type: 'box',
            yMin: 50,
            yMax: 140,
            backgroundColor: 'rgba(239, 248, 253, 0.6)',
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
          },
        },
      },
    },
  };

  const heartRateData = {
    // labels: labels,
    datasets: [
      {
        label: "Heart Rate",
        data: chartData,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        pointBackgroundColor: chartData.map(d => d.y !== null && d.y > 100 ? 'red' : '#2563eb'),
        pointRadius: chartData.map(d => d.y !== null && d.y > 100 ? 6 : 3),
      },
    ],
  };

  return (
    <HealthCard
      title="Heart Rate"
      status="Normal"
      statusColor="green"
      info={<h1 style={{ fontSize: 20, fontWeight: "bold" }}>{heartRate} bpm</h1>}
      chart={<Line data={heartRateData} options={optionsLine}/>}
    />
  )
}

export default ChartHeartRate;