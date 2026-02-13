// columns.ts
import type { ColumnsType } from "antd/es/table";

type UserDataType = {
  id: string;
  firstname: string;
  lastname: string;
  streakCount: number;
  referralCount: number;
  // lunchCount: number
};

export const columns = (pageNumber: number, pageSize: number): ColumnsType<UserDataType> => [
  {
    title: "T/R",
    dataIndex: "index",
    render: (_text, _record, index) => index + 1 + (pageNumber - 1) * pageSize,
  },
  { title: "Familiya", dataIndex: "firstname" },
  { title: "Isim", dataIndex: "lastname" },
  {
    title: "Streak Count",
    dataIndex: "streakCount",
    render: (count: number) => (
      <span style={{ fontWeight: 'bold', color: count > 0 ? '#52c41a' : '#8c8c8c' }}>{count}</span>
    ),
  },
   {
    title: "Murojatlar Soni",
    dataIndex: "referralCount",
    render: (count: number) => (
      <span style={{ fontWeight: 'bold', color: count > 0 ? '#52c41a' : '#8c8c8c' }}>{count}</span>
    ),
  },
  
];
