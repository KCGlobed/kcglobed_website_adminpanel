import React from 'react';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { useModal } from '../../context/ModalContext';

export type ColumnDefinition<T> = {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  onClick?: (value: T[keyof T], row: T) => void;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
};

type Props<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  className?: string;
};

function DynamicServerTable<T extends object>({
  data,
  columns,
  currentPage,
  pageSize,
  totalCount,
  loading = false,
  onPageChange,
  onSort,
  className = '',
}: Props<T>) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const [activeSort, setActiveSort] = React.useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const { showModal } = useModal();

  const handleSort = (key: keyof T) => {
    if (!onSort) return;

    const direction = activeSort.key === key && activeSort.direction === 'asc' ? 'desc' : 'asc';
    setActiveSort({ key, direction });
    onSort(key, direction);
  };

  const renderSkeleton = () =>
    Array.from({ length: pageSize }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100 last:border-0 animate-pulse">
        {columns.map((col, j) => (
          <td
            key={j}
            className={`px-6 py-4`}
            style={{
              textAlign: col.align || 'left',
              width: col.width || 'auto',
              minWidth: col.width || '150px',
              maxWidth: col.width || '300px',
            }}
          >
            <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
          </td>
        ))}
      </tr>
    ));

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden ${className}`}>
      {/* If no data, show only the empty state message, no table or pagination */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 w-full h-[70vh]">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No records found</p>
          <p className="text-gray-400 text-sm mt-1">No data available in table</p>
        </div>
      ) : (
        <>
          {/* Scrollable Table with Fixed Header */}
          <div className="relative max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className=" sticky top-0 z-10" style={{ background: 'oklch(55.8% 0.288 302.321)', color: '#fff' }}>
                <tr>
                  {columns.map(col => (
                    <th
                      key={String(col.key)}
                      className={`px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                        }`}
                      style={{
                        textAlign: col.align || 'left',
                        width: col.width || 'auto',
                        minWidth: col.width || '150px',
                        maxWidth: col.width || '300px',
                      }}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className={`flex items-center ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                        <span className="inline-flex items-center" style={{ color: '#fff' }}>
                          {col.title}
                          {col.sortable && (
                            <span className="ml-2 flex flex-col">
                              <FiFilter
                                className={`h-3 w-3 transition-opacity ${activeSort.key === col.key && activeSort.direction === 'asc'
                                  ? 'text-blue-600 opacity-100'
                                  : 'text-gray-400 opacity-70'
                                  }`}
                              />
                              <FiFilter
                                className={`h-3 w-3 transition-opacity transform rotate-180 -mt-1 ${activeSort.key === col.key && activeSort.direction === 'desc'
                                  ? 'text-blue-600 opacity-100'
                                  : 'text-gray-400 opacity-70'
                                  }`}
                              />
                            </span>
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  renderSkeleton()
                ) : (
                  data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                      {columns.map(col => {
                        const value = row[col.key];                        
                        // Handle different value types properly
                        let displayValue: string;
                        let modalContent: string;
                        
                        if (value === undefined || value === null || value === '') {
                          displayValue = '-';
                          modalContent = '-';
                        } else if (typeof value === 'object') {
                          // For objects, try to get a meaningful string representation
                          if (value instanceof Date) {
                            displayValue = value.toLocaleDateString();
                            modalContent = value.toLocaleString();
                          } else if (Array.isArray(value)) {
                            displayValue = value.length > 0 ? `${value.length} items` : 'Empty array';
                            modalContent = JSON.stringify(value, null, 2);
                          } else {
                            // For other objects, try to find a display property or use JSON
                            const displayProps = ['name', 'title', 'label', 'text', 'description'];
                            const displayProp = displayProps.find(prop => (value as any)[prop] !== undefined);
                            
                            if (displayProp && (value as any)[displayProp]) {
                              displayValue = String((value as any)[displayProp]);
                            } else {
                              displayValue = 'Object';
                            }
                            modalContent = JSON.stringify(value, null, 2);
                          }
                        } else {
                          displayValue = String(value);
                          modalContent = String(value);
                        }
                        
                        const handleCellClick = (e: React.MouseEvent<HTMLDivElement>) => {
                          const el = e.currentTarget;
                          if (el.scrollHeight > el.clientHeight) {
                            showModal({ title: col.title, content: modalContent });
                          }
                        };
                        return (
                          <td
                            key={String(col.key)}
                            className={`px-6 py-2 text-xs`}
                            style={{
                              textAlign: col.align || 'left',
                              width: col.width || 'auto',
                              minWidth: col.width || '150px',
                              maxWidth: col.width || '300px',
                            }}
                          >
                            <div
                              className={`flex items-center transition-colors ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'} cursor-pointer`}
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                maxHeight: '3.5em',
                              }}
                              title={'Click to view more'}
                              onClick={handleCellClick}
                            >
                              {col.render
                                ? col.render(row[col.key], row)
                                : displayValue}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium text-gray-700">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
              <span className="font-medium text-gray-700">{totalCount}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <FiChevronLeft size={18} />
                <span>Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${currentPage === totalPages
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <span>Next</span>
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DynamicServerTable;
