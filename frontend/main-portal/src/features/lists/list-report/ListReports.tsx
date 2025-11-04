import SearchDebounce from '@/components/shared/search-debounce';
import { PAGINATION } from '@/constants';
import { Card, Table } from 'antd';
import { useEffect, useMemo, useState, } from 'react';
import { IGetListReportsResponse, EReportStatus } from '@/services/queries/get-reports/get-reports.type';
import { renderColumns } from './columns';
import { useParams } from 'react-router-dom';
import { ReportStatusUpdateData, SOCKET_EVENTS_SERVER_TO_CLIENT } from '@/types/socket';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'react-toastify';
import { useApiCaller } from '@/hooks/use-api-caller';
import { useApi } from '@/contexts/api-provider.context';
import DrawerCreateReport from '@/features/drawers/drawer-create-report';
import './style.scss';

const ListReports = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_LIMIT);
  
  // State for real-time report updates
  const [reports, setReports] = useState<IGetListReportsResponse['getListReports']['reports']>([]);

  const params = useParams();
  const { carePlanId } = params;

  const variables = useMemo(
    () => ({
      filter: {
        friendlyId: carePlanId,
        reportId: searchTerm || undefined,
        pagination: {
          page: currentPage,
          limit: pageSize,
        },
      },
    }),
    [carePlanId, currentPage, pageSize, searchTerm],
  );

  const { data, loading, execute: onHandleGetReports } = useApiCaller(useApi().carePlan.listReports, { auto: true, variables })
  const { socket, isConnected } = useSocket();

  const onSearch = (values: { search: string }) => {
    setSearchTerm(values.search);
  };

  const handleTableChange = (page: number, nextPageSize?: number) => {
    setCurrentPage(page);
    if (nextPageSize && nextPageSize !== pageSize) {
      setPageSize(nextPageSize);
    }
  };

  const handlePageSizeChange = (_page: number, nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(PAGINATION.DEFAULT_PAGE);
  };

  // Update local reports state when data changes
  useEffect(() => {
    if (data?.reports) {
      setReports(data.reports);
    }
  }, [data?.reports]);

  // Socket listener for report status updates
  useEffect(() => {
    if (!socket || !isConnected || !carePlanId) {
      console.log('🔌 Socket not connected or no carePlanId, skipping event listener setup');
      return;
    }

    console.log('🎧 Setting up report status update listener for care plan:', carePlanId);

    const handleReportStatusUpdate = (updateData: ReportStatusUpdateData) => {
      console.log('📊 Received report status update:', updateData);
      
      // Check if this update is for the current care plan
      if (updateData.carePlanId === carePlanId) {
        console.log('✅ Report status update matches current care plan:', carePlanId);
        
        setReports(prevReports => {
          const existingReportIndex = prevReports.findIndex(report => report.id === updateData.reportId);
          
          if (updateData.status === 'Generating') {
            // Add new generating report to the list
            if (existingReportIndex === -1) {
              
              const newReport = {
                id: updateData.reportId,
                carePlanId: updateData.carePlanId,
                fromDate: new Date().toISOString(),
                toDate: new Date().toISOString(),
                note: '',
                status: EReportStatus.GENERATING,
                reportUrl: ''
              };
              
              toast.info('📊 Report is being generated...');
              return [newReport, ...prevReports];
            }
          } else if (updateData.status === 'Generated') {
            // Update existing report with generated status and URL
            if (existingReportIndex !== -1) {
              const updatedReports = [...prevReports];
              updatedReports[existingReportIndex] = {
                ...updatedReports[existingReportIndex],
                status: EReportStatus.GENERATED,
                reportUrl: updateData.reportUrl || ''
              };
              
              toast.success('✅ Report generated successfully!');
              return updatedReports;
            }
          } else if (updateData.status === 'Failed') {
            // Update existing report with failed status
            if (existingReportIndex !== -1) {
              const updatedReports = [...prevReports];
              updatedReports[existingReportIndex] = {
                ...updatedReports[existingReportIndex],
                status: EReportStatus.FAILED
              };
              
              // toast.error(`❌ Report generation failed: ${updateData.errorMessage || 'Unknown error'}`);
              return updatedReports;
            }
          }
          
          return prevReports;
        });
      } else {
        console.log('❌ Report status update for different care plan:', updateData.carePlanId);
      }
    };

    // Listen for report status updates
    socket.on(SOCKET_EVENTS_SERVER_TO_CLIENT.REPORT_STATUS_UPDATE, handleReportStatusUpdate);

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up report status update listener');
      socket.off(SOCKET_EVENTS_SERVER_TO_CLIENT.REPORT_STATUS_UPDATE, handleReportStatusUpdate);
    };
  }, [socket, isConnected, carePlanId]);

  return (
    <section className="list-reports">
      <Card className="list-reports__card"
      >
        <div className="list-reports__header">
          <SearchDebounce
            placeholder='Search by report id'
            allowClear
            onSubmit={onSearch}
          />

          <DrawerCreateReport 
            carePlanId={carePlanId} 
            onCallBack={() => {
              onHandleGetReports(variables);
            }} 
          />
        </div>

        <Table<TArrayElement<IGetListReportsResponse['getListReports']['reports']>>
          loading={loading}
          columns={renderColumns()}
          dataSource={reports}
          rowKey='id'
          size='middle'
          className="list-reports__table"
          pagination={{
            total: data?.pagination?.total || 0,
            className: 'custom-table-pagination',
            current: currentPage,
            pageSize: pageSize,
            onChange: handleTableChange,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rows`,
            onShowSizeChange: handlePageSizeChange,
            pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS,
          }}
        />
      </Card>
    </section>
  );
};

export default ListReports;
