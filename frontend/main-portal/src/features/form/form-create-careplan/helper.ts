import dayjs from "dayjs"

export const parseDobToDayjs = (dob?: string | number | Date) => {
  if (!dob) return undefined
  
  const parsed = dayjs(dob)

  return parsed.isValid() ? parsed : undefined
}
