import React from "react";
import "./style.scss";

export type StatusType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "processing";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: string;
}

export const BadgeStatus: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = "",
  ...props
}) => {
  return (
    <span
      className={`status-badge status-badge--${status} ${className}`}
      {...props}
    >
      {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
