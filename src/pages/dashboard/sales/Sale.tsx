import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';
import type { Payload, Subscription } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import ExportButtons from '../../../components/export/ExportButtons';
import { getActiveSales, getActiveSalesExcel } from '../../../store/slices/salesSlice';


const Sales: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { data: Sale, exportData, loading, count } = useAppSelector((state) => state.sales);
    const dispatch = useDispatch()
    const subscriptionColumns: ColumnDefinition<Subscription>[] = useMemo(() => [
        { key: 'first_name', title: 'First Name', align: 'center' },
        { key: 'last_name', title: 'Last Name', align: 'center' },
        { key: 'email', title: 'Email', align: 'center' },
        { key: 'mobile', title: 'Mobile', align: 'center' },
        { key: 'order_date', title: 'Order Date', align: 'center' },
        { key: 'end_date', title: 'End Date', align: 'center' },
        { key: 'payment_method', title: 'Payment Method', align: 'center' },
        { key: 'subscription_type', title: 'Subscription Type', align: 'center' },
        {
            key: 'plan_info',
            title: 'Plan Name',
            align: 'center',
            render: (_, row) => row.plan_info?.plan_name || '-'
        },
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
        dispatch(getActiveSales({ page: currentPage } as any) as any)
    }, [dispatch, currentPage])

    const handleExportClick = (type: 'csv' | 'pdf') => {
        setExportType(type);
        setShowExportModal(true);
    };

    const handleSendExport = async () => {
        const payload: Payload = {
            start_date: startDate,
            end_date: endDate,
        };
        dispatch(getActiveSalesExcel({ type: exportType, payload }) as any)
        setShowExportModal(false);
        setExportType(null);
    };

    return (
        <div className='overflow-x-hidden'>
            <div className="flex mb-4 gap-4 justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Active Subscriptions</h2>
                {
                    Sale?.length > 0 && <ExportButtons exportUrl={exportUrl} startDate={startDate} endDate={endDate} setShowExportModal={setShowExportModal} setStartDate={setStartDate} setEndDate={setEndDate} showExportModal={showExportModal} handleExportClick={handleExportClick} handleSendExport={handleSendExport} exportType={exportType} />
                }
            </div>
            <DynamicServerTable<Subscription>
                data={Sale}
                columns={subscriptionColumns}
                currentPage={currentPage}
                pageSize={20}
                loading={loading}
                totalCount={count}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Sales; 