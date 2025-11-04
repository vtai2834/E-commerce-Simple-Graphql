import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import ModalEditCarePlan from "@features/modal/modal-edit-careplan/ModalEditCarePlan";
import './style.scss'
import { ICarePlanDetailParaseData } from "@services/queries/get-care-plans/get-care-plans.type";
import {  useCallback } from "react";
import dayjs from "dayjs";

const CellAction = ({ 
  careplan, 
  onCallback 
}: { 
  careplan: TArrayElement<ICarePlanDetailParaseData['data']>;
  onCallback?: () => void;
}) => {
  return (
    <div>
      <ModalEditCarePlan 
        carePlan={careplan} 
        onCallback={onCallback}
      />
    </div>
  );
};

const CarePlanIdCell = ({ friendlyId }: { friendlyId: string }) => {
  const navigate = useNavigate();
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/mainboard/PHYSICIAN/careplan-detail/${friendlyId}`);
  }, [friendlyId, navigate]);

  return (
    <Link 
      to={`/mainboard/PHYSICIAN/careplan-detail/${friendlyId}`}
      onClick={handleClick}
    >
      {friendlyId}
    </Link>
  );
};

export const renderColumns = (onCallback?: () => void): ColumnsType<TArrayElement<ICarePlanDetailParaseData['data']>> => {

  return  [
    {
      title: "ID",
      dataIndex: "friendlyId",
      key: "friendlyId",
      width: 80,
      fixed: "left",
      render: (friendlyId: string) => (
        <CarePlanIdCell friendlyId={friendlyId} />
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start",
      key: "start",
      width: 120,
      render: (start: string) => {
        const date = new Date(start);
        return dayjs(date).format('YYYY-MM-DD');
      }
    },
    {
      title: "End Date",
      dataIndex: "stop",
      key: "stop",
      width: 120,
      render: (end: string) => {
        if (!end) return "N/A";
        const date = new Date(end);
        return dayjs(date).format('YYYY-MM-DD');
      }
    },
    {
      title: "Patient Email",
      dataIndex: "patientEmail",
      key: "patientEmail",
      width: 200,
    },
    {
      title: "Patient Phone",
      dataIndex: "patientPhone",
      key: "patientPhone",
      width: 150,
    },
    {
      title: "Patient Address",
      dataIndex: "patientAddress",
      key: "patientAddress",
      width: 180,
    },
    {
      title: "Patient City",
      dataIndex: "patientCity",
      key: "patientCity",
      width: 120,
    },
    {
      title: "Patient Country",
      dataIndex: "patientCountry",
      key: "patientCountry",
      width: 120,
    },
    {
      title: "Facility Name",
      dataIndex: "facilityName",
      key: "facilityName",
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: TArrayElement<ICarePlanDetailParaseData['data']>) => (
        <CellAction 
          careplan={record} 
          onCallback={onCallback}
        />
      ),
      width: 180
    }
  ];
};
