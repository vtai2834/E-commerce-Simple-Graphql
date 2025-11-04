// import type React from "react"
// import { useMemo, useState, useEffect } from "react"
// import { Card, Table, Button, Input, Tabs } from "antd"
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
// import type { TablePaginationConfig } from "antd/es/table"
// import type { ICarePlan } from "@interfaces/care-plan/listCarePlan.type"
// import { renderColumns } from "src/features/lists/list-careplans/colums"
// import { useListCarePlans } from "@hooks/care-plan/useListCarePlan"
// import { ICarePlanItem } from "@services/queries/get-care-plans/get-care-plans.type"
// import { useSelector } from "react-redux"
// import type { RootState } from "@store/index"
// import { useNavigate } from "react-router-dom"

// const { Search } = Input
// const { TabPane } = Tabs

// // Mapping function to convert API response to component interface
// const mapCarePlanItemToICarePlan = (item: ICarePlanItem): ICarePlan => ({
//     id: item.id || "",
//     friendlyId: item.friendlyId || "",
//     startDate: item.start ? new Date(item.start).toLocaleDateString("en-US") : "",
//     endDate: item.stop ? new Date(item.stop).toLocaleDateString("en-US") : "",
//     status: item.status?.toLowerCase() === "active" ? "active" : "inactive",

//     patientEmail: item.patient.email,
//     patientPhone: item.patient.contactInfo.phone || "",
//     patientAddress: item.patient.contactInfo.address || "",
//     patientCity: item.patient.contactInfo.city || "",
//     patientCountry: item.patient.contactInfo.country || "",

//     facility: item.facility.name || "",
//     facilityId: item.facility.id || "",

//     physicianId: item.physician.id || "",

// });

// const onFetchListCarePlan = () => {

// }

// interface ManagePatientPageProps {
//     onAddNewCarePlan?: () => void;
// }

// const ManagePatientPage: React.FC<ManagePatientPageProps> = () => {
//     const [activeTab, setActiveTab] = useState<"active" | "inactive">("active")
//     const [searchText, setSearchText] = useState("")
//     const [pagination, setPagination] = useState<TablePaginationConfig>({
//         current: 1,
//         pageSize: 10,
//         showSizeChanger: true,
//         showQuickJumper: false,
//         showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
//         pageSizeOptions: ["3", "10", "20", "50", "100"],
//     })
//     const navigate = useNavigate();
//     //redux lấy thông tin:
//     const userFacilities = useSelector((state: RootState) => state.authenticator.user.id || "")

//     console.log("physician id từ redux: ", userFacilities);

//     // State for API variables
//     const [apiVariables, setApiVariables] = useState({
//         filter: {
//             physicianId: userFacilities, // This should come from user context
//             pagination: {
//                 page: 1,
//                 limit: 10
//             }
//         }
//     });

//     // Update API variables when userFacilities changes
//     useEffect(() => {
//         if (userFacilities) {
//             setApiVariables(prev => ({
//                 ...prev,
//                 filter: {
//                     ...prev.filter,
//                     physicianId: userFacilities
//                 }
//             }));
//         }
//     }, [userFacilities]);

//     // Use the real API hook
//     const { data: apiData, loading } = useListCarePlans(apiVariables);

//     const columns = useMemo(() => {
//         return renderColumns(onFetchListCarePlan);
//     }, [onFetchListCarePlan]);

//     // Convert API data to component format
//     const carePlanData: ICarePlan[] = useMemo(() => {
//         return apiData?.getListCarePlans?.data
//             ? apiData.getListCarePlans.data.map(mapCarePlanItemToICarePlan)
//             : [];
//     }, [apiData]);

//     console.log("careplanData: ", carePlanData);

//     // Filter data based on tab and search
//     const filteredData = useMemo(() => {
//         return carePlanData.filter((item) => {
//             const matchesTab = item.status === activeTab;
//             const matchesSearch =
//                 !searchText ||
//                 item.patientEmail.toLowerCase().includes(searchText.toLowerCase()) ||
//                 item.id.includes(searchText);
//             return matchesTab && matchesSearch;
//         });
//     }, [carePlanData, activeTab, searchText]);

//     console.log("filtered data: ", filteredData);

//     // Update pagination when API data changes
//     useEffect(() => {
//         if (apiData?.getListCarePlans?.pagination) {
//             const { total, page, limit } = apiData.getListCarePlans.pagination;
//             setPagination(prev => ({
//                 ...prev,
//                 current: page,
//                 pageSize: limit,
//                 total: total
//             }));
//         }
//     }, [apiData]);

//     // Don't render until we have physicianId
//     if (!userFacilities) {
//         return <div>Loading user information...</div>;
//     }



//     const handleSearch = (value: string) => {
//         setSearchText(value)
//         setPagination((prev) => ({ ...prev, current: 1 }))
//     }

//     const handleAddNewPatient = () => {
//         // if (onAddNewCarePlan) onAddNewCarePlan();
//         // else navigate("/physician/create-careplan");
//         navigate(`/mainboard/PHYSICIAN/new_carePlan`);
//     }

//     const handleTableChange = (newPagination: TablePaginationConfig) => {
//         setPagination(newPagination)
//         // Update API variables with new pagination
//         setApiVariables(prev => ({
//             ...prev,
//             filter: {
//                 ...prev.filter,
//                 pagination: {
//                     page: newPagination.current || 1,
//                     limit: newPagination.pageSize || 10
//                 }
//             }
//         }));
//     }

//     return (
//         <Card
//             style={{
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             }}
//         >
//             {/* Header with Tabs and Add Button */}
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     padding: "16px 24px 0 24px",
//                 }}
//             >
//                 <Tabs
//                     activeKey={activeTab}
//                     onChange={(key) => setActiveTab(key as "active" | "inactive")}
//                     style={{ marginBottom: 0 }}
//                 >
//                     <TabPane tab="Active" key="active" />
//                     <TabPane tab="Inactive" key="inactive" />
//                 </Tabs>

//                 <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     onClick={handleAddNewPatient}
//                     style={{
//                         backgroundColor: "#1890ff",
//                         borderColor: "#1890ff",
//                     }}
//                 >
//                     Add new patient
//                 </Button>
//             </div>

//             {/* Search Bar */}
//             <div style={{ padding: "16px 24px" }}>
//                 <Search
//                     placeholder="Search by patient name"
//                     allowClear
//                     enterButton={<SearchOutlined />}
//                     size="large"
//                     onSearch={handleSearch}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     style={{ maxWidth: 400 }}
//                 />
//             </div>

//             {/* Table */}
//             <div style={{ padding: "0 24px 24px 24px" }}>
//                 <Table<ICarePlan>
//                     columns={columns}
//                     dataSource={filteredData}
//                     rowKey="id"
//                     pagination={pagination}
//                     onChange={handleTableChange}
//                     scroll={{ x: 1300 }}
//                     size="middle"
//                     loading={loading}
//                     style={{
//                         backgroundColor: "white",
//                     }}
//                 />
//             </div>
//         </Card>
//     )
// }

// export default ManagePatientPage
