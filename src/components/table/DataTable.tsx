/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from "antd";
import { useEffect, useRef, useState } from "react";
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
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isHandlingScroll = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isHandlingScroll.current) return;
      
      const container = tableContainerRef.current;
      if (!container || typeof pagination === 'boolean' || !pagination) return;

      const tableBody = container.querySelector('.ant-table-body') as HTMLElement;
      if (!tableBody) return;

      const { scrollTop, scrollHeight, clientHeight } = tableBody;
      const currentPage = pagination.current || 1;
      const pageSize = pagination.pageSize || 20;
      const total = pagination.total || 0;
      const totalPages = Math.ceil(total / pageSize);

      // Pastga scroll — keyingi sahifa
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      if (isNearBottom && !isLoadingMore && currentPage < totalPages) {
        isHandlingScroll.current = true;
        setIsLoadingMore(true);

        onChange({
          ...pagination,
          current: currentPage + 1,
          pageSize,
        });

        setTimeout(() => {
          setIsLoadingMore(false);
          isHandlingScroll.current = false;
        }, 800);
      }

      // Tepaga scroll — oldingi sahifaga qaytish
      const isNearTop = scrollTop <= 50;
      if (isNearTop && !isLoadingMore && currentPage > 1) {
        isHandlingScroll.current = true;
        setIsLoadingMore(true);

        onChange({
          ...pagination,
          current: currentPage - 1,
          pageSize,
        });

        setTimeout(() => {
          setIsLoadingMore(false);
          isHandlingScroll.current = false;
          // Scroll o'rtaga qaytarish — tepaga qaytganda doim 0 ga tushmasin
          tableBody.scrollTop = clientHeight;
        }, 800);
      }
    };

    const container = tableContainerRef.current;
    const tableBody = container?.querySelector('.ant-table-body');

    if (tableBody) {
      tableBody.addEventListener('scroll', handleScroll);
      return () => tableBody.removeEventListener('scroll', handleScroll);
    }
  }, [pagination, onChange, isLoadingMore]);

  const totalPages = pagination && typeof pagination !== 'boolean'
    ? Math.ceil((pagination.total || 0) / (pagination.pageSize || 20))
    : 0;

  return (
    <div ref={tableContainerRef} className="relative">
      <Table
        columns={columns}
        dataSource={data?.map(item => ({ ...item, key: item.id }))}
        pagination={false}
        scroll={{ y: 600 }}
        onChange={(pag) => onChange(pag)}
      />

      {isLoadingMore && (
        <div className="text-center py-4 text-gray-500">
          Yuklanmoqda...
        </div>
      )}

      {pagination && typeof pagination !== 'boolean' && (
        <div className="text-center py-2 text-sm text-gray-500 border-t">
          {pagination.current} / {totalPages} sahifa
          {' '}({pagination.total} ta)
        </div>
      )}
    </div>
  );
};

export default GlobalTable;