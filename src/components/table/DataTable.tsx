/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";


type TablePropsTable = {
  columns: ColumnsType<any>;
  data: any[];
  pagination: false | TablePaginationConfig | undefined;
  onChange: (pagination: TablePaginationConfig) => void;
};

const GlobalTable = ({
  columns,
  data,
  pagination,
  onChange,
}: TablePropsTable) => {
  return (
    <Table
    columns={columns}
    dataSource={data?.map(item => ({ ...item, key: item.id }))} 
    pagination={pagination}
    onChange={(pagination) => onChange(pagination)}
  />
  );
};

export default GlobalTable;
