import { Button, DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import { genLabels } from "./helper";
import TextArea from "antd/es/input/TextArea";
import { Fragment, useCallback, useState } from "react";
import { useApiCaller } from "@/hooks/use-api-caller";
import {
  ICreateReportInput,
  ICreateReportResponse,
} from "@/services/mutations/create-report/create-report.type";
import { useApi } from "@/contexts/api-provider.context";
import { toast } from "react-toastify";
import './style.scss'
import { useFormValidate } from "@/hooks/use-form-validate";
import { schemaCreateReport, TCreateReportFormValues } from "./schema";

interface IFormCreateReportProps {
  friendlyId: string;
  onCallBack?: () => void;
}

const FormCreateReport: React.FC<IFormCreateReportProps> = ({
  friendlyId,
  onCallBack,
}) => {
  const [form] = Form.useForm<TCreateReportFormValues>();
  const labels = genLabels();

  const [pendingReportInput, setPendingReportInput] =
    useState<ICreateReportInput | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const { execute: onHandleCreateReport, loading: creatingReport } =
    useApiCaller<
      ICreateReportResponse["createReportPdf"],
      ICreateReportInput,
      ICreateReportResponse
    >(useApi().carePlan.createReport);

  const handleCreateReportSubmit = useCallback(
    async (inputPayload: TCreateReportFormValues | null) => {
      if (!inputPayload) return;

      const apiInput: ICreateReportInput = {
        input: {
          friendlyId: inputPayload.friendlyId,
          note: inputPayload.notes ?? "",
          override: inputPayload.override ?? false,
          fromDate: inputPayload.dateRange?.[0]?.toISOString() ?? "",
          toDate: inputPayload.dateRange?.[1]?.toISOString() ?? "",
        },
      };

      try {
        await onHandleCreateReport(apiInput, (res)=> {
          if (res.override){
            setPendingReportInput(apiInput);
            setShowOverrideModal(true);
          }
          else {
            toast.success("Create report successfully!");
            onCallBack?.();
            form.resetFields();
          }
        });
      } catch {
        toast.error("Create report failed!");
      }
    },
    [onHandleCreateReport, form, onCallBack]
  );

  const handleConfirmOverride = useCallback(async () => {
    if (!pendingReportInput) return;

    try {
      const overrideInput = {
        ...pendingReportInput,
        input: { ...pendingReportInput.input, override: true },
      };

      await onHandleCreateReport(overrideInput);

      toast.success("Report overridden and created successfully!");

      setShowOverrideModal(false);
      setPendingReportInput(null);

      onCallBack?.();
      form.resetFields();
    } catch {
      toast.error("Override report failed!");
    }
  }, [pendingReportInput, onHandleCreateReport, form, onCallBack]);

  const { formField } = useFormValidate({
    form,
    schema: schemaCreateReport,
    onSubmit: (values) => handleCreateReportSubmit(values),
  })

  return (
    <Fragment>
      <Form<TCreateReportFormValues>
        {...formField}
        layout="vertical"
        initialValues={{
          friendlyId,
          notes: "",
          dateRange: [dayjs(), dayjs()],
        }}
        className="form-create-report"
      >
        <Form.Item
          label={labels.friendlyId}
          name="friendlyId"
          rules={[{ required: true, message: "Please enter your friendly ID" }]}
        >
          <Input size="large" disabled value={friendlyId} />
        </Form.Item>

        <Form.Item name="dateRange" label={labels.dateRange} required>
          <DatePicker.RangePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            disabledDate={(current) => current && current > dayjs().endOf("day")}
          />
        </Form.Item>

        <Form.Item label={labels.notes} name="notes">
          <TextArea size="large" placeholder="Please enter your notes" />
        </Form.Item>

        <Form.Item className="form-submit">
          <Button
            type="default"
            htmlType="submit"
            loading={creatingReport}
          >
            Create report
          </Button>
        </Form.Item>
      </Form>

      <Modal
        open={showOverrideModal}
        title="Report Override Confirmation"
        onOk={handleConfirmOverride}
        onCancel={() => setShowOverrideModal(false)}
        okText="Override"
        cancelText="Cancel"
        confirmLoading={creatingReport}
      >
        Report for this period already exists. Do you want to override it?
      </Modal>
    </Fragment>
  );
};

export default FormCreateReport;
