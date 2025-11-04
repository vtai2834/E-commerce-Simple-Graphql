import React, { useState } from "react";
import { Button, Space } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";

interface IDailyEntryProps {
  onDateChange?: (date: dayjs.Dayjs) => void;
  defaultDate?: dayjs.Dayjs;
}

const DailyEntry: React.FC<IDailyEntryProps> = ({ onDateChange, defaultDate }) => {
  const [selected, setSelected] = useState(defaultDate || dayjs());

  const startOfWeek = dayjs().startOf("week");
  const days = Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day")
  );
  const isPast = (day: dayjs.Dayjs) => day.isBefore(dayjs(), "day");

  const handleSelectDate = (date: dayjs.Dayjs) => {
    setSelected(date);
    if (onDateChange) {
      onDateChange(date);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: 'fit-content'
      }}
    >
      <Space size={16}>
        {days.map((day) => {
          const isToday = day.isSame(dayjs(), "day");
          const isSelected = day.isSame(selected, "day");

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {day.format("dd")}
              </span>

              <Button
                shape="circle"
                type={isSelected ? "primary" : "default"}
                style={{
                  border:
                    isToday && !isSelected ? "2px solid green" : undefined,
                }}
                onClick={() => handleSelectDate(day)}
                disabled={!isPast(day) && !isToday}
              >
                {day.date()}
              </Button>
            </div>
          );
        })}
      </Space>

      <Button icon={<CalendarOutlined />}>View</Button>
    </div>
  );
};

export default DailyEntry;
