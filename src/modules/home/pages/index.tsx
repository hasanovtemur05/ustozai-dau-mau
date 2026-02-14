/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { subMonths } from "date-fns";
import { DatePicker } from "antd";

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  AreaChart,
  Area,
  Line,
} from "recharts";

import GlobalTable from "../../../components/table/DataTable";
import { columns } from "./columns";
import { Loading } from "../../../components";
import {
  useGetDauData,
  useGetDauGeneralStats,
  useGetMrr,
} from "../hooks/queries";

const HomePage = () => {
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(20);

  // ===================== SORT STATE (optional) =====================
  const [sortBy, setSortBy] = useState<'streakCount' | 'launchCount'>('streakCount');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // ===================== DATE FILTERS (Bitta umumiy filter) =====================
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  // ===================== API CALLS =====================

  // Table API
  const { data: tableResponse, isLoading: tableLoading } = useGetDauData(
    tablePage,
    tableLimit,
    sortBy,
    order
  );

  console.log(tableResponse, "table data");


  // DAU Stats - umumiy startDate va endDate ishlatadi
  const { data: dauStatsData, isLoading: dauLoading } = useGetDauGeneralStats(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  // MAU Stats - umumiy startDate va endDate ishlatadi
  const { data: mauStatsData, isLoading: mauLoading } = useGetDauGeneralStats(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  // MRR Stats - umumiy startDate va endDate ishlatadi
  const { data: mrrData, isLoading: mrrLoading } = useGetMrr(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  // ===================== TABLE =====================
  const tableData = tableResponse?.data?.data || [];
  const pagination = tableResponse?.data?.meta?.pagination || {};

  // ===================== CHART DATA =====================
  const dauChartData = dauStatsData?.data?.data?.dauStats || [];
  const mauChartData = mauStatsData?.data?.data?.mauStats || [];

  // Transform MRR data for chart
  const mrrChartData = useMemo(() => {
    if (!mrrData) return [];

    return Object.entries(mrrData).map(([date, value]: any) => ({
      date,

      totalAmount:
        value?.totalAmount
          ? value.totalAmount / 100
          : 0,

      totalCount: value?.totalCount || 0,

      paymeAmount:
        value?.PAYME?.reduce(
          (sum: number, item: { amount: number; count: number }) =>
            sum + (item.amount * item.count) / 100,
          0
        ) || 0,

      clickAmount:
        value?.CLICK?.reduce(
          (sum: number, item: { amount: number; count: number }) =>
            sum + (item.amount * item.count) / 100,
          0
        ) || 0,
    }));
  }, [mrrData]);


  return (
    <div className="p-10 space-y-10 bg-gray-50 min-h-screen ">
      {/* ===================== DATE FILTERS (Bitta umumiy) ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Umumiy Filter (DAU, MAU, MRR)
          </h3>
          <div className="flex gap-4 items-center justify-end ">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-1">
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Boshlanish sanasi"
                  format="YYYY-MM-DD"
                />
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Tugash sanasi"
                  format="YYYY-MM-DD"
                />
              </div>
              <div className="text-sm text-gray-500">
                {startDate && endDate && (
                  <span>
                    {dayjs(endDate).diff(dayjs(startDate), 'day')} kun
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== CHART SECTION ===================== */}
      <div className="flex flex-col gap-6">
        {/* DAU + MAU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DAU Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Daily Active Users (DAU)
            </h3>
            {dauLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loading />
              </div>
            ) : dauChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={dauChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    tickFormatter={(date) => dayjs(date).format("MMM D")}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(
                      value: number | undefined,
                    ): [string, string] => [
                        value !== undefined ? new Intl.NumberFormat("uz-UZ").format(value) : "-",
                        "Foydalanuvchilar"
                      ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#22c55e"
                    name="DAU"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                Ma'lumot mavjud emas
              </div>
            )}
          </div>

          {/* MAU Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Monthly Active Users (MAU)
            </h3>
            {mauLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loading />
              </div>
            ) : mauChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={mauChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    // angle={}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(
                      value: number | undefined,
                    ): [string, string] => [
                        value !== undefined ? new Intl.NumberFormat("uz-UZ").format(value) : "-",
                        "Foydalanuvchilar"
                      ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    name="MAU"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                Ma'lumot mavjud emas
              </div>
            )}
          </div>
        </div>

        {/* ===================== MRR Area Chart ===================== */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Monthly Recurring Revenue (MRR)
          </h3>
          {mrrLoading ? (
            <div className="h-[500px] flex items-center justify-center">
              <Loading />
            </div>
          ) : mrrChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <AreaChart
                data={mrrChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  <linearGradient id="colorPayme" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => dayjs(date).format("MMM D")}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip
                  formatter={(
                    value: number | undefined,
                    name: string | undefined
                  ): [string, string] => [
                      value !== undefined ? new Intl.NumberFormat("uz-UZ").format(value) : "-",
                      name ?? "-"
                    ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="paymeAmount"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPayme)"
                  name="PAYME"
                  animationDuration={800}
                />
                <Area
                  type="monotone"
                  dataKey="clickAmount"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorClick)"
                  name="CLICK"
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  name="Umumiy hisob"
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-gray-400">
              Ma'lumot mavjud emas
            </div>
          )}
        </div>
      </div>

      {/* ===================== TABLE SECTION ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Foydalanuvchi Statistikasi
          </h3>

          {/* Sort controls */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'streakCount' | 'launchCount')}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="streakCount">Streak Count</option>
              <option value="launchCount">Launch Count</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="desc">Kamayish</option>
              <option value="asc">O'sish</option>
            </select>
          </div>
        </div>

        {tableLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <GlobalTable
            columns={columns(tablePage, tableLimit)}
            data={tableData}
            pagination={{
              current: pagination.pageNumber || 1,
              pageSize: pagination.pageSize || 20,
              total: pagination.count || 0,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30", "50"],
            }}
            onChange={({ current = 1, pageSize = 20 }) => {
              setTablePage(current);
              setTableLimit(pageSize);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;