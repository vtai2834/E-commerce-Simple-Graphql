import { Button, Form, Input, DatePicker } from "antd";
import { genLabelFormCreteHealthInfo } from "./helper";
import "./style.scss";
import { useAppSelector } from "@store/index";
import dayjs from "dayjs";
import { schemaInputHealthInfo, TInputHealthInfoFormValues } from "./schema";
import { useFormValidate } from "@/hooks/use-form-validate";
import { useApiCaller } from "@/hooks/use-api-caller";
import { useApi } from "@/contexts/api-provider.context";
import { RESPONSE_CODE } from "@/constants";
import { toast } from "react-toastify";

const FormInputHealthInfo = () => {
  const userId = useAppSelector((state) => state.authenticator.user.id);
  const labels = genLabelFormCreteHealthInfo();

  const [form] = Form.useForm<TInputHealthInfoFormValues>();
  const { execute: handleInputHealthData } = useApiCaller(useApi().patient.inputHealthData)

  const { formField } = useFormValidate({
    form,
    schema: schemaInputHealthInfo,
    validationOnChange: true,
    onSubmit: async (values) => {
      try {
        schemaInputHealthInfo.validateSync(values, { abortEarly: false });

        await handleInputHealthData({
          patientId: userId,
          healthInfo: {
            weight: Number(values?.weight),
            systolic: Number(values?.systolic),
            diastolic: Number(values?.diastolic),
            heartRate: Number(values?.heartRate),
            sp02: Number(values?.sp02),
            sleep: Number(values?.sleep),
            steps: Number(values?.steps),
          },
          date: values?.date ? values.date.toISOString() : dayjs().toISOString(),
        }, (data)=> {
          if(data.code === RESPONSE_CODE.SUCCESS_MUTATION){
            form.resetFields();
            toast.success('Input daily info successfully !');
          }
        });

        
      } catch (err) {
        console.error("Error input health data:", err);
      }
    },
  });

  return (
    <section className="health-info-section">
      <h1>Health data information</h1>

      <Form<TInputHealthInfoFormValues>
        {...formField}
        layout="vertical"
        className="create-health-data-form"
        style={{ maxWidth: 800 }}
        initialValues={{
          weight: undefined,
          systolic: undefined,
          diastolic: undefined,
          heartRate: undefined,
          sp02: undefined,
          sleep: undefined,
          steps: undefined,
          date: dayjs(),
        }}
      >
        <div className="form-grid">
          <Form.Item label={labels.weight} name="weight">
            <Input type="number" size="large" placeholder="Please enter your weight" />
          </Form.Item>

          <Form.Item label={labels.systolic} name="systolic">
            <Input type="number" size="large" placeholder="Please enter your systolic" />
          </Form.Item>

          <Form.Item label={labels.diastolic} name="diastolic">
            <Input type="number" size="large" placeholder="Please enter your diastolic" />
          </Form.Item>

          <Form.Item label={labels.heartRate} name="heartRate">
            <Input type="number" size="large" placeholder="Please enter your heart rate" />
          </Form.Item>

          <Form.Item label={labels.spO2} name="sp02">
            <Input type="number" size="large" placeholder="Please enter your SpO2" />
          </Form.Item>

          <Form.Item label={labels.sleep} name="sleep">
            <Input type="number" size="large" placeholder="Please enter your sleep" />
          </Form.Item>

          <Form.Item className="full-width" label={labels.steps} name="steps">
            <Input type="number" size="large" placeholder="Please enter your steps" />
          </Form.Item>
        </div>

        <Form.Item label="Time" name="date" required>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            disabledDate={(current) => current && current > dayjs().endOf("day")}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="default"
            htmlType="submit"
            style={{
              padding: "0 32px",
              borderRadius: 8,
              fontFamily: "Quicksand, sans-serif",
              border: "1px solid #4096ff",
              color: "#4096ff",
              fontSize: 16,
            }}
          >
            Input
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default FormInputHealthInfo;
