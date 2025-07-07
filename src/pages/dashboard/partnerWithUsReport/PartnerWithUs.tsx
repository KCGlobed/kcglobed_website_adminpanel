import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';
import type { PartnerWithUs, Payload } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import ExportButtons from '../../../components/export/ExportButtons';
import { getPartnerWithUs, getPartnerWithUsForExport } from '../../../store/slices/partnerwithusslice';


const PartnerWitUs: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, exportData } = useAppSelector((state) => state.partnerWithUs);
  const dispatch = useDispatch()
  const enquiryColumns: ColumnDefinition<PartnerWithUs>[] = useMemo(() => [
    { key: 'first_name', title: 'First Name', align: 'center' },
    { key: 'last_name', title: 'Last Name', align: 'center' },
    { key: 'email', title: 'Email', align: 'center' },
    { key: 'phone', title: 'Phone', align: 'center' },
    { key: 'partner_type', title: 'Partner Type', align: 'center' },
    { key: 'address', title: 'Address', align: 'left' },
    { key: 'state', title: 'State', align: 'center' },
    { key: 'city', title: 'City', align: 'center' },
    { key: 'country', title: 'Country', align: 'center' },
    { key: 'pincode', title: 'Pincode', align: 'center' },
    { key: 'query', title: 'Query', align: 'left' },
    {
      key: 'document',
      title: 'Document',
      align: 'center',
      render: (_, row) =>
        row.document ? (
          <a
            href={`${row.document}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
          '-'
        )
    },
    { key: 'created_at', title: 'Date', align: 'center' }
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
    dispatch(getPartnerWithUs())
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
    dispatch(getPartnerWithUsForExport({ type: exportType, payload }))
    setShowExportModal(false);
    setExportType(null);
  };

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Partner With Us Reports</h2>
        {
          data?.length > 0 && <ExportButtons exportUrl={exportUrl} startDate={startDate} endDate={endDate} setShowExportModal={setShowExportModal} setStartDate={setStartDate} setEndDate={setEndDate} showExportModal={showExportModal} handleExportClick={handleExportClick} handleSendExport={handleSendExport} exportType={exportType} />
        }
      </div>



      <DynamicServerTable<PartnerWithUs>
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

export default PartnerWitUs; 