export interface ICarePlan {
  id: string
  friendlyId: string
  startDate: string
  endDate: string
  status: "active" | "inactive"

  patientEmail: string
  patientPhone: string
  patientAddress: string
  patientCity: string
  patientCountry: string

  facility: string
  facilityId: string

  physicianId: string

}