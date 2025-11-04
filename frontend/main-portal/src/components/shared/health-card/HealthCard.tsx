import React from "react";
import "./style.scss";

interface HealthCardProps {
  title?: string;            // 👈 thêm prop title
  status?: string;
  statusColor?: string;
  description?: string;
  goal?: string;
  info?: React.ReactNode;
  chart?: React.ReactNode; 
  date?: string;
}

const HealthCard: React.FC<HealthCardProps> = ({
  title,
  status,
  statusColor = "black",
  chart,
  date,
  info,
}) => {
  return (
    <div className="health-card">
      {/* Title */}
      {title && <h2 className="health-card__title">{title}</h2>}

      {/* Time */}
      <h1 className="health-card__time">
        Lasted at : {date || 'N/A'}
      </h1>

      {/* Body */}
      <div className="health-card__body">
        <div className="health-card__info">
          {info}
          <strong style={{ color: statusColor }}>{status}</strong>
        </div>
        <div className="health-card__chart">{chart}</div>
      </div>
    </div>
  );
};

export default HealthCard;
