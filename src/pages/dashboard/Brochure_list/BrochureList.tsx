import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';
import type { BrochureUsers, Payload } from '../../../utils/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { getEnqueryForExport } from '../../../store/slices/contactUsSlice';
import { getBrochureUsers } from '../../../store/slices/brochureSlice';
import ExportButtons from '../../../components/export/ExportButtons';


const DownlaodBrochure: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading } = useAppSelector((state) => state.brochure);
  const { exportData } = useAppSelector((state) => state.contact);
  const dispatch = useAppDispatch()
  const enquiryColumns: ColumnDefinition<BrochureUsers>[] = useMemo(() => [
    { key: 'first_name', title: 'First Name', align: 'center' },
    { key: 'last_name', title: 'Last Name', align: 'center' },
    { key: 'email', title: 'Email', align: 'center' },
    { key: 'phone', title: 'Phone', align: 'center' },
    { key: 'state', title: 'State', align: 'center' },
    { key: 'city', title: 'City', align: 'center' },
    { key: 'county', title: 'Country', align: 'center' },
    { key: 'created_at', title: 'Date', align: 'center' },
  ], []);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-03');


  let exportUrl: string | null = null;
  if (exportData && typeof exportData === 'object' && !Array.isArray(exportData) && 'data' in exportData) {
    exportUrl = (exportData as any).data.csv_url || (exportData as any).data.pdf_url || null;
  }

  useEffect(() => {
    dispatch(getBrochureUsers())
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
    dispatch(getEnqueryForExport({ type: exportType, payload }))
    setShowExportModal(false);
    setExportType(null);
  };

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Download Brochure Reports</h2>
        {
          data?.length > 0 && <ExportButtons exportUrl={exportUrl} startDate={startDate} endDate={endDate} setShowExportModal={setShowExportModal} setStartDate={setStartDate} setEndDate={setEndDate} showExportModal={showExportModal} handleExportClick={handleExportClick} handleSendExport={handleSendExport} exportType={exportType} />
        }
      </div>
      <DynamicServerTable<BrochureUsers>
        data={data}
        columns={enquiryColumns}
        currentPage={currentPage}
        pageSize={20}
        loading={loading}
        totalCount={data.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default DownlaodBrochure; 