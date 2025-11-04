// Define API groups with their types
import { ListCarePlansApi } from './queries/get-care-plans/get-care-plans.svc';
import { CarePlansDetailApi } from './queries/get-care-plan-detail/get-care-plan-detail.svc';
import { CreateCarePlanApi } from './mutations/createCarePlan/createCarePlan.svc';
import { EditCarePlanApi } from './mutations/editCarePlan/editCarePlan.svc';
import { StopCarePlanApi } from './mutations/stopCarePlan/stopCarePlan.svc';
import { GetMeInfoApi } from './queries/get-me-info/getMeInfo.svc';
import { ListFacilityApi } from './queries/get-facilities/get-facilities.svc';
import { PatientDetailApi } from './queries/patient-detail/patient-detail.svc';
import { PhysicianLoginApi } from './mutations/login/physicianLogin.svc';
import { LoginApi } from './mutations/login/patient-role/login.svc';
import { RefreshTokenApi } from './mutations/refreshToken/refreshToken.svc';
import { ListAppointmentsApi } from './queries/get-appointments/get-appointments.svc';
import { ApiServices } from '.';
import { GetPatientsByFacilityApi } from './queries/get-patients-by-facility/getPatients.svc';
import { ListReportsApi } from './queries/get-reports/get-reports.svc';
import { CreateReportApi } from './mutations/create-report/create-report.svc';
import { ReportDetailApi } from './queries/get-report-detail/get-report-detail.svc';
import { UpdateReportApi } from './mutations/update-report/update-report.svc';
import { ReGenerateReportApi } from './mutations/re-generate-report/re-generate-report.svc';
import { InputHealthDataApi } from './mutations/input-health-data/input-health-data.svc';

interface CarePlanGroup {
  listCarePlans: ListCarePlansApi;
  detailCarePlan: CarePlansDetailApi;
  createCarePlan: CreateCarePlanApi;
  editCarePlan: EditCarePlanApi;
  stopCarePlan: StopCarePlanApi;
  getPatientsByFacility: GetPatientsByFacilityApi

  listReports: ListReportsApi
  createReport: CreateReportApi
  reportDetail: ReportDetailApi
  updateReport: UpdateReportApi
  reGenerateReport: ReGenerateReportApi
}

interface AuthGroup {
  login: LoginApi;
  physicianLogin: PhysicianLoginApi;
  refreshToken: RefreshTokenApi;
}

interface PatientGroup {
  me: GetMeInfoApi;
  patientDetail: PatientDetailApi;
  listFacility: ListFacilityApi;

  inputHealthData: InputHealthDataApi
}

interface AppointmentGroup {
  listAppointments: ListAppointmentsApi;
}

export class CarePlanApiGroup implements CarePlanGroup {
  constructor(private apiServices: ApiServices) {}

  get listCarePlans(): ListCarePlansApi {
    return this.apiServices._lazyLoad('carePlan.listCarePlans', ListCarePlansApi);
  }

  get detailCarePlan(): CarePlansDetailApi {
    return this.apiServices._lazyLoad('carePlan.detailCarePlan', CarePlansDetailApi);
  }

  get createCarePlan(): CreateCarePlanApi {
    return this.apiServices._lazyLoad('carePlan.createCarePlan', CreateCarePlanApi);
  }

  get editCarePlan(): EditCarePlanApi {
    return this.apiServices._lazyLoad('carePlan.editCarePlan', EditCarePlanApi);
  }

  get stopCarePlan(): StopCarePlanApi {
    return this.apiServices._lazyLoad('carePlan.stopCarePlan', StopCarePlanApi);
  }

  get getPatientsByFacility(): GetPatientsByFacilityApi {
    return this.apiServices._lazyLoad('carePlan.getPatientsByFacility', GetPatientsByFacilityApi);
  }

  get listReports(): ListReportsApi {
    return this.apiServices._lazyLoad('carePlan.listReports', ListReportsApi);
  }

  get createReport(): CreateReportApi {
    return this.apiServices._lazyLoad('carePlan.createReport', CreateReportApi);
  }

  get reportDetail(): ReportDetailApi {
    return this.apiServices._lazyLoad('carePlan.reportDetail', ReportDetailApi);
  }

  get updateReport(): UpdateReportApi {
    return this.apiServices._lazyLoad('carePlan.updateReport', UpdateReportApi);
  }

  get reGenerateReport(): ReGenerateReportApi {
    return this.apiServices._lazyLoad('carePlan.reGenerateReport', ReGenerateReportApi);
  }
}

export class AuthApiGroup implements AuthGroup {
  constructor(private apiServices: ApiServices) {}

  get login(): LoginApi {
    return this.apiServices._lazyLoad('auth.login', LoginApi);
  }

  get physicianLogin(): PhysicianLoginApi {
    return this.apiServices._lazyLoad('auth.physicianLogin', PhysicianLoginApi);
  }

  get refreshToken(): RefreshTokenApi {
    return this.apiServices._lazyLoad('auth.refreshToken', RefreshTokenApi);
  }
}

export class PatientApiGroup implements PatientGroup {
  constructor(private apiServices: ApiServices) {}

  get me(): GetMeInfoApi {
    return this.apiServices._lazyLoad('patient.me', GetMeInfoApi);
  }

  get patientDetail(): PatientDetailApi {
    return this.apiServices._lazyLoad('patient.patientDetail', PatientDetailApi);
  }

  get listFacility(): ListFacilityApi {
    return this.apiServices._lazyLoad('patient.listFacility', ListFacilityApi);
  }

  get inputHealthData(): InputHealthDataApi {
    return this.apiServices._lazyLoad('patient.inputHealthData', InputHealthDataApi);
  }
}

export class AppointmentApiGroup implements AppointmentGroup {
  constructor(private apiServices: ApiServices) {}

  get listAppointments(): ListAppointmentsApi {
    return this.apiServices._lazyLoad('appointment.listAppointments', ListAppointmentsApi);
  }
}

export type { CarePlanGroup, AuthGroup, PatientGroup, AppointmentGroup };
