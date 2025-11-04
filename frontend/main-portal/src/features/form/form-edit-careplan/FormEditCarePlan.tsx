import React, { useEffect } from "react";
import { Button, Form } from "antd";
import SelectPhySician from "@features/select/select-physician";
import { useEditCarePlan } from "@hooks/care-plan/useEditCarePlan";
import { ICarePlanDetailParaseData } from "@services/queries/get-care-plans/get-care-plans.type";
import "./style.scss";
import { genLabelsFormEditPatient } from "./helper";

interface IFormEditCarePlanProps {
    carePlan: TArrayElement<ICarePlanDetailParaseData['data']>;
    onSuccess?: () => void;
}

const FormEditCarePlan: React.FC<IFormEditCarePlanProps> = ({ carePlan, onSuccess }) => {
    //   const { editPatient } = useEditPatient();
    const { onHandleEditCarePlan } = useEditCarePlan()
    const labels = genLabelsFormEditPatient();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!carePlan) return;

        form.setFieldsValue({

            physicianId: carePlan.physicianId,

        });
    }, [carePlan, form]);

    console.log("facility id trong edit form: ", carePlan.facilityId);

    const onSubmitForm = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                newPhysicianId: values.physicianId,
                carePlanFriendlyId: parseInt(carePlan.friendlyId), // Convert string ID to integer
            };
            console.log("payload ở submit form: ", payload);

            //Gọi use Hook edit CarePlan chỗ này
            const data = await onHandleEditCarePlan(payload);

            if (data && data.physician.id) {
                if (onSuccess) onSuccess();
            }else {
                console.error("Error updating careplan: ");
            }
        } catch (err) {
            console.warn("Validation failed:", err);
        }
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 5 }}
            layout="horizontal"
            style={{ maxWidth: 'auto' }}
            onFinish={onSubmitForm}
            className="edit-patient-form"
        >

            <Form.Item
                className="ant-form-item-label full-width"
                label={labels.physician}
                name="physicianId"
            // rules={patientFormRules.physician}
            >
                <SelectPhySician facilityId={carePlan.facilityId} />
            </Form.Item>

            <Form.Item label={null} wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                        padding: '0 32px',
                        borderRadius: 8,
                        fontFamily: "Quicksand, sans-serif"
                    }}
                >
                    Edit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormEditCarePlan;
