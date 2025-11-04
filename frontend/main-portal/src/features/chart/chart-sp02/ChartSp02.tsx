import HealthCard from "@components/shared/health-card";
import { mapBackendDataToChart, TimeRange } from "../helper";

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

interface ChartSp02Props {
  sp02?: number
  date?: string
  timeRange?: TimeRange
  records?: Record<string, unknown>[] // Dữ liệu từ backend
}

const ChartSp02 : React.FC<ChartSp02Props> = ({ 
  sp02, 
  date, 
  timeRange = 'daily', 
  records = [] 
}) => {

  // Generate labels dựa trên timeRange (không sử dụng trong chart hiện tại)
  // const labels = generateLabelsForTimeRange(timeRange, date);
  
  // Map data từ backend hoặc sử dụng single value
  const chartData = records.length > 0 
    ? mapBackendDataToChart(records, 'sp02', timeRange)
    : (date ?  [{ x: new Date(date), y: sp02 || 0 }] : []);

  console.log("[ChartSp02] records:", records);
  console.log("[ChartSp02] chartData:", chartData);

  // Tính Y range dựa trên data
  const values = chartData.map(d => d.y).filter((y): y is number => y !== null && y > 0);
  const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : (sp02 || 0);
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
          stepSize: 10,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          spo2Range: {
            type: 'box',
            yMin: 95,
            yMax: 100,
            backgroundColor: 'rgba(239, 248, 253)', // xanh lá nhạt
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
          },
        },
      },
    },
  };

  const sp02Data = {
    // labels: labels,
    datasets: [
      {
        label: "SpO2",
        data: chartData,
        backgroundColor: chartData.map(d => d.y !== null && d.y < 95 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(37, 99, 235, 0.8)'),
        borderColor: chartData.map(d => d.y !== null && d.y < 95 ? 'rgba(239, 68, 68, 1)' : 'rgba(37, 99, 235, 1)'),
        borderWidth: 1,
      },
    ],
  };

  // Xác định trạng thái SpO2
  const getSpO2Status = () => {
    const currentSpO2 = sp02 || 0;
    
    if (currentSpO2 < 95) {
      return { status: "Low SpO2", color: "red" };
    } else if (currentSpO2 > 100) {
      return { status: "High SpO2", color: "orange" };
    } else {
      return { status: "Normal", color: "green" };
    }
  };

  const spO2Status = getSpO2Status();

  return (
    <HealthCard
      title="Oxygen saturation"
      status={spO2Status.status}
      statusColor={spO2Status.color}
      info={<h1 style={{ fontSize: 20, fontWeight: "bold" }}>{sp02} %</h1>}
      chart={<Bar data={sp02Data} options={optionsBar} />}
    />
  )
}

export default ChartSp02;