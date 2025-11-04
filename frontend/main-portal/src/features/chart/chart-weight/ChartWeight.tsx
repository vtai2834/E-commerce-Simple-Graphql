import HealthCard from "@components/shared/health-card";
import { generateLabelsForTimeRange, mapBackendDataToChart, TimeRange } from "../helper";

import {
  Bar,
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

interface ChartWeightProps {
  weight?: number
  date?: string
  timeRange?: TimeRange
  records?: Record<string, unknown>[] // Dữ liệu từ backend
}

const ChartWeight: React.FC<ChartWeightProps> = ({
  weight,
  date,
  timeRange = 'daily',
  records = []
}) => {

  // Generate labels dựa trên timeRange
  const labels = generateLabelsForTimeRange(timeRange, date);

  // Map data từ backend hoặc sử dụng single value
  const chartData = records.length > 0
    ? mapBackendDataToChart(records, 'weight', timeRange)
    : (date ? [{ x: new Date(date), y: weight || 0 }] : []);

  console.log("[ChartWeight] records:", records);
  console.log("[ChartWeight] chartData:", chartData);

  // Tính Y range dựa trên data
  const values = chartData.map(d => d.y).filter((y): y is number => y !== null && y !== undefined && y > 0);
  const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : (weight || 0);
  const yMin = Math.max(0, avgValue - 10);
  const yMax = avgValue + 10;

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

  const optionsBar: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      ...getScaleConfig(),
      y: {
        beginAtZero: false,
        min: yMin,
        max: yMax,
        ticks: {
          stepSize: 5,
        },
      },
    },

    plugins: {
        annotation: {
          annotations: {
            systolicRange: {
              type: 'box',
              yMin: 100,
              yMax: 120,
              backgroundColor: 'rgba(255, 165, 0, 0.15)', // cam nhạt
              borderWidth: 0,
            },
          },
        },
      },
  };

  const weightData = {
    datasets: [
      {
        label: "Weight",
        data: chartData,
        backgroundColor: chartData.map(d => d.y !== null && d.y > 0 ? 'rgba(54, 162, 235, 0.8)' : 'rgba(200, 200, 200, 0.3)'),
        borderColor: chartData.map(d => d.y !== null && d.y > 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(200, 200, 200, 0.5)'),
        borderWidth: 1,
      },
    ],
  };

  // Xác định trạng thái cân nặng (BMI calculation would need height)
  const getWeightStatus = () => {
    const currentWeight = weight || 0;
    
    if (currentWeight === 0) {
      return { status: "No Data", color: "gray" };
    } else if (currentWeight < 50) {
      return { status: "Underweight", color: "orange" };
    } else if (currentWeight > 100) {
      return { status: "Overweight", color: "red" };
    } else {
      return { status: "Normal", color: "green" };
    }
  };

  const weightStatus = getWeightStatus();

  return (
    <HealthCard
      title="Weight - BMI"
      status={weightStatus.status}
      statusColor={weightStatus.color}
      info={<h1 style={{ fontSize: 20, fontWeight: "bold" }}>{weight} kg</h1>}
      chart={<Bar data={weightData} options={optionsBar} />}
    />
  )
}

export default ChartWeight
