import { PAGINATION } from "@constants/index";
import { useMemo, useState } from "react";
import { renderColumns } from "./colums";
import SearchDebounce from "@components/shared/search-debounce/SearchDebounce";
import { Button, Card, Table, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import { useAppSelector } from "@store/index";
import { ECarePlanStatus, ICarePlanDetailParaseData } from "@services/queries/get-care-plans/get-care-plans.type";
import { useNavigate } from "react-router-dom";
import { useApiCaller } from "@/hooks/use-api-caller";
import { useApi } from "@/contexts/api-provider.context";

const ListCarePlans = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_LIMIT);

  const [activeTab, setActiveTab] = useState<ECarePlanStatus>(ECarePlanStatus.ACTIVE);

  const userId = useAppSelector((state) => state.authenticator?.user?.id || "");

  const navigate = useNavigate();

  const variables = useMemo(() => ({
    filter: {
      physicianId: userId,
      pagination: {
        page: currentPage,
        limit: pageSize,
      },
      status: activeTab === ECarePlanStatus.ACTIVE ? ECarePlanStatus.ACTIVE : ECarePlanStatus.INACTIVE,
      patientEmail: searchTerm || undefined,
  },
  }), [userId, currentPage, pageSize, searchTerm, activeTab]);

  const { data, loading, execute: onFetchListCarePlans } = useApiCaller(useApi().carePlan.listCarePlans, { auto: true, variables });

  const columns = useMemo(() => {
    return renderColumns(onFetchListCarePlans);
  }, [onFetchListCarePlans]);

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

  return (
      <Card 
        style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
        {/* Header with Tabs and Add Button */}
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px 0 24px",
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as ECarePlanStatus)}
            >
                <TabPane tab={ECarePlanStatus.ACTIVE} key={ECarePlanStatus.ACTIVE} />
                <TabPane tab={ECarePlanStatus.INACTIVE} key={ECarePlanStatus.INACTIVE} />
            </Tabs>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={()=> navigate("/mainboard/PHYSICIAN/new_carePlan")}
                style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                }}
            >
                Add new patient
            </Button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "16px 24px" }}>
            <SearchDebounce
                placeholder="Search by patient name"
                allowClear
                onSubmit={onSearch}
            />
        </div>

        <div style={{ padding: "0 24px 24px 24px" }}>
            <Table<TArrayElement<ICarePlanDetailParaseData['data']>>
                loading={loading}
                columns={columns}
                dataSource={data?.data ?? []}
                rowKey="id"
                scroll={{ x: 1800 }}
                size="middle"
                style={{
                    backgroundColor: "white",
                }}
                pagination={{
                  className: "custom-table-pagination",
                  current: currentPage,
                  pageSize: pageSize,
                  onChange: handleTableChange,
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rows`,
                  onShowSizeChange: handlePageSizeChange,
                  pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS,
                }}
            />
        </div>
    </Card>
  )
}

export default ListCarePlans
