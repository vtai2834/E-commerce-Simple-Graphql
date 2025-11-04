import itrLogo from '../../assets/images/itr-logo.svg';
import LoginForm from "../../features/form/form-login";
import "./style.scss";

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-page__card">
                <div className="login-page__header">
                    <img
                        src={itrLogo || "/placeholder.svg"}
                        alt="logo"
                        className="login-page__logo"
                    />
                    <h1 className="login-page__title">Welcome Back</h1>
                    <p className="login-page__subtitle">Patient Care Platform</p>
                </div>

                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage;
