// Socket event types and data interfaces
// This folder contains all socket event definitions

// Test event types
export interface TestEventData {
  message: string;
  timestamp: string;
}

// Appointment event types
export interface AppointmentCreatedData {
  facilityId: string;
  patientId: string;
  appointmentData: {
    id: string;
    title: string;
    date: string;
    status: string;
  };
}

// Report event types
export interface ReportCreatedData {
  physicianId: string;
  patientId: string;
  reportData: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
}

// Report status update event types
export interface ReportStatusUpdateData {
  reportId: string;
  carePlanId: string;
  status: 'Generating' | 'Generated' | 'Failed';
  reportUrl?: string; // Only when status is 'Generated'
  errorMessage?: string; // Only when status is 'Failed'
  timestamp: string;
}

// Socket event names constants


export const SOCKET_EVENTS_CLIENT_TO_SERVER = {
  // Test events
  TEST_EVENT: 'TEST_STH',
  
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error'
} as const;

export const SOCKET_EVENTS_SERVER_TO_CLIENT = {
    TEST_EVENT: 'TEST_STH',
    TEST_RESPONSE: 'Nhận được j j đó',
  
    // Business events
    APPOINTMENT_CREATED: 'appointment_created',
    NEW_APPOINTMENT: 'new_appointment',
    REPORT_CREATED: 'report_created',
    NEW_REPORT: 'new_report',
    REPORT_STATUS_UPDATE: 'report_status_update',
} as const;
