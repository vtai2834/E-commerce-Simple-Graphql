import { BadgeStatus, StatusType } from '@/components/shared/badge-status';
import { EReportStatus } from '@/services/queries/get-reports/get-reports.type';

import React from 'react'

interface ICellStatusProps {
  status?: EReportStatus;
}

const STATUS_MAP: Record<EReportStatus, StatusType> = {
  [EReportStatus.GENERATING]: 'processing',
  [EReportStatus.GENERATED]: 'success',
  [EReportStatus.REVIEWED]: 'info',
  [EReportStatus.FAILED]: 'error',
};

const CellStatus: React.FC<ICellStatusProps> = ({ status }) => {
  const statusBadge: StatusType = STATUS_MAP[status ?? EReportStatus.FAILED];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <BadgeStatus status={statusBadge} label={status} />
    </div>
  )
}

export default CellStatus
