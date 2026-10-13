import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';
import type { Payload, SubscriberUser } from '../../../utils/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { getSubscriberUsers, getSubscribersForExport } from '../../../store/slices/subscriberSlice';
import ExportButtons from '../../../components/export/ExportButtons';

const SubscriberUsers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, exportData, count } = useAppSelector((state) => state.subscriber);
  const dispatch = useAppDispatch();

  const enquiryColumns: ColumnDefinition<SubscriberUser>[] = useMemo(() => [
    { key: 'email', title: 'Email', align: 'left' },
    {
      key: 'created_at',
      title: 'Date',
      align: 'center',
      render: (value) => {
        if (!value) return '-';
        try {
          return new Date(value as string).toLocaleDateString();
        } catch {
          return String(value);
        }
      }
    },
  ], []);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-03');

  let exportUrl: string | null = null;
  let exportFileName: string | undefined;
  if (
    exportData &&
    typeof exportData === 'object' &&
    !Array.isArray(exportData) &&
    'data' in exportData
  ) {
    const dataObj = (exportData as {
      data?: {
        csv_url?: string;
        pdf_url?: string;
        excel_url?: string;
        file_url?: string;
        file_name?: string;
      };
    }).data;
    exportUrl = dataObj?.excel_url || dataObj?.csv_url || dataObj?.pdf_url || dataObj?.file_url || null;
    exportFileName = dataObj?.file_name;
  }

  useEffect(() => {
    dispatch(getSubscriberUsers(currentPage));
  }, [dispatch, currentPage]);

  const handleExportClick = (type: 'csv' | 'pdf') => {
    setExportType(type);
    setShowExportModal(true);
  };

  const handleSendExport = async () => {
    if (!exportType) return;
    const payload: Payload = {
      start_date: startDate,
      end_date: endDate,
    };
    dispatch(getSubscribersForExport({ type: exportType, payload }));
    setShowExportModal(false);
    setExportType(null);
  };

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Subscribers Reports</h2>
        {
          data?.length > 0 && (
            <ExportButtons
              exportUrl={exportUrl}
              exportFileName={exportFileName}
              startDate={startDate}
              endDate={endDate}
              setShowExportModal={setShowExportModal}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              showExportModal={showExportModal}
              handleExportClick={handleExportClick}
              handleSendExport={handleSendExport}
              exportType={exportType}
            />
          )
        }
      </div>
      <DynamicServerTable<SubscriberUser>
        data={data}
        columns={enquiryColumns}
        currentPage={currentPage}
        pageSize={20}
        loading={loading}
        totalCount={count || data?.length || 0}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SubscriberUsers;
