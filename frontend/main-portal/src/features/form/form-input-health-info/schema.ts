import * as Yup from "yup";
import dayjs from "dayjs";

export const schemaInputHealthInfo = Yup.object().shape({
  weight: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Weight must be a number")
    .min(0, "Weight must be >= 0")
    .optional(),

  systolic: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Systolic must be a number")
    .min(0, "Systolic must be >= 0")
    .optional(),

  diastolic: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Diastolic must be a number")
    .min(0, "Diastolic must be >= 0")
    .optional(),

  heartRate: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Heart Rate must be a number")
    .min(0, "Heart Rate must be >= 0")
    .optional(),

  sp02: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("SpO2 must be a number")
    .min(0, "SpO2 must be >= 0")
    .max(100, "SpO2 must be <= 100")
    .optional(),

  sleep: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Sleep must be a number")
    .min(0, "Sleep must be >= 0")
    .optional(),

  steps: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Steps must be a number")
    .min(0, "Steps must be >= 0")
    .optional(),

  date: Yup.mixed<dayjs.Dayjs>()
    .test("valid-date", "Invalid date", (value) => dayjs.isDayjs(value))
    .test(
      "not-future",
      "Date cannot be in the future",
      (value) => !value || dayjs(value).isBefore(dayjs().endOf("day"))
    )
    .required("Date is required"),
});

export type TInputHealthInfoFormValues = Yup.InferType<typeof schemaInputHealthInfo>;
