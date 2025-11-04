import dayjs from "dayjs";

export type TimeRange = 'daily' | 'weekly' | 'monthly';

// Generate labels cho từng time range
export function generateLabelsForTimeRange(range: TimeRange, currentDate?: string): string[] {
  const date = currentDate ? dayjs(currentDate) : dayjs();

  switch (range) {
    case 'daily':
      return generateDailyLabels(date);
    case 'weekly':
      return generateWeeklyLabels(date);
    case 'monthly':
      return generateMonthlyLabels(date);
    default:
      return generateDailyLabels(date);
  }
}

function generateDailyLabels(currentDate: dayjs.Dayjs): string[] {
  const currentHour = currentDate.hour();
  const labels: string[] = [];

  for (let hour = 0; hour <= currentHour; hour++) {
    labels.push(currentDate.hour(hour).format('HH:mm'));
  }

  return labels;
}

function generateWeeklyLabels(currentDate: dayjs.Dayjs): string[] {
  const startOfWeek = currentDate.startOf('week').add(1, 'day'); // Thứ 2
  const labels: string[] = [];

  for (let day = 0; day < 7; day++) {
    labels.push(startOfWeek.add(day, 'day').format('dd/MM'));
  }

  return labels;
}

function generateMonthlyLabels(currentDate: dayjs.Dayjs): string[] {
  const daysInMonth = currentDate.daysInMonth();
  const labels: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    labels.push(day.toString());
  }

  return labels;
}

// Helper function để map data từ backend theo schema MongoDB
export function mapBackendDataToChart(records: Record<string, any>[], dataField: string, timeRange: TimeRange, currentDate?: string): { x: Date, y: number | null }[] {
  const date = currentDate ? dayjs(currentDate) : dayjs(records[0]?.date);
  let labels: string[] = [];
  switch (timeRange) {
    case 'daily':
      labels = generateDailyLabels(date);
      return mapDataWithLabels(records, dataField, labels, date, 'hour');
    case 'weekly':
      labels = generateWeeklyLabels(date);
      return mapDataWithLabels(records, dataField, labels, date, 'day', true);
    case 'monthly':
      labels = generateMonthlyLabels(date);
      return mapDataWithLabels(records, dataField, labels, date, 'day');
    default:
      labels = generateDailyLabels(date);
      return mapDataWithLabels(records, dataField, labels, date, 'hour');
  }
}

function mapDataWithLabels(
  records: Array<Record<string, any>>,
  dataField: string,
  labels: string[],
  currentDate: dayjs.Dayjs,
  unit: 'hour' | 'day',
  isWeek?: boolean
): { x: Date, y: number | null }[] {
  if (unit === 'hour') {
    return records.map(r => ({
      x: new Date(r.date),
      y: r.healthInfo[dataField] ?? null
    }));
  } else if (unit === 'day') {
    if (isWeek) {
      const startOfWeek = currentDate.startOf('week').add(1, 'day'); // Thứ 2
      return labels.map((label, idx) => {
        const dayDate = startOfWeek.add(idx, 'day');
        // Tìm record đúng ngày
        const rec = records.find(r => dayjs(r.date).isSame(dayDate, 'day'));
        return {
          x: rec ? new Date(rec.date) : dayDate.toDate(),
          y: rec ? rec.healthInfo[dataField] ?? null : null
        };
      });
    } else {
      // month
      return labels.map((label, idx) => {
        const dayDate = currentDate.date(idx + 1);
        const rec = records.find(r =>
          dayjs(r.date).date() === (idx + 1) &&
          dayjs(r.date).month() === currentDate.month() &&
          dayjs(r.date).year() === currentDate.year()
        );
        return {
          x: dayDate.toDate(),
          y: rec ? rec.healthInfo[dataField] ?? null : null
        };
      });
    }
  }
  return [];
}