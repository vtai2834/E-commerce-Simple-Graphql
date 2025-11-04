import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Form, Input, Select, DatePicker, Radio, Button, Row, Col, Typography, Space, Card } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import type { PatientFormData } from "@interfaces/care-plan/createCarePlan.type"
import { useNavigate } from "react-router-dom"
import { usePatientDetail } from "@hooks/patient/usePatientDetail"
import { useSelector } from "react-redux"
import type { RootState } from "@store/index"
import { useListFacilities } from "@hooks/facilities/useGetFacilities"
import { useCreateCarePlan } from "@hooks/care-plan/useCreateCarePlan"
import { toast } from "react-toastify"
import { parseDobToDayjs } from "./helper"
import './style.scss'
import { useDebounce } from "@hooks/use-debounce"
import { DEFAULT_DEBOUNCE_DELAY } from "@constants/index"

const { Title } = Typography
const { Option } = Select

const countries = ["United States", "Canada", "Mexico"]
const states = ["California", "Texas", "New York", "Florida"]

const CreateCarePlanForm: React.FC = () => {
  const [contactMethod, setContactMethod] = useState<"email" | "email_and_phone">("email_and_phone")
  const navigate = useNavigate()
  const [form] = Form.useForm<PatientFormData>()

  const email = Form.useWatch("email", form)
  const debouncedEmail = useDebounce(email, DEFAULT_DEBOUNCE_DELAY)
  const { data: patientDetail, onFetchPatientDetail } = usePatientDetail()

  const userFacilities = useSelector((state: RootState) => state.authenticator.user.facilities || [])
  const memoIds = useMemo(() => userFacilities, [userFacilities.join(',')])
  const { data: facilitiesData } = useListFacilities(memoIds)
  const { onHandleCreateCarePlan } = useCreateCarePlan()

  const facilitiesOptions = ((facilitiesData ?? []).map((f) =>
    f?.id && f?.name ? { value: f.id, label: f.name } : null
  ).filter(Boolean)) as { value: string; label: string }[]

  const physicianId = useSelector((state: RootState) => state.authenticator.user.id)

  const onFinish = async () => {
    try {
      const facilityId = form.getFieldValue('facility') 
      const patientId = patientDetail?.patient?.id || ''

      if (!facilityId || !patientId || !physicianId) {
        toast.error('Missing required IDs')
        return
      }

      const res = await onHandleCreateCarePlan({
        input: {
          facilityId,
          note: 'New Care Plan',
          patientId,
          physicianId,
        }
      })

      if (res) {
        form.resetFields()
        navigate(`/mainboard/PHYSICIAN/CarePlans`)
      }
    } catch(e) {
      console.log("e: ", e)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    navigate(-1)
  }

  const handleSaveAndAddAnother = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Save and add another:", values)
        toast.success("Patient added successfully")
        form.resetFields()
        setContactMethod("email_and_phone")
      })
      .catch(() => {
        toast.error("Please fix the errors in the form before proceeding")
      })
  }

  useEffect(() => {
    if (debouncedEmail) {
      onFetchPatientDetail({ email: debouncedEmail });
    }
  }, [debouncedEmail, onFetchPatientDetail]);

  useEffect(() => {
    const p = patientDetail?.patient;
    if (!p) return;

    form.setFieldsValue({
      firstName: p.firstName ?? undefined,
      lastName: p.lastName ?? undefined,
      dateOfBirth: parseDobToDayjs(p.dob ?? undefined),
      country: p.contactInfo?.country ?? undefined,
      state: p.contactInfo?.state ?? undefined,
      address: p.contactInfo?.address ?? undefined,
      city: p.contactInfo?.city ?? undefined,
      mobileNumber: p.contactInfo?.phone ?? undefined,
    });
  }, [patientDetail, form]);

  return (
    <div className="create-care-plan">
      <Card>
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <ArrowLeftOutlined className="back-icon" onClick={handleCancel} />
            <Title level={4} className="title">ADD NEW PATIENT</Title>
          </div>
          <Select
            defaultValue={facilitiesOptions[0]?.value}
            options={facilitiesOptions}
            className="header-select"
            size="small"
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            preferredContactMethod: "email_and_phone",
            country: "United States",
          }}
        >
          {/* Patient Information */}
          <div className="section">
            <Title level={5} className="section-title">Patient information</Title>
            <Form.Item
              name="facility"
              label="Select facility"
              rules={[{ required: true, message: "Please select a facility" }]}
            >
              <Select placeholder="Select facility" size="large" options={facilitiesOptions} />
            </Form.Item>
          </div>

          {/* Personal Details */}
          <div className="section">
            <Title level={5} className="section-title">Personal details</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First name *"
                  rules={[{ required: true, message: "Please enter first name" }]}
                >
                  <Input placeholder="Enter patient's first name" size="large" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last name *"
                  rules={[{ required: true, message: "Please enter last name" }]}
                >
                  <Input placeholder="Enter patient's last name" size="large" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="dateOfBirth" label="Date of birth">
                  <DatePicker style={{ width: "100%" }} placeholder="Select patient's date of birth" size="large" disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Address Details */}
          <div className="section">
            <Title level={5} className="section-title">Address details</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="country"
                  label="Country *"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select size="large" disabled>
                    {countries.map((country) => (
                      <Option key={country} value={country}>{country}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="state" label="State">
                  <Select placeholder="Select state" size="large" disabled>
                    {states.map((state) => (
                      <Option key={state} value={state}>{state}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="address" label="Address">
              <Input placeholder="Address" size="large" disabled />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="city" label="City">
                  <Input placeholder="City" size="large" disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Contact Details */}
          <div className="section">
            <Title level={5} className="section-title">Contact details</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email *"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input placeholder="Enter patient's email" size="large" />
                </Form.Item>
              </Col>
              {contactMethod === "email_and_phone" && (
                <Col span={12}>
                  <Form.Item
                    name="mobileNumber"
                    label="Mobile number *"
                    rules={[{ required: true, message: "Please enter mobile number" }]}
                  >
                    <Input
                      addonBefore={
                        <Select defaultValue="+1" style={{ width: 70 }}>
                          <Option value="+1">🇺🇸 +1</Option>
                        </Select>
                      }
                      placeholder="Enter phone number"
                      size="large"
                      disabled
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Form.Item name="preferredContactMethod" label="Preferred contact method">
              <Radio.Group value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} size="large">
                <Radio value="email">Email</Radio>
                <Radio value="email_and_phone">Email and Phone</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* Actions */}
          <div className="actions">
            <Button onClick={handleCancel} size="large">Cancel</Button>
            <Space>
              <Button onClick={handleSaveAndAddAnother} size="large">Save & add another patient</Button>
              <Button type="primary" htmlType="submit" size="large">Add patient</Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default CreateCarePlanForm
