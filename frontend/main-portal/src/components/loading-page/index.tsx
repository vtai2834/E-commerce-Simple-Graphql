import { ReactNode } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "./style.scss";

interface LoadingPageProps {
  loading: boolean;
  children?: ReactNode;
}

const LoadingPage = ({ loading, children }: LoadingPageProps) => {
  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-page__container">
          <Spin indicator={<LoadingOutlined spin />} />
          <div className="loading-page__text">Đang tải</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingPage;
