import { useApi } from '@/contexts/api-provider.context';
import { useApiCaller } from '@/hooks/use-api-caller';
import { useFormValidate } from '@/hooks/use-form-validate';
import { IUpdateReportInput, IUpdateReportResponse } from '@/services/mutations/update-report/update-report.type';
import { CommentOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space } from 'antd';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import './style.scss'
interface IModalUpdateReportProps {
  note: string;
}

const MAX_LENGTH_NOTE = 500;

const schemaUpdateReport = Yup.object({
  note: Yup.string()
    .trim()
    .optional()
    .max(MAX_LENGTH_NOTE, `Note cannot exceed ${MAX_LENGTH_NOTE} characters`),
});

const ModalUpdateReport = ({ note }: IModalUpdateReportProps) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const param = useParams<{ reportId: string }>();
  const { reportId } = param;

  const {execute: onHandleUpdateReport} = useApiCaller<
    IUpdateReportResponse['updateReport'],
    IUpdateReportInput,
    IUpdateReportResponse
  >(useApi().carePlan.updateReport)

  const { formField } = useFormValidate({
    form,
    schema: schemaUpdateReport,
    validationOnChange: true,
    onSubmit: async (values, error) => {
      if (error) return;

      try {
        await onHandleUpdateReport({
          reportId: reportId ?? '',
          input: { note: values?.note ?? '' },
        }).then(()=> toast.success("Success"))
      } catch {
        toast.error('Update note report failed');
      }
    },
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        <Button onClick={showModal} >
          Note <span style={{ marginLeft: 8 }}><CommentOutlined /></span>
        </Button>
      </Space>

      <Modal
        className='modal-update-report'
        open={open}
        title="Note report"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,

          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form.submit();
              handleCancel();
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          {...formField}
          layout="vertical"
          name="form_update_report"
          initialValues={{ note }}
        >
          <Form.Item
            name="note"
            label="Note"
          >
            <textarea defaultValue={note}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ModalUpdateReport
