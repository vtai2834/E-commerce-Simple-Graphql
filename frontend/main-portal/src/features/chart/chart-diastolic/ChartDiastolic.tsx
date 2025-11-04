import HealthCard from "@components/shared/health-card";
import { mapBackendDataToChart, TimeRange } from "../helper";

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


interface ChartDiastolicProps {
  diastolic?: number
  systolic?: number
  date?: string
  timeRange?: TimeRange
  records?: Record<string, unknown>[] // Dữ liệu từ backend
}

const ChartDiastolic: React.FC<ChartDiastolicProps> = ({
  diastolic,
  systolic,
  date,
  timeRange = 'daily',
  records = []
}) => {

  // Generate labels dựa trên timeRange (không sử dụng trong chart hiện tại)
  // const labels = generateLabelsForTimeRange(timeRange, date);

  // Map data từ backend hoặc sử dụng single value
  const diastolicData = records.length > 0
    ? mapBackendDataToChart(records, 'diastolic', timeRange)
    : (date ? [{ x: new Date(date), y: diastolic || 0 }] : []);

  const systolicData = records.length > 0
    ? mapBackendDataToChart(records, 'systolic', timeRange)
    : (date ? [{ x: new Date(date), y: systolic || 0 }] : []);

  console.log("[ChartDiastolic] records:", records);
  console.log("[ChartDiastolic] diastolicData:", diastolicData);
  console.log("[ChartDiastolic] systolicData:", systolicData);

  // Tính Y range dựa trên data (kết hợp cả diastolic và systolic)
  const allValues = [...diastolicData, ...systolicData].map(d => d.y).filter((y): y is number => y !== null && y !== undefined && y > 0);
  const avgValue = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : ((diastolic || 0) + (systolic || 0)) / 2;
  console.log("all Values: ", allValues);
  console.log("avg Value: ", avgValue);
  const yMin = Math.max(0, avgValue - avgValue / 2);
  const yMax = avgValue + avgValue / 2;

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
            //ở đây cái min vs max của trục Ox cái chartjs sẽ tự làm hết, tự lấy hết data ra r tìm min, max để tự set
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

  const optionsLine: ChartOptions<"line"> = {
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
          diastolicRange: {
            type: 'box',
            yMin: 60,   // bắt đầu từ 60 mmHg
            yMax: 80,   // kết thúc ở 80 mmHg
            backgroundColor: 'rgba(162, 196, 67, 0.15)', // màu xanh nhạt trong suốt
            borderWidth: 0,
          },

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

  console.log("[ChartDiastolic] systolicData:", systolicData);
  console.log("[ChartDiastolic] diastolicData:", diastolicData);

  const bloodPressureData = {
    datasets: [
      {
        label: "Systolic",
        data: systolicData,
        borderColor: "#ff6b35", // màu đường nối các điểm
        backgroundColor: "rgba(255, 107, 53, 0.2)", // màu j đel biết
        tension: 0.5, // độ cong của đường nối các điểm
        pointBackgroundColor: systolicData.map(d => d.y !== null && (d.y < 100 || d.y > 120) ? 'red' : '#ff6b35'), // màu điểm dữ liệu
        pointRadius: systolicData.map(d => d.y !== null && (d.y < 100 || d.y > 120) ? 6 : 3), // kích thước điểm dữ liệu
      },
      {
        label: "Diastolic",
        data: diastolicData,
        borderColor: "#a2c443ff",
        backgroundColor: "rgba(162, 196, 67, 0.2)",
        tension: 0.3,
        pointBackgroundColor: diastolicData.map(d => d.y !== null && (d.y < 60 || d.y > 80) ? 'red' : '#a2c443ff'),
        pointRadius: diastolicData.map(d => d.y !== null && (d.y < 60 || d.y > 80) ? 6 : 3),
      },
    ],
  };


  // Xác định trạng thái huyết áp
  const getBloodPressureStatus = () => {
    const currentSystolic = systolic || 0;
    const currentDiastolic = diastolic || 0;
    
    if (currentSystolic < 100 || currentDiastolic < 60) {
      return { status: "Hypotension", color: "red" };
    } else if (currentSystolic > 140 || currentDiastolic > 90) {
      return { status: "Hypertension", color: "red" };
    } else if (currentSystolic > 120 || currentDiastolic > 80) {
      return { status: "Elevated", color: "orange" };
    } else {
      return { status: "Normal", color: "green" };
    }
  };

  const bpStatus = getBloodPressureStatus();

  return (
    <HealthCard
      title="Blood pressure"
      status={bpStatus.status}
      statusColor={bpStatus.color}
      info={
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff6b35" }} />
            <span style={{ fontSize: 16, fontWeight: "bold" }}>Systolic: {systolic} mmHg</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#a2c443ff" }} />
            <span style={{ fontSize: 16, fontWeight: "bold" }}>Diastolic: {diastolic} mmHg</span>
          </div>
        </div>
      }
      chart={<Line data={bloodPressureData} options={optionsLine} />}
    />
  )
}

export default ChartDiastolic