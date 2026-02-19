/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
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
  useGetViewsDaily,
} from "../hooks/queries";

const HomePage = () => {
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(20);
  const [allTableData, setAllTableData] = useState<any[]>([]);

  const [sortBy, setSortBy] = useState<'streakCount' | 'launchCount'>('streakCount');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  // Tab state - localStorage bilan (refresh'dan keyin ham saqlanadi)
  const [activeTab, setActiveTab] = useState<1 | 2>(() => {
    const saved = localStorage.getItem("dauActiveTab");
    return saved === "2" ? 2 : 1;
  });

  const handleTabChange = (tab: 1 | 2) => {
    setActiveTab(tab);
    localStorage.setItem("dauActiveTab", String(tab));
  };

  // ===================== API CALLS =====================
  const { data: tableResponse, isLoading: tableLoading } = useGetDauData(
    tablePage,
    tableLimit,
    sortBy,
    order
  );

  const { data: dauStatsData, isLoading: dauLoading } = useGetDauGeneralStats(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  const { data: mauStatsData, isLoading: mauLoading } = useGetDauGeneralStats(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  const { data: mrrData, isLoading: mrrLoading } = useGetMrr(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  const { data: viewsData, isLoading: viewsLoading } = useGetViewsDaily(
    startDate?.format("YYYY-MM-DD") || "",
    endDate?.format("YYYY-MM-DD") || ""
  );

  // ===================== TABLE =====================
  const tableData = tableResponse?.data?.data || [];
  const pagination = tableResponse?.data?.meta?.pagination || {};

  useEffect(() => {
    if (tableData.length > 0) {
      if (tablePage === 1) {
        setAllTableData(tableData);
      } else {
        setAllTableData(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = tableData.filter((item: any) => !existingIds.has(item.id));
          return newItems.length > 0 ? [...prev, ...newItems] : prev;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const handleSortChange = (newSortBy: 'streakCount' | 'launchCount') => {
    setSortBy(newSortBy);
    setTablePage(1);
    setAllTableData([]);
  };

  const handleOrderChange = (newOrder: 'asc' | 'desc') => {
    setOrder(newOrder);
    setTablePage(1);
    setAllTableData([]);
  };

  // ===================== CHART DATA =====================
  const dauChartData = viewsData?.data || [];
  const mauChartData = mauStatsData?.data?.data?.mauStats || [];
  const dauStatis = dauStatsData?.data?.data?.dauStats || [];

  const mrrChartData = useMemo(() => {
    if (!mrrData) return [];
    return Object.entries(mrrData).map(([date, value]: any) => ({
      date,
      totalAmount: value?.totalAmount ? value.totalAmount / 100 : 0,
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

  // Active tab ga qarab kerakli data va loading
  const activeDauData = activeTab === 1 ? dauChartData : dauStatis;
  const activeDauLoading = activeTab === 1 ? viewsLoading : dauLoading;
  const activeDauDataKey = activeTab === 1 ? "date" : "label";
  const activeDauColor = activeTab === 1 ? "#3c82f6" : "#22c55e";

  return (
    <div className="p-10 space-y-10 bg-gray-50 h-full">
      {/* ===================== DATE FILTERS ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Umumiy Filter (DAU, MAU, MRR)
          </h3>
          <div className="flex gap-4 items-center justify-end">
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
                  <span>{dayjs(endDate).diff(dayjs(startDate), 'day')} kun</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== TAB BUTTONS ===================== */}
      <div className="w-full h-8 flex items-center justify-end gap-[20px]">
        <button
          onClick={() => handleTabChange(1)}
          className={`text-lg font-semibold px-[30px] py-[8px] rounded-lg transition-colors ${
            activeTab === 1
              ? "bg-sky-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Tab 1
        </button>
        <button
          onClick={() => handleTabChange(2)}
          className={`text-lg font-semibold px-[30px] py-[8px] rounded-lg transition-colors ${
            activeTab === 2
              ? "bg-sky-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Tab 2
        </button>
      </div>

      {/* ===================== CHART SECTION ===================== */}
      <div className="flex flex-col gap-6">
        {/* DAU + MAU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DAU Chart - Tab ga qarab almashadi */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Daily Active Users (DAU) — {activeTab === 1 ? "Views" : "Stats"}
            </h3>
            {activeDauLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loading />
              </div>
            ) : activeDauData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={activeDauData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey={activeDauDataKey}
                    tickFormatter={(date) => dayjs(date).format("MMM D")}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(value: number | undefined): [string, string] => [
                      value !== undefined
                        ? new Intl.NumberFormat("uz-UZ").format(value)
                        : "-",
                      "Foydalanuvchilar",
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="count"
                    fill={activeDauColor}
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
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(value: number | undefined): [string, string] => [
                      value !== undefined
                        ? new Intl.NumberFormat("uz-UZ").format(value)
                        : "-",
                      "Foydalanuvchilar",
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
                    value !== undefined
                      ? new Intl.NumberFormat("uz-UZ").format(value)
                      : "-",
                    name ?? "-",
                  ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
            <div className="flex items-center justify-center text-gray-400">
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
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'streakCount' | 'launchCount')}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="streakCount">Streak Count</option>
              <option value="launchCount">Launch Count</option>
            </select>
            <select
              value={order}
              onChange={(e) => handleOrderChange(e.target.value as 'asc' | 'desc')}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="desc">Kamayish</option>
              <option value="asc">O'sish</option>
            </select>
          </div>
        </div>

        {tableLoading && tablePage === 1 ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <GlobalTable
            columns={columns(tablePage, tableLimit)}
            data={allTableData}
            pagination={{
              current: tablePage,
              pageSize: tableLimit,
              total: pagination.count || 0,
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