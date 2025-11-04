// Mock data theo đúng schema database MongoDB
// Daily_Info: Lưu theo giờ (hourly records) - healthInfo là embedded object
// Day_Info: Lưu trung bình theo ngày (daily aggregated records) - healthInfo là embedded object

export const mockDailyInfoData = [
  // Ngày 15/01/2024 - 20 giờ từ 0h đến 19h
  { 
    _id: "daily_001", 
    patient: "patient_001", 
    date: "2024-01-15T00:00:00.000Z", 
    healthInfo: { _id: "health_001", weight: 70.0, systolic: 115, diastolic: 75, heartRate: 65, spo2: 97, sleep: 8, steps: null }
  },
  { 
    _id: "daily_002", 
    patient: "patient_001", 
    date: "2024-01-15T01:30:00.000Z", 
    healthInfo: { _id: "health_002", weight: 60.0, systolic: 118, diastolic: 77, heartRate: 68, spo2: 96, sleep: null, steps: null }
  },
  {
    _id: "daily_003", 
    patient: "patient_001", 
    date: "2024-01-15T02:00:00.000Z", 
    healthInfo: { _id: "health_003", weight: 80.0, systolic: 120, diastolic: 78, heartRate: 70, spo2: 98, sleep: null, steps: null }
  },
  { 
    _id: "daily_004", 
    patient: "patient_001", 
    date: "2024-01-15T03:00:00.000Z", 
    healthInfo: { _id: "health_004", weight: 55.0, systolic: 122, diastolic: 80, heartRate: 72, spo2: 97, sleep: null, steps: null }
  },
  { 
    _id: "daily_005", 
    patient: "patient_001", 
    date: "2024-01-15T04:00:00.000Z", 
    healthInfo: { _id: "health_005", weight: 57.0, systolic: 125, diastolic: 82, heartRate: 75, spo2: 98, sleep: null, steps: null }
  },
  { 
    _id: "daily_006", 
    patient: "patient_001", 
    date: "2024-01-15T05:00:00.000Z", 
    healthInfo: { _id: "health_006", weight: 58.0, systolic: 128, diastolic: 84, heartRate: 78, spo2: 96, sleep: null, steps: null }
  },
  { 
    _id: "daily_007", 
    patient: "patient_001", 
    date: "2024-01-15T06:00:00.000Z", 
    healthInfo: { _id: "health_007", weight: 56.0, systolic: 130, diastolic: 85, heartRate: 85, spo2: 95, sleep: null, steps: null }
  },
  { 
    _id: "daily_008", 
    patient: "patient_001", 
    date: "2024-01-15T07:00:00.000Z", 
    healthInfo: { _id: "health_008", weight: null, systolic: 132, diastolic: 87, heartRate: 88, spo2: 94, sleep: null, steps: null }
  },
  { 
    _id: "daily_009", 
    patient: "patient_001", 
    date: "2024-01-15T08:00:00.000Z", 
    healthInfo: { _id: "health_009", weight: null, systolic: 135, diastolic: 88, heartRate: 90, spo2: 96, sleep: null, steps: null }
  },
  { 
    _id: "daily_010", 
    patient: "patient_001", 
    date: "2024-01-15T09:00:00.000Z", 
    healthInfo: { _id: "health_010", weight: null, systolic: 138, diastolic: 90, heartRate: 92, spo2: 97, sleep: null, steps: null }
  },
  { 
    _id: "daily_011", 
    patient: "patient_001", 
    date: "2024-01-15T10:00:00.000Z", 
    healthInfo: { _id: "health_011", weight: null, systolic: 140, diastolic: 92, heartRate: 95, spo2: 95, sleep: null, steps: null }
  },
  { 
    _id: "daily_012", 
    patient: "patient_001", 
    date: "2024-01-15T11:00:00.000Z", 
    healthInfo: { _id: "health_012", weight: null, systolic: 135, diastolic: 88, heartRate: 88, spo2: 96, sleep: null, steps: null }
  },
  { 
    _id: "daily_013", 
    patient: "patient_001", 
    date: "2024-01-15T12:00:00.000Z", 
    healthInfo: { _id: "health_013", weight: null, systolic: 130, diastolic: 85, heartRate: 82, spo2: 97, sleep: null, steps: null }
  },
  { 
    _id: "daily_014", 
    patient: "patient_001", 
    date: "2024-01-15T13:00:00.000Z", 
    healthInfo: { _id: "health_014", weight: null, systolic: 125, diastolic: 83, heartRate: 80, spo2: 98, sleep: null, steps: null }
  },
  { 
    _id: "daily_015", 
    patient: "patient_001", 
    date: "2024-01-15T14:00:00.000Z", 
    healthInfo: { _id: "health_015", weight: null, systolic: 122, diastolic: 82, heartRate: 78, spo2: 97, sleep: null, steps: null }
  },
  { 
    _id: "daily_016", 
    patient: "patient_001", 
    date: "2024-01-15T15:00:00.000Z", 
    healthInfo: { _id: "health_016", weight: null, systolic: 120, diastolic: 80, heartRate: 76, spo2: 98, sleep: null, steps: null }
  },
  { 
    _id: "daily_017", 
    patient: "patient_001", 
    date: "2024-01-15T16:00:00.000Z", 
    healthInfo: { _id: "health_017", weight: null, systolic: 118, diastolic: 78, heartRate: 74, spo2: 97, sleep: null, steps: null }
  },
  { 
    _id: "daily_018", 
    patient: "patient_001", 
    date: "2024-01-15T17:00:00.000Z", 
    healthInfo: { _id: "health_018", weight: null, systolic: 111, diastolic: 75, heartRate: 72, spo2: 98, sleep: null, steps: null }
  },
  { 
    _id: "daily_019", 
    patient: "patient_001", 
    date: "2024-01-15T18:00:00.000Z", 
    healthInfo: { _id: "health_019", weight: null, systolic: 112, diastolic: 73, heartRate: 70, spo2: 97, sleep: null, steps: null }
  },
  { 
    _id: "daily_020", 
    patient: "patient_001", 
    date: "2024-01-15T19:00:00.000Z", 
    healthInfo: { _id: "health_020", weight: null, systolic: 110, diastolic: 72, heartRate: 68, spo2: 98, sleep: null, steps: null }
  }
];

export const mockDayInfoData = [
  // Tuần từ 8/01 đến 14/01/2024 (7 ngày)
  { 
    _id: "day_001", 
    patient: "patient_001", 
    date: "2024-01-08T00:00:00.000Z", 
    healthInfo: { _id: "day_health_001", weight: 70.0, systolic: 118, diastolic: 78, heartRate: 72, spo2: 97, sleep: 8, steps: 5000 },
    totalInput: 8
  },
  { 
    _id: "day_002", 
    patient: "patient_001", 
    date: "2024-01-09T00:00:00.000Z", 
    healthInfo: { _id: "day_health_002", weight: 70.2, systolic: 120, diastolic: 80, heartRate: 75, spo2: 98, sleep: 7.5, steps: 5200 },
    totalInput: 12 
  },
  { 
    _id: "day_003", 
    patient: "patient_001", 
    date: "2024-01-10T00:00:00.000Z", 
    healthInfo: { _id: "day_health_003", weight: 70.1, systolic: 122, diastolic: 82, heartRate: 78, spo2: 96, sleep: 8.2, steps: 4800 },
    totalInput: 15 
  },
  { 
    _id: "day_004", 
    patient: "patient_001", 
    date: "2024-01-11T00:00:00.000Z", 
    healthInfo: { _id: "day_health_004", weight: 70.3, systolic: 125, diastolic: 84, heartRate: 80, spo2: 95, sleep: 7.8, steps: 5500 },
    totalInput: 10 
  },
  { 
    _id: "day_005", 
    patient: "patient_001", 
    date: "2024-01-12T00:00:00.000Z", 
    healthInfo: { _id: "day_health_005", weight: 70.0, systolic: 128, diastolic: 86, heartRate: 85, spo2: 94, sleep: 8.5, steps: 6000 },
    totalInput: 18 
  },
  { 
    _id: "day_006", 
    patient: "patient_001", 
    date: "2024-01-13T00:00:00.000Z", 
    healthInfo: { _id: "day_health_006", weight: 69.8, systolic: 130, diastolic: 88, heartRate: 88, spo2: 96, sleep: 7.2, steps: 5800 },
    totalInput: 14 
  },
  { 
    _id: "day_007", 
    patient: "patient_001", 
    date: "2024-01-14T00:00:00.000Z", 
    healthInfo: { _id: "day_health_007", weight: 70.1, systolic: 125, diastolic: 85, heartRate: 82, spo2: 97, sleep: 8.0, steps: 5100 },
    totalInput: 16 
  },
  
  // Tháng 1/2024 (20 ngày đầu)
  { 
    _id: "day_008", 
    patient: "patient_001", 
    date: "2024-01-01T00:00:00.000Z", 
    healthInfo: { _id: "day_health_008", weight: 70.0, systolic: 115, diastolic: 75, heartRate: 70, spo2: 97, sleep: 8, steps: 5000 },
    totalInput: 6 
  },
  { 
    _id: "day_009", 
    patient: "patient_001", 
    date: "2024-01-02T00:00:00.000Z", 
    healthInfo: { _id: "day_health_009", weight: 70.2, systolic: 118, diastolic: 77, heartRate: 72, spo2: 96, sleep: 7.5, steps: 5200 },
    totalInput: 8 
  },
  { 
    _id: "day_010", 
    patient: "patient_001", 
    date: "2024-01-03T00:00:00.000Z", 
    healthInfo: { _id: "day_health_010", weight: 70.1, systolic: 120, diastolic: 78, heartRate: 74, spo2: 98, sleep: 8.2, steps: 4800 },
    totalInput: 12 
  },
  { 
    _id: "day_011", 
    patient: "patient_001", 
    date: "2024-01-04T00:00:00.000Z", 
    healthInfo: { _id: "day_health_011", weight: 70.3, systolic: 122, diastolic: 80, heartRate: 76, spo2: 97, sleep: 7.8, steps: 5500 },
    totalInput: 9 
  },
  { 
    _id: "day_012", 
    patient: "patient_001", 
    date: "2024-01-05T00:00:00.000Z", 
    healthInfo: { _id: "day_health_012", weight: 70.0, systolic: 125, diastolic: 82, heartRate: 78, spo2: 95, sleep: 8.5, steps: 6000 },
    totalInput: 15 
  },
  { 
    _id: "day_013", 
    patient: "patient_001", 
    date: "2024-01-06T00:00:00.000Z", 
    healthInfo: { _id: "day_health_013", weight: 69.8, systolic: 128, diastolic: 84, heartRate: 80, spo2: 94, sleep: 7.2, steps: 5800 },
    totalInput: 11 
  },
  { 
    _id: "day_014", 
    patient: "patient_001", 
    date: "2024-01-07T00:00:00.000Z", 
    healthInfo: { _id: "day_health_014", weight: 70.1, systolic: 130, diastolic: 85, heartRate: 82, spo2: 96, sleep: 8.0, steps: 5100 },
    totalInput: 13 
  },
  { 
    _id: "day_015", 
    patient: "patient_001", 
    date: "2024-01-08T00:00:00.000Z", 
    healthInfo: { _id: "day_health_015", weight: 70.2, systolic: 132, diastolic: 86, heartRate: 84, spo2: 97, sleep: 7.8, steps: 5300 },
    totalInput: 8 
  },
  { 
    _id: "day_016", 
    patient: "patient_001", 
    date: "2024-01-09T00:00:00.000Z", 
    healthInfo: { _id: "day_health_016", weight: 70.0, systolic: 135, diastolic: 88, heartRate: 86, spo2: 96, sleep: 8.2, steps: 5600 },
    totalInput: 12 
  },
  { 
    _id: "day_017", 
    patient: "patient_001", 
    date: "2024-01-10T00:00:00.000Z", 
    healthInfo: { _id: "day_health_017", weight: 69.9, systolic: 138, diastolic: 90, heartRate: 88, spo2: 95, sleep: 7.5, steps: 5900 },
    totalInput: 15 
  },
  { 
    _id: "day_018", 
    patient: "patient_001", 
    date: "2024-01-11T00:00:00.000Z", 
    healthInfo: { _id: "day_health_018", weight: 70.1, systolic: 140, diastolic: 92, heartRate: 90, spo2: 94, sleep: 8.8, steps: 6200 },
    totalInput: 10 
  },
  { 
    _id: "day_019", 
    patient: "patient_001", 
    date: "2024-01-12T00:00:00.000Z", 
    healthInfo: { _id: "day_health_019", weight: 70.3, systolic: 135, diastolic: 88, heartRate: 88, spo2: 96, sleep: 7.2, steps: 5800 },
    totalInput: 18 
  },
  { 
    _id: "day_020", 
    patient: "patient_001", 
    date: "2024-01-13T00:00:00.000Z", 
    healthInfo: { _id: "day_health_020", weight: 70.0, systolic: 130, diastolic: 85, heartRate: 85, spo2: 97, sleep: 8.0, steps: 5400 },
    totalInput: 14 
  },
  { 
    _id: "day_021", 
    patient: "patient_001", 
    date: "2024-01-14T00:00:00.000Z", 
    healthInfo: { _id: "day_health_021", weight: 69.8, systolic: 125, diastolic: 83, heartRate: 82, spo2: 98, sleep: 7.8, steps: 5200 },
    totalInput: 16 
  },
  { 
    _id: "day_022", 
    patient: "patient_001", 
    date: "2024-01-15T00:00:00.000Z", 
    healthInfo: { _id: "day_health_022", weight: 70.1, systolic: 122, diastolic: 82, heartRate: 80, spo2: 97, sleep: 8.2, steps: 5000 },
    totalInput: 20 
  },
  { 
    _id: "day_023", 
    patient: "patient_001", 
    date: "2024-01-16T00:00:00.000Z", 
    healthInfo: { _id: "day_health_023", weight: 70.2, systolic: 120, diastolic: 80, heartRate: 78, spo2: 98, sleep: 7.5, steps: 4800 },
    totalInput: 17 
  },
  { 
    _id: "day_024", 
    patient: "patient_001", 
    date: "2024-01-17T00:00:00.000Z", 
    healthInfo: { _id: "day_health_024", weight: 70.0, systolic: 118, diastolic: 78, heartRate: 76, spo2: 97, sleep: 8.0, steps: 4600 },
    totalInput: 13 
  },
  { 
    _id: "day_025", 
    patient: "patient_001", 
    date: "2024-01-18T00:00:00.000Z", 
    healthInfo: { _id: "day_health_025", weight: 69.9, systolic: 115, diastolic: 75, heartRate: 74, spo2: 98, sleep: 7.8, steps: 4400 },
    totalInput: 11 
  },
  { 
    _id: "day_026", 
    patient: "patient_001", 
    date: "2024-01-19T00:00:00.000Z", 
    healthInfo: { _id: "day_health_026", weight: 70.1, systolic: 112, diastolic: 73, heartRate: 72, spo2: 97, sleep: 8.2, steps: 4200 },
    totalInput: 9 
  },
  { 
    _id: "day_027", 
    patient: "patient_001", 
    date: "2024-01-20T00:00:00.000Z", 
    healthInfo: { _id: "day_health_027", weight: 70.0, systolic: 110, diastolic: 72, heartRate: 70, spo2: 98, sleep: 7.5, steps: 4000 },
    totalInput: 7 
  }
];

// Main function để lấy mock data với variation
export const getMockDataWithVariation = (timeRange: 'daily' | 'weekly' | 'monthly') => {
  let records;
  
  switch (timeRange) {
    case 'daily':
      records = mockDailyInfoData.slice(0, 20); // 20 giờ đầu
      break;
    case 'weekly':
      records = mockDayInfoData.slice(0, 7); // 7 ngày đầu (tuần)
      break;
    case 'monthly':
      records = mockDayInfoData.slice(7, 27); // 20 ngày (tháng)
      break;
    default:
      records = mockDailyInfoData.slice(0, 20);
  }
  
  return {
    records: records,
    timeRange: timeRange,
    totalRecords: records.length
  };
};