import dayjs from "dayjs"

export interface PatientFormData {
    facility: string
    firstName: string
    lastName: string
    dateOfBirth: dayjs.Dayjs | string
    gender: string
    weight: string
    height: string
    country: string
    state: string
    address: string
    city: string
    email: string
    mobileNumber: string
    emergencyContactPhone: string
    homePhone: string
    preferredContactMethod: "email" | "phone" | "email_and_phone"
}

export interface Facility {
    id: string
    name: string
    address: string
    city: string
    country: string
}