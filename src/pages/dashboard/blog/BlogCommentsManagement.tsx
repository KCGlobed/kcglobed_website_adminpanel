import { useState, useEffect, useMemo } from 'react';
import DynamicServerTable, { type ColumnDefinition } from '../../../components/Table/Table';
import { useDispatch } from 'react-redux';
import { approveRejectBlogComment, deleteBlogComment, getBlogComments } from '../../../store/slices/blogSlice';
import { useAppSelector } from '../../../hooks/useRedux';
import type { Comment } from '../../../utils/types';
import GlassButton from '../../../components/Button/Button';
import { MdDelete } from "react-icons/md";
import { formatDate } from '../../../utils';
import ExportButtons from '../../../components/export/ExportButtons';
import { getPartnerWithUsForExport } from '../../../store/slices/partnerwithusslice';


const BlogCommentsManagement = () => {
    const { comments: data, loading } = useAppSelector(state => state.blog)
    let exportData = []
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState<number | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
    const [startDate, setStartDate] = useState('2025-07-01');
    const [endDate, setEndDate] = useState('2025-07-03');
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getBlogComments() as any)
    }, []);


    const updateCommentStatus = async (commentId: number, newStatus: number) => {
        try {
            await dispatch(approveRejectBlogComment({ comment_id: commentId, status: newStatus } as any) as any);
            dispatch(getBlogComments() as any);
        } catch (err) {
            setError('Failed to update comment status');
            console.error(err);
        }
    };

    const deleteCommentAction = async (commentId: number) => {
        try {
            await dispatch(deleteBlogComment(commentId as any) as any)
            dispatch(getBlogComments() as any)
        } catch (err) {
            setError('Failed to delete comment');
            console.error(err);
        }
    };


    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">New</span>;
            case 1:
                return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">Approved</span>;
            case 2:
                return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">Rejected</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">Unknown</span>;
        }
    };


    // Filter data based on selected status
    const filteredData = useMemo(() => {
        if (filter === null) {
            return data;
        }
        return data.filter(comment => comment.status === filter);
    }, [data, filter]);

    const commentColumns: ColumnDefinition<Comment>[] = useMemo(() => [
        { key: 'id', title: 'ID', align: 'center' },
        { key: 'name', title: 'Name', align: 'center' },
        { key: 'email', title: 'Email', align: 'center' },
        { key: 'comment', title: 'Comment', align: 'left' },
        {
            key: 'status',
            title: 'Status',
            align: 'center',
            render: (_, row) => getStatusBadge(row.status),
        },
        {
            key: 'blog_info',
            title: 'Blog Title',
            align: 'left',
            render: (_, row) => <span>{row.blog_info?.title || 'N/A'}</span>,
        },
        {
            key: 'created_at', title: 'Date', align: 'center', render: (_, row) => {
                return formatDate(row.created_at)
            }
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'left',
            render: (_, row: any) => (
                <div className="flex space-x-2">
                    <GlassButton
                        onClick={() => updateCommentStatus(row.id, 1)}
                        icon={"Approve"}
                        color="green"
                        title="Approve"
                        disabled={row.status === 1}
                    />
                    <GlassButton
                        onClick={() => updateCommentStatus(row.id, 2)}
                        icon={"Reject"}
                        color="red"
                        title="Reject"
                        disabled={row.status === 2}
                    />
                    <GlassButton
                        onClick={() => deleteCommentAction(row.id)}
                        icon={<MdDelete className="text-base" />}
                        color="red"
                        title="Delete"
                    />
                </div>
            )
        }
    ], []);

    let exportUrl: string | null = null;
    if (exportData && typeof exportData === 'object' && !Array.isArray(exportData) && 'data' in exportData) {
        exportUrl = (exportData as any).data.csv_url || (exportData as any).data.pdf_url || null;
    }
    const handleExportClick = (type: 'csv' | 'pdf') => {
        setExportType(type);
        setShowExportModal(true);
    };

    const handleSendExport = async () => {
        const payload = {
            start_date: startDate,
            end_date: endDate,
        };
        dispatch(getPartnerWithUsForExport({ type: exportType, payload }) as any)
        setShowExportModal(false);
        setExportType(null);
    };
    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Blog Comments Management</h1>
                {
                    data?.length > 0 && <ExportButtons exportUrl={exportUrl} startDate={startDate} endDate={endDate} setShowExportModal={setShowExportModal} setStartDate={setStartDate} setEndDate={setEndDate} showExportModal={showExportModal} handleExportClick={handleExportClick} handleSendExport={handleSendExport} exportType={exportType} />
                }
                <div className="flex space-x-4">
                    <button
                        onClick={() => {
                            setFilter(null);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded ${filter === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        All Comments
                    </button>
                    <button
                        onClick={() => {
                            setFilter(1);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded ${filter === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => {
                            setFilter(2);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded ${filter === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <DynamicServerTable<Comment>
                data={filteredData}
                columns={commentColumns}
                currentPage={currentPage}
                pageSize={20}
                totalCount={filteredData.length}
                onPageChange={setCurrentPage}
                loading={loading}
            />
        </div>
    );
};

export default BlogCommentsManagement;