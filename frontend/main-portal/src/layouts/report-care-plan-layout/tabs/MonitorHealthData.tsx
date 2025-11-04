import DailyEntry from '@/components/shared/daily-entry';
import ChartDiastolic from '@/features/chart/chart-diastolic';
import ChartHeartRate from '@/features/chart/chart-heart-rate';
import ChartSleep from '@/features/chart/chart-sleep';
import ChartSp02 from '@/features/chart/chart-sp02';
import ChartWeight from '@/features/chart/chart-weight';
import { TimeRange } from '@/features/chart/helper';
import { useDetailCarePlan } from '@/hooks/care-plan/useDetailCarePlan';
import { ETypeHealthDataView } from '@/services/queries/get-care-plan-detail/get-care-plan-detail.type';
import { Segmented } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IMonitorHealthDataProps {
  carePlanId: string;
}

const MonitorHealthData : React.FC<IMonitorHealthDataProps> = ({ carePlanId }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const { data, onHandleGetDetailCarePlanById } = useDetailCarePlan();

  const onHandleDateChange = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  const onHandleTimeRangeChange = (value: string) => {
    console.log('timeRange', value);
    setTimeRange(value as TimeRange);
  };

  useEffect(() => {
    const start = selectedDate.startOf(
      timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month',
    ).utc();
    const end = selectedDate.endOf(
      timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month',
    ).utc();

    onHandleGetDetailCarePlanById({
      careplanId: carePlanId || '',
      type:
        timeRange === 'daily'
          ? ETypeHealthDataView.DAILY
          : timeRange === 'weekly'
            ? ETypeHealthDataView.WEEKLY
            : ETypeHealthDataView.MONTHLY,
      filter: {
        fromDate: start.toISOString(),
        toDate: end.toISOString(),
      },
    });
  }, [onHandleGetDetailCarePlanById, selectedDate, timeRange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          width: '100%',
        }}
      >
        <DailyEntry onDateChange={onHandleDateChange} />

        <Segmented
          size='middle'
          style={{
            backgroundColor: '#2f54ab',
            padding: '5px',
            borderRadius: '8px',
            color: '#ffffff',
          }}
          options={[
            { label: 'Day', value: 'daily' },
            { label: 'Week', value: 'weekly' },
            { label: 'Month', value: 'monthly' },
          ]}
          value={timeRange}
          onChange={onHandleTimeRangeChange}
        />
      </div>

      {/* Hàng 1: Blood Pressure (trái) và Oxygen Saturation (phải) */}
      <div style={{ display: 'flex', gap: 20, width: '100%' }}>
        <ChartDiastolic
          diastolic={data?.patient?.dailyInfo?.[0]?.healthInfo?.diastolic || 0}
          systolic={data?.patient?.dailyInfo?.[0]?.healthInfo?.systolic || 0}
          date={selectedDate.toISOString()}
          timeRange={timeRange}
          records={data?.patient?.dailyInfo || []}
        />

        <ChartSp02
          sp02={data?.patient?.dailyInfo?.[0]?.healthInfo?.sp02 || 0}
          date={selectedDate.toISOString()}
          timeRange={timeRange}
          records={data?.patient?.dailyInfo || []}
        />
      </div>

      {/* Hàng 2: Heart Rate (full width) */}
      <div style={{ display: 'flex', width: '100%' }}>
        <ChartHeartRate
          heartRate={data?.patient?.dailyInfo?.[0]?.healthInfo?.heartRate || 0}
          date={selectedDate.toISOString()}
          timeRange={timeRange}
          records={data?.patient?.dailyInfo || []}
        />
      </div>

      {/* Hàng 3: Sleep (trái) và Weight (phải) */}
      <div style={{ display: 'flex', gap: 20, width: '100%' }}>
        <ChartSleep sleepHours={data?.patient?.dailyInfo?.[0]?.healthInfo?.sleep || 0} />

        <ChartWeight
          weight={data?.patient?.dailyInfo?.[0]?.healthInfo?.weight || 0}
          date={selectedDate.toISOString()}
          timeRange={timeRange}
          records={data?.patient?.dailyInfo || []}
        />
      </div>
    </div>
  );
};

export default MonitorHealthData;
