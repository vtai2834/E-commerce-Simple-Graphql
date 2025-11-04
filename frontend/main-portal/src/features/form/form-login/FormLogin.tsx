import type React from "react"
import { LockOutlined, UserOutlined, MedicineBoxOutlined } from "@ant-design/icons"
import { Form, Input, Button, Tabs, Divider } from "antd"
import { useState } from "react"
import { useAppDispatch } from "@store/index"
import { useNavigate } from "react-router-dom"
import { useLogin } from "@hooks/authen/useLogin"
import Cookies from "js-cookie"
import { login } from "@store/authenticator-slice"
import { EXPIPRE_TIME_TOKEN, SSOCOOKIES } from "@constants/index"
import { toast } from "react-toastify"
import "./style.scss"

type RoleType = "PATIENT" | "PHYSICIAN"

export interface IValuesForm {
    patientUsername?: string
    patientPassword?: string
    physicianUsername?: string
    physicianPassword?: string
    role?: RoleType
}

const LoginForm = () => {
    const [roleType, setRoleType] = useState<RoleType>("PATIENT")

    const [form] = Form.useForm<IValuesForm>()

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const { onHandleLogin } = useLogin()

    const handleFinish = async (values : IValuesForm) => {
        const valid = await form.validateFields()
        if (!valid) return;

        try {
            let loginInput;
            if (roleType === "PATIENT") {
                loginInput = {
                    email: values.patientUsername,
                    password: values.patientPassword,
                    role: roleType,
                };
            } else if (roleType === "PHYSICIAN") {
                loginInput = {
                    email: values.physicianUsername,
                    password: values.physicianPassword,
                    role: roleType,
                };
            } else {
                throw new Error("Invalid role selected");
            }

            const data = await onHandleLogin(loginInput, roleType)
            if (data && data.isSuccess && data.code === 1001) {
                const loginPayload = {
                    user: data.user,
                    authenticated: true,
                }
                dispatch(login(loginPayload))
                navigate(`/mainboard/${roleType}`, { replace: true });

                if (data.accessToken) {
                    Cookies.set(SSOCOOKIES.access, data.accessToken, {
                        expires: EXPIPRE_TIME_TOKEN,  
                        sameSite: "strict"
                    });
                }
                if (data.refreshToken) {
                    Cookies.set(SSOCOOKIES.refresh, data.refreshToken, {
                        expires: EXPIPRE_TIME_TOKEN, 
                        sameSite: "strict"
                    });
                }
            } else {
                console.log('fail login:', data?.message || 'Unknown error');
                toast.error("Login failed")
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    const tabItems = [
        {
            key: "PATIENT",
            label: (
                <span className="login-form__tab-label">
                    <UserOutlined />
                    Patient Login
                </span>
            ),
            children: (
                <>
                    <Form.Item
                        name="patientUsername"
                        rules={roleType === "PATIENT" ? [{ required: true, message: "Please enter patient username!" }] : []}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined className="login-form__icon" />}
                            placeholder="Enter your patient username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="patientPassword"
                        rules={roleType === "PATIENT" ? [{ required: true, message: "Please enter patient password!" }] : []}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="login-form__icon" />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>
                </>
            ),
        },
        {
            key: "PHYSICIAN",
            label: (
                <span className="login-form__tab-label">
                    <MedicineBoxOutlined />
                    Physician Login
                </span>
            ),
            children: (
                <>
                    <Form.Item
                        name="physicianUsername"
                        rules={roleType === "PHYSICIAN" ? [{ required: true, message: "Please enter physician username!" }] : []}
                    >
                        <Input
                            size="large"
                            prefix={<MedicineBoxOutlined className="login-form__icon" />}
                            placeholder="Enter your medical ID"
                        />
                    </Form.Item>
                    <Form.Item
                        name="physicianPassword"
                        rules={roleType === "PHYSICIAN" ? [{ required: true, message: "Please enter physician password!" }] : []}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="login-form__icon" />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>
                </>
            ),
        },
    ]

    return (
        <Form form={form} onFinish={handleFinish} layout="vertical" className="login-form">
            <Tabs
                centered
                activeKey={roleType}
                onChange={(activeKey) => setRoleType(activeKey as RoleType)}
                items={tabItems}
                className="login-form__tabs"
            />
            <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form__button"
            >
                Login
            </Button>

            <Divider plain className="login-form__divider">
                <span className="login-form__divider-text">Login to Your Account</span>
            </Divider>
        </Form>
    )
}

export default LoginForm;
