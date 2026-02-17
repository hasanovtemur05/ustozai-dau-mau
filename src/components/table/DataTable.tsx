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

  useEffect(() => {
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (!container || typeof pagination === 'boolean' || !pagination) return;

      const tableBody = container.querySelector('.ant-table-body');
      if (!tableBody) return;

      const { scrollTop, scrollHeight, clientHeight } = tableBody as HTMLElement;
      
      // Agar scroll pastki qismiga yetsa va hali ma'lumotlar bo'lsa
      const scrollThreshold = 50; // 50px qolganda load qiladi
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;
      
      if (isNearBottom && !isLoadingMore) {
        const currentPage = pagination.current || 1;
        const pageSize = pagination.pageSize || 20;
        const total = pagination.total || 0;
        const totalPages = Math.ceil(total / pageSize);

        // Agar keyingi sahifa mavjud bo'lsa
        if (currentPage < totalPages) {
          setIsLoadingMore(true);
          
          // Keyingi sahifaga o'tish
          onChange({
            ...pagination,
            current: currentPage + 1,
            pageSize: pageSize,
          });

          // Loading holatini tozalash
          setTimeout(() => setIsLoadingMore(false), 500);
        }
      }
    };

    const container = tableContainerRef.current;
    const tableBody = container?.querySelector('.ant-table-body');

    if (tableBody) {
      tableBody.addEventListener('scroll', handleScroll);
      return () => {
        tableBody.removeEventListener('scroll', handleScroll);
      };
    }
  }, [pagination, onChange, isLoadingMore]);

  return (
    <div ref={tableContainerRef} className="relative">
      <Table
        columns={columns}
        dataSource={data?.map(item => ({ ...item, key: item.id }))}
        pagination={false} // Pagination ni o'chiramiz, scroll ishlatamiz
        scroll={{ y: 600 }} // Vertical scroll qo'shamiz
        onChange={(pag) => onChange(pag)}
      />
      
      {isLoadingMore && (
        <div className="text-center py-4 text-gray-500">
          Yuklanmoqda...
        </div>
      )}

      {pagination && typeof pagination !== 'boolean' && (
        <div className="text-center py-2 text-sm text-gray-500 border-t">
          {pagination.current} / {Math.ceil((pagination.total || 0) / (pagination.pageSize || 20))} sahifa
        </div>
      )}
    </div>
  );
};

export default GlobalTable;