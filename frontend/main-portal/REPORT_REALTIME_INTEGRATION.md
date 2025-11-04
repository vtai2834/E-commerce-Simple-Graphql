# Frontend - Real-time Report Integration

## Tổng quan

Hệ thống frontend đã được tích hợp để nhận real-time updates về trạng thái report thông qua Socket.IO. Khi user tạo report, họ sẽ thấy trạng thái thay đổi real-time mà không cần refresh trang.

## Kiến trúc Frontend

```
FormCreateReport → API Call → Backend → gRPC → Socket Server → Socket.IO → Frontend
                                                                              ↓
ListReports ← Real-time Updates ← useReportStatusUpdates ← Socket Context
```

## Các Component đã được cập nhật

### 1. Socket Types (`src/types/socket/index.ts`)
- Thêm `ReportStatusUpdateData` interface
- Thêm `REPORT_STATUS_UPDATE` event constant

### 2. Custom Hook (`src/hooks/report/useReportStatusUpdates.ts`)
- Hook để lắng nghe socket events cho report status updates
- Filter events theo `carePlanId` hiện tại
- Callback để handle status updates

### 3. ListReports Component (`src/features/lists/list-report/ListReports.tsx`)
- State management cho real-time reports
- Socket event listener setup
- Handle 3 trạng thái: Generating, Generated, Failed
- Toast notifications cho user feedback

### 4. FormCreateReport Component (`src/features/form/form-create-report/FormCreateReport.tsx`)
- Callback để notify parent component
- Form reset sau khi submit thành công

### 5. Cell Status Component (`src/features/lists/list-report/cell.tsx`)
- Hiển thị download button khi report Generated
- Link trực tiếp đến reportUrl

## Flow hoạt động

### 1. User tạo report
```typescript
// User click "Create report" button
// Form submit → API call → Backend tạo report với status "Generating"
```

### 2. Socket nhận event "Generating"
```typescript
// Socket event: report_status_update
{
  reportId: "report_123",
  carePlanId: "careplan_456", 
  status: "Generating",
  timestamp: "2024-01-01T00:00:00.000Z"
}

// Frontend response:
// - Thêm report mới vào table với status "Generating"
// - Hiển thị toast: "📊 Report is being generated..."
```

### 3. Socket nhận event "Generated"
```typescript
// Socket event: report_status_update
{
  reportId: "report_123",
  carePlanId: "careplan_456",
  status: "Generated", 
  reportUrl: "https://...",
  timestamp: "2024-01-01T00:01:00.000Z"
}

// Frontend response:
// - Cập nhật report trong table với status "Generated"
// - Thêm download button
// - Hiển thị toast: "✅ Report generated successfully!"
```

### 4. Socket nhận event "Failed" (nếu có lỗi)
```typescript
// Socket event: report_status_update
{
  reportId: "report_123",
  carePlanId: "careplan_456",
  status: "Failed",
  errorMessage: "PDF generation failed",
  timestamp: "2024-01-01T00:01:00.000Z"
}

// Frontend response:
// - Cập nhật report trong table với status "Failed"
// - Hiển thị toast: "❌ Report generation failed: PDF generation failed"
```

## Cách sử dụng

### 1. Đảm bảo Socket Context được setup
```typescript
// App.tsx hoặc main component
import { SocketProvider } from '@/contexts/SocketContext';

function App() {
  return (
    <SocketProvider>
      {/* Your app components */}
    </SocketProvider>
  );
}
```

### 2. Sử dụng trong component
```typescript
import { useReportStatusUpdates } from '@/hooks/report/useReportStatusUpdates';

function MyComponent() {
  const handleReportUpdate = (data) => {
    console.log('Report updated:', data);
  };

  useReportStatusUpdates({
    carePlanId: 'current_care_plan_id',
    onReportStatusUpdate: handleReportUpdate
  });
}
```

## Environment Variables

```env
VITE_SOCKET_SERVER_URL=http://localhost:8001
```

## Testing

### 1. Test tạo report
1. Mở browser console để xem logs
2. Tạo report mới
3. Quan sát:
   - Toast notification "Report is being generated..."
   - Report xuất hiện trong table với status "Generating"
   - Sau vài giây: status chuyển thành "Generated" + download button
   - Toast notification "Report generated successfully!"

### 2. Test với multiple care plans
- Socket events chỉ affect care plan hiện tại
- Reports từ care plan khác sẽ không hiển thị

### 3. Test error handling
- Nếu backend gặp lỗi, status sẽ chuyển thành "Failed"
- Error message sẽ hiển thị trong toast

## Debug

### Console Logs
```typescript
// Khi socket connect
"🔌 Connecting to socket server..."
"✅ Connected to socket server"

// Khi nhận report status update
"📊 Received report status update: {reportId, carePlanId, status...}"
"✅ Report status update matches current care plan: careplan_123"

// Khi handle update
"🔄 Handling report status update: {reportId, status...}"
```

### Socket Events
- `report_status_update`: Event chính để nhận status updates
- `connect`: Socket connection established
- `disconnect`: Socket connection lost

## Troubleshooting

### 1. Socket không connect
- Kiểm tra `VITE_SOCKET_SERVER_URL`
- Kiểm tra authentication token
- Kiểm tra socket server có chạy không

### 2. Không nhận được events
- Kiểm tra carePlanId có match không
- Kiểm tra socket connection status
- Kiểm tra backend có emit events không

### 3. UI không update
- Kiểm tra console logs
- Kiểm tra state management
- Kiểm tra React re-renders
