import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { EReportStatus, IGetListReportsResponse } from "@/services/queries/get-reports/get-reports.type";
import { Link } from "react-router-dom";
import CellStatus from "./cell";
import { DownloadOutlined } from "@ant-design/icons";
import handleDownloadFilePdf from "@/utils/download.utils";
import { Button } from "antd";

export const renderColumns = (): ColumnsType<TArrayElement<IGetListReportsResponse['getListReports']['reports']>> => {
  return  [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (text: string) => {
        return <Link to={`/mainboard/PHYSICIAN/report/${text}`}>
          {text}
        </Link>
      },
    },
    {
      title: "Date of Service",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 120,
      render: (start: string) => {
        const date = new Date(start);
        return dayjs(date).format('YYYY-MM-DD');
      }
    },
    {
      title: "Last Modified",
      dataIndex: "toDate",
      key: "toDate",
      width: 120,
      render: (end: string) => {
        if (!end) return "N/A";
        const date = new Date(end);
        return dayjs(date).format('YYYY-MM-DD');
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: EReportStatus) => (
        <CellStatus status={status} />
      )
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      fixed: "right",
      render: (record: TArrayElement<IGetListReportsResponse['getListReports']['reports']>) => {
        if (record.status === EReportStatus.GENERATED || record.status === EReportStatus.REVIEWED){
          return (
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadFilePdf(record.reportUrl, record.id)}
            />
          );
        }
      },
    }
  ];
};
