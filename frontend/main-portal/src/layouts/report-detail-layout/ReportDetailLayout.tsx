import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import './style.scss';
import ModalUpdateReport from '@/features/modal/modal-update-report';
import { EReportStatus } from '@/services/queries/get-reports/get-reports.type';
import { BadgeStatus, StatusType } from '@/components/shared/badge-status';
import { useApiCaller } from '@/hooks/use-api-caller';
import { useApiContext } from '@/contexts/api-provider.context';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { CheckCircleOutlined } from '@ant-design/icons/lib/icons';
import {
  IUpdateReportInput,
  IUpdateReportResponse,
} from '@/services/mutations/update-report/update-report.type';

const STATUS_MAP: Record<EReportStatus, StatusType> = {
  [EReportStatus.GENERATING]: 'processing',
  [EReportStatus.GENERATED]: 'success',
  [EReportStatus.REVIEWED]: 'info',
  [EReportStatus.FAILED]: 'error',
};

const ReportDetailLayout = () => {
  const param = useParams();
  const { reportId } = param;

  const variables = useMemo(() => ({ reportId: reportId ?? '' }), [reportId]);

  const apiService = useApiContext();

  const {
    execute: onHandleGetReportDetail,
    loading,
    data,
    error,
  } = useApiCaller(apiService.carePlan.reportDetail, { auto: true, variables });

  const { execute: onHandleRegenerateReport, loading: regenerating } = useApiCaller(
    apiService.carePlan.reGenerateReport,
  );

  const { execute: onHandleUpdateReport } = useApiCaller<
    IUpdateReportResponse['updateReport'],
    IUpdateReportInput,
    IUpdateReportResponse
  >(apiService.carePlan.updateReport);

  const handleRegenerate = () => {
    if (reportId) {
      onHandleRegenerateReport({ reportId })
        .then(() => {
          toast.success('Regenerate report successfully');
          onHandleGetReportDetail({ reportId });
        })
        .catch((error) => {
          toast.error(error.message || 'Regenerate report failed');
        });
    }
  };

  if (loading) return <div className='report-detail__loading'>Loading...</div>;
  if (error) return <div className='report-detail__error'>Error: {error}</div>;

  const status = data?.reportStatus ?? EReportStatus.FAILED;
  const statusBadge: StatusType = STATUS_MAP[status];

  return (
    <div className='report-detail'>
      <div className='report-detail__header'>
        <div className='report-detail__info'>
          <div className='report-detail__block'>
            <h1 className='report-detail__label'>Patient</h1>
            <h4 className='report-detail__value'>{data?.patientName}</h4>
          </div>

          <div className='report-detail__block'>
            <h1 className='report-detail__label'>Physician</h1>
            <h4 className='report-detail__value'>{data?.physicianName}</h4>
          </div>

          <div className='report-detail__block'>
            <h1 className='report-detail__label'>Date of Service</h1>
            <h4 className='report-detail__value'>{data?.dateOfService}</h4>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <BadgeStatus status={statusBadge} label={status} />

          <ModalUpdateReport note={data?.note ?? ''} />

          <Button
            className='report-detail__button'
            onClick={() =>
              onHandleUpdateReport({
                reportId: reportId ?? '',
                input: { status: EReportStatus.REVIEWED },
              })
                .then(() =>
                  toast.success('Successfully'),
                )
                .catch(() => toast.error('Failed'))
            }
          >
            Review{' '}
            <span style={{ marginLeft: 4 }}>
              <CheckCircleOutlined />
            </span>
          </Button>

          <Button
            className='report-detail__button'
            onClick={handleRegenerate}
            loading={regenerating}
          >
            Re-generate
          </Button>
        </div>
      </div>

      <iframe
        src={data?.reportUrl || ''}
        title='report'
        width='100%'
        height='700px'
        className='report-detail__iframe'
      >
        This browser does not support PDFs.
      </iframe>
    </div>
  );
};

export default ReportDetailLayout;
