import React, { useEffect, useState } from 'react';
import DynamicServerTable from '../../../components/Table/Table';
import type { Payload, QuickContactProps } from '../../../utils/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import ExportButtons from '../../../components/export/ExportButtons';
import { getQuickContactSlice, getQuickContactSliceForExport } from '../../../store/slices/quickContactSlice';
import { Columns } from './column';

const QuickContact: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, exportData, count } = useAppSelector((state) => state.quickContact);
  const dispatch = useAppDispatch();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-03');

  let exportUrl: string | null = null;
  if (
    exportData &&
    typeof exportData === 'object' &&
    !Array.isArray(exportData) &&
    'data' in exportData
  ) {
    const dataObj = (exportData as {
      data?: { csv_url?: string; pdf_url?: string; excel_url?: string; file_url?: string };
    }).data;
    exportUrl = dataObj?.csv_url || dataObj?.excel_url || dataObj?.pdf_url || dataObj?.file_url || null;
  }

  useEffect(() => {
    dispatch(getQuickContactSlice({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleExportClick = (type: 'csv' | 'pdf') => {
    setExportType(type);
    setShowExportModal(true);
  };

  const handleSendExport = async () => {
    const type = exportType ?? 'csv';
    const payload: Payload = {
      start_date: startDate,
      end_date: endDate,
    };
    dispatch(getQuickContactSliceForExport({ type, payload }));
    setShowExportModal(false);
    setExportType(null);
  };

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Quick Contact Reports</h2>
        {
          data?.length > 0 && (
            <ExportButtons
              exportUrl={exportUrl}
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

      <DynamicServerTable<QuickContactProps>
        data={data}
        columns={Columns}
        currentPage={currentPage}
        pageSize={20}
        loading={loading}
        totalCount={count || data?.length || 0}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default QuickContact; 