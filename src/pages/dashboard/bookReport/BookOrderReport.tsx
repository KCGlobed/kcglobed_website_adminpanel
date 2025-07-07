import React, { useEffect, useState } from 'react';
import DynamicServerTable from '../../../components/Table/Table';
import { enquiry } from '../../../data/partnerwithuseDummy';
import type { BookOrder, Payload } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { getEnqueryForExport } from '../../../store/slices/contactUsSlice';
import ExportButtons from '../../../components/export/ExportButtons';
import { getSuccessBook, getSuccessBookForExport } from '../../../store/slices/bookOrderSlice';
import { Columns } from './column';


const BookOrderReport: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, exportData } = useAppSelector((state) => state.book);
  const dispatch = useDispatch()
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-03');


  let exportUrl: string | null = null;
  if (exportData && typeof exportData === 'object' && !Array.isArray(exportData) && 'data' in exportData) {
    exportUrl = (exportData as any).data.csv_url || (exportData as any).data.pdf_url || null;
  }

  useEffect(() => {
    dispatch(getSuccessBook())
  }, [dispatch])

  const handleExportClick = (type: 'csv' | 'pdf') => {
    setExportType(type);
    setShowExportModal(true);
  };

  const handleSendExport = async () => {
    const payload: Payload = {
      start_date: startDate,
      end_date: endDate,
    };
    dispatch(getSuccessBookForExport({ type: exportType, payload }))
    setShowExportModal(false);
    setExportType(null);
  };

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Book Order Reports</h2>
        {
          data?.length > 0 && <ExportButtons exportUrl={exportUrl} startDate={startDate} endDate={endDate} setShowExportModal={setShowExportModal} setStartDate={setStartDate} setEndDate={setEndDate} showExportModal={showExportModal} handleExportClick={handleExportClick} handleSendExport={handleSendExport} exportType={exportType} />
        }
      </div>

      <DynamicServerTable<BookOrder>
        data={data}
        columns={Columns}
        currentPage={currentPage}
        pageSize={20}
        loading={loading}
        totalCount={enquiry.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default BookOrderReport; 