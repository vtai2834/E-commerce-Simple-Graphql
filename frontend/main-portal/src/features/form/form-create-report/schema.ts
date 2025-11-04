import * as Yup from "yup";
import dayjs from "dayjs";

const MIN_DIFF_DAYS = 3;
const MAX_DIFF_DAYS = 31;
const MAX_NOTE_LENGTH = 500;

export const schemaCreateReport = Yup.object({
  friendlyId: Yup.string().required("Friendly ID is required"),

  dateRange: Yup.array()
    .of(
      Yup.mixed<dayjs.Dayjs>()
        .transform((value) => (dayjs.isDayjs(value) ? value : dayjs(value)))
        .typeError("Invalid date")
    )
    .required("Date range is required")
    .test(
      "both-dates-present",
      "Both start and end dates are required",
      (value) => Array.isArray(value) && !!value[0] && !!value[1]
    )
    .test(
      "valid-range",
      (value, context) => {

        console.log('value, context', value, context);
        if (!Array.isArray(value) || !value[0] || !value[1]) return true;

        const [start, end] = value;

        const diffDays = dayjs(end).diff(dayjs(start), "day");

        if (diffDays < 0) {
          return context.createError({
            message: "End date must be after start date",
          });
        }

        if (diffDays < MIN_DIFF_DAYS) {
          return context.createError({
            message: `Date range must be at least ${MIN_DIFF_DAYS} days apart`,
          });
        }

        if (diffDays > MAX_DIFF_DAYS) {
          return context.createError({
            message: `Date range must not exceed ${MAX_DIFF_DAYS} days`,
          });
        }

        return true;
      }
    ),

  notes: Yup.string()
    .trim()
    .max(MAX_NOTE_LENGTH, `Notes must not exceed ${MAX_NOTE_LENGTH} characters`)
    .optional(),

  override: Yup.boolean().optional(),
});

export type TCreateReportFormValues = Yup.InferType<typeof schemaCreateReport>;
