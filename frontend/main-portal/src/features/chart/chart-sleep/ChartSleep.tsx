import HealthCard from "@components/shared/health-card"
import { Doughnut } from "react-chartjs-2"

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
  ChartOptions,
  TimeScale,
  ChartData,
} from "chart.js";

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

interface IChartSleepProps {
  sleepHours: number;
}

const ChartSleep : React.FC<IChartSleepProps> = ({ sleepHours }) => {
  const awakeHours = 24 - sleepHours;

  console.log("[ChartSleep] sleepHours:", sleepHours);

  const dataDonut: ChartData<'doughnut'> = {
    labels: ['Sleep', 'Awake'],
    datasets: [
      {
        label: 'Hours',
        data: [sleepHours, awakeHours],
        backgroundColor: ['#4CAF50', '#FF9800'],
        borderWidth: 1,
      },
    ],
  };

  const optionsDonut : ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((Number(value) / total) * 100).toFixed(1);
            return `${label}: ${value}h (${percentage}%)`;
          },
        },
      },
    },
  };

  const status = sleepHours >= 7 && sleepHours <= 9 ? 'Normal' : (sleepHours < 7 ? 'Low' : 'High');
  const statusColor = status === 'Normal' ? 'green' : (status === 'Low' ? 'red' : 'orange');

  return (
    <HealthCard
      title="Sleep"
      status={status}
      statusColor={statusColor}
      description="Your resting heart rate is within the normal range."
      info={
        <h1 style={{ fontSize: 20 , fontWeight: 'bold', }}>{sleepHours}h</h1>
      }
      chart={
        <Doughnut data={dataDonut} options={optionsDonut} />
      }
    />
  )
}

export default ChartSleep
