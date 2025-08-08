import React, { useState } from 'react';
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
  enableFilters?: boolean;
  filters?: Record<keyof T, { type: 'text' | 'alpha-range'; value: string }>;
  onFilterChange?: (filters: Record<keyof T, { type: 'text' | 'alpha-range'; value: string }>) => void;
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
  onFilterChange,
  enableFilters = false,
}: Props<T>) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const [openFilterKey, setOpenFilterKey] = React.useState<keyof T | null>(null);
  const [filterInput, setFilterInput] = React.useState<Record<keyof T, string>>();
  const [alphaRange, setAlphaRange] = useState({});

  const [activeSort, setActiveSort] = React.useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const { showModal } = useModal();


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
  const [searchTerm, setSearchTerm] = React.useState('');




  const handleSort = (key: keyof T, direction: 'asc' | 'desc') => {
    setActiveSort({ key, direction });
    onSort?.(key, direction);
  };


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
              <thead
                className="sticky top-0 z-10"
                style={{ background: 'oklch(55.8% 0.288 302.321)', color: '#000' }}
              >
                <tr>
                  {columns?.map((col, i) => (
                    <th
                      key={String(col?.key)}
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider relative"
                      style={{
                        textAlign: col.align || 'left',
                        width: col.width || 'auto',
                        minWidth: col.width || '150px',
                        maxWidth: col.width || '300px',
                      }}
                    >
                      <div
                        className={`flex items-center ${col.align === 'right'
                          ? 'justify-end'
                          : col.align === 'center'
                            ? 'justify-center'
                            : 'justify-start'
                          } relative`}
                      >
                        <span style={{ color: '#fff' }}>{col.title}</span>

                        {/* Sort/Filter Toggle Button */}
                        {enableFilters && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFilterKey(openFilterKey === col.key ? null : col.key);
                              setSearchTerm('');
                            }}
                            className="ml-2 text-white hover:text-gray-300"
                          >
                            <FiFilter size={14} />
                          </button>
                        )}

                        {/* Dropdown Panel */}
                        {enableFilters && openFilterKey === col.key && (
                          <div
                            className={`absolute z-50 top-full mt-2 bg-white border border-gray-300 rounded shadow-lg w-72 text-sm ${i === 0 ? 'left-0' : i === columns.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                              }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Sorting Buttons */}
                            <div className="border-b border-gray-200">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  handleSort(col.key, 'asc');
                                  setOpenFilterKey(null);
                                }}
                              >
                                Sort A to Z
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  handleSort(col.key, 'desc');
                                  setOpenFilterKey(null);
                                }}
                              >
                                Sort Z to A
                              </button>
                            </div>

                            {/* Clear Filter Button */}
                            <button
                              className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-100"
                              onClick={() => {
                                const updated = { ...filters };
                                delete updated[col.key];
                                onFilterChange?.(updated);
                                setOpenFilterKey(null);
                              }}
                            >
                              Clear Filter
                            </button>

                            {/* Text Search */}
                            {col?.key && (
                              <div className="px-3 py-2 border-t border-b border-gray-200">
                                <input
                                  type="text"
                                  placeholder="Search"
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  value={filterInput?.[col.key] || ''}
                                  onChange={(e) =>
                                    setFilterInput((prev) => ({
                                      ...prev,
                                      [col.key]: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            )}

                            {/* A–Z Range */}
                            <div className="px-3 py-2 text-xs text-gray-700 space-y-2 flex items-center justify-between">
                              <div className="flex flex-col items-start gap-1">
                                <label className="text-gray-600">From:</label>
                                <div className="relative">
                                  <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm max-h-[300px] overflow-y-auto"
                                    value={alphaRange[col.key]?.from || ''}
                                    onChange={(e) =>
                                      setAlphaRange((prev) => ({
                                        ...prev,
                                        [col.key]: {
                                          ...prev[col.key],
                                          from: e.target.value,
                                        },
                                      }))
                                    }
                                  >
                                    <option value="">--</option>
                                    {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((ch) => (
                                      <option key={ch} value={ch}>
                                        {ch}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="flex flex-col items-start gap-1">
                                <label className="text-gray-600">To:</label>
                                <div className="relative">
                                  <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm max-h-[300px] overflow-y-auto"
                                    value={alphaRange[col.key]?.to || ''}
                                    onChange={(e) =>
                                      setAlphaRange((prev) => ({
                                        ...prev,
                                        [col.key]: {
                                          ...prev[col.key],
                                          to: e.target.value,
                                        },
                                      }))
                                    }
                                  >
                                    <option value="">--</option>
                                    {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((ch) => (
                                      <option key={ch} value={ch}>
                                        {ch}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 px-4 py-2 border-t border-gray-200">
                              <button
                                onClick={() => setOpenFilterKey(null)}
                                className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  const from = alphaRange[col.key]?.from;
                                  const to = alphaRange[col.key]?.to;

                                  if (from && to && from <= to) {
                                    onFilterChange?.({
                                      ...filters,
                                      [col.key]: {
                                        type: 'alpha-range',
                                        value: { from, to },
                                      },
                                    });
                                  } else if (filterInput[col.key]) {
                                    onFilterChange?.({
                                      ...filters,
                                      [col.key]: {
                                        type: 'text',
                                        value: filterInput[col.key],
                                      },
                                    });
                                  }

                                  setOpenFilterKey(null);
                                }}
                                className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </th>
                  ))}
                </tr>
              </thead>



              <tbody className="bg-white divide-y divide-gray-200">
                {loading || !data ? (
                  renderSkeleton()
                ) : (
                  data?.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                      {columns?.map(col => {
                        const value = row[col?.key];
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
                                ? col.render(row[col?.key], row)
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
