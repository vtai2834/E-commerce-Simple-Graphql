import React from "react";
import PhysicianDashboard from "@pages/physician-dashboard";
import LoginPage from "./pages/login";
import ReportCarePlanLayout from "@layouts/report-care-plan-layout";
import CreateCarePlanForm from "@features/form/form-create-careplan";
import PatientDashboard from "@pages/patient-dashboard";
import PatientInformation from "@features/patient-infomation";
import FormInputHealthInfo from "@features/form/form-input-health-info";
import ListCarePlans from "@features/lists/list-careplans/ListCarePlans";
import ListAppointment from "@features/lists/list-appointment/ListAppointment";
import CreateAppointment from "@pages/physician/createAppointment/createAppointment";

import ListNearestAppointmentPatient from "./components/list-nearest-appointment-patient/ListNearestAppointmentPatient";

import ReportDetailLayout from "./layouts/report-detail-layout";

export const privateRoutes = [
  {
    path: "PHYSICIAN",
    element: React.createElement(PhysicianDashboard),
    children: [
      { path: "appointments", element: React.createElement(ListAppointment) },
      { path: "careplans", element: React.createElement(ListCarePlans) },
      { path: "new_carePlan", element: React.createElement(CreateCarePlanForm) },
      { path: "careplan-detail/:carePlanId", element: React.createElement(ReportCarePlanLayout) },
      { path: "create-new-appointment", element: React.createElement(CreateAppointment)},
      { path: "report/:reportId", element: React.createElement(ReportDetailLayout) },
    ],
  },
  {
    path: "PATIENT",
    element: React.createElement(PatientDashboard),
    children: [
      { path: "info", element: React.createElement(PatientInformation) },
      { path: "health", element: React.createElement(FormInputHealthInfo) },
      { path: "service", element: React.createElement(ListNearestAppointmentPatient)},
    ],
  }
];

export const publicRoutes = [
  {
    path: "login",
    element: React.createElement(LoginPage),
  },
];
