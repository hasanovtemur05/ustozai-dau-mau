import { useNavigate, useSearchParams } from "react-router-dom";
import GlobalTable from "../../../components/table/DataTable";
import type { ColumnsType } from "antd/es/table";
import { Loading } from "../../../components";
import { useGetDauData } from "../hooks/queries"; // adjust import path as needed

// Data type based on your API response
type UserDataType = {
  id: string;
  firstname: string;
  lastname: string;
  streakCount: number;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get pagination params from URL or use defaults
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "20");

  // Fetch data with pagination
  const { data, isLoading } = useGetDauData(pageNumber, pageSize);

  const handleTableChange = (pagination: {
    current?: number;
    pageSize?: number;
  }) => {
    const { current = 1, pageSize: newPageSize = 1 } = pagination;
    const params = new URLSearchParams();
    params.set("page", `${current}`);
    params.set("limit", `${newPageSize}`);
    navigate(`?${params.toString()}`);
  };

  if (isLoading) return <Loading />;

  const columns: ColumnsType<UserDataType> = [
    {
      title: "T/R",
      dataIndex: "index",
      render: (_text, _record, index) =>
        index + 1 + (pageNumber - 1) * pageSize,
    },
    {
      title: "First Name",
      dataIndex: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
    },
    {
      title: "Streak Count",
      dataIndex: "streakCount",
      render: (count: number) => (
        <span style={{ fontWeight: 'bold', color: count > 0 ? '#52c41a' : '#8c8c8c' }}>
          {count}
        </span>
      ),
    },
  ];

  const tableData = data?.data?.data || [];
  const pagination = data?.data?.meta?.pagination || {};

  return (
    <div className="p-[50px]">
      <div className="mb-4 flex items-center justify-between  p-4 ">
        <h1 className="text-2xl font-bold text-gray-800">
          Kunlik Faol Foydalanuvchilar (DAU)
        </h1>

        <div className="flex items-center gap-8 text-lg">
          <div className="font-semibold text-gray-700">
            DAU:
            <span className="ml-2 font-bold text-black">
              {pagination.count || 0}
            </span>
          </div>

          <div className="font-semibold text-gray-700">
            MAU:
            <span className="ml-2 font-bold text-blue-600">
              {data?.data?.meta?.data?.mau || 0}
            </span>
          </div>

          <div className="font-semibold text-gray-700">
            MRR:
            <span className="ml-2 font-bold text-green-600">
              {data?.data?.meta?.data?.mrr || 0}
            </span>
          </div>
        </div>
      </div>


      <GlobalTable
        columns={columns}
        data={tableData}
        pagination={{
          current: pagination.pageNumber || 1,
          pageSize: pagination.pageSize || 1,
          total: pagination.count || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "30", "50"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HomePage;