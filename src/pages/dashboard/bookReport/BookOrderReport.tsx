import React, { useEffect, useState } from 'react';
import DynamicServerTable from '../../../components/Table/Table';
import { enquiry } from '../../../data/partnerwithuseDummy';
import type { BookOrder, Payload } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import ExportButtons from '../../../components/export/ExportButtons';
import { getSuccessBook, getSuccessBookForExport } from '../../../store/slices/bookOrderSlice';
import { Columns } from './column';
import { BsEyeFill } from 'react-icons/bs';
import { useModal } from '../../../context/ModalContext';
import { fetchBookOrderDetail } from '../../../services/bookOrder';
import { ModalContent } from './ModalContent';
import { generateOrderPDF } from './GeneratePDF';
const BookOrderReport: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, exportData } = useAppSelector((state) => state.book);
  const dispatch = useDispatch()
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-03');
  const { showModal } = useModal()
  const [pdfReady, setPdfReady] = useState(false);
  const reportTemplateRef = React.createRef<HTMLDivElement>();
  let exportUrl: string | null = null;
  if (exportData && typeof exportData === 'object' && !Array.isArray(exportData) && 'data' in exportData) {
    exportUrl = (exportData as any).data.csv_url || (exportData as any).data.pdf_url || null;
  }

  useEffect(() => {
    dispatch(getSuccessBook() as any)
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
    dispatch(getSuccessBookForExport({ type: exportType, payload }) as any)
    setShowExportModal(false);
    setExportType(null);
  };


  const handleOpenBookDetails = async (order: any) => {
    const res = await fetchBookOrderDetail(order.id);
    const data = res?.data || res;
    if (!data) return;

    // Reset PDF ready state
    setPdfReady(false);

    showModal({
      title: (
        <div className="flex justify-between items-center">
          <span>Order Details - #{data.orderID}</span>
          <button
            onClick={() => generateOrderPDF(data)}
            disabled={!pdfReady}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
          >
            Download PDF
          </button>
        </div>
      ),
      size: "lg",
      content: (
        <div style={{
          color: "#111",
          backgroundColor: "#fff",
          padding: "16px",
        }}>
          <ModalContent
            ref={reportTemplateRef}
            data={data}
            onReadyForPdf={() => setPdfReady(true)}
          />
        </div>
      ),
    } as any);
  };

  const tableColumns = [
    ...Columns,
    {
      key: "actions",
      title: "View",
      align: "center",
      render: (_, row: BookOrder) => (
        <button
          onClick={() => handleOpenBookDetails(row)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="View Details"
        >
          <BsEyeFill className="w-5 h-5" />
        </button>
      ),
    },
  ];
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
        columns={tableColumns as any}
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