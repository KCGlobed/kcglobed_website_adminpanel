import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';
import type { ExcellenceSection as ExcellenceSectionBase } from '../../../utils/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { deletePageData, getPagesData } from '../../../store/slices/pagesSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/TextEditor/ui/Button';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { formatDate } from '../../../utils';
import { useAlert } from '../../../context/AlertContext';

// Add index signature for dynamic key access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ExcellenceSection extends ExcellenceSectionBase { [key: string]: any }

const DynamicPages: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageType, setSelectedPageType] = useState<string>('');
  const { data, loading, count } = useAppSelector((state) => state.pages);
  const { showConfirm } = useAlert()
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEdit = (id: string | number, row: ExcellenceSection) => {
    navigate(`/dashboard/dynamic-page/edit/${id}`, { state: { pageData: row } });
  };

  const handleDelete = (id: string | number) => {
    showConfirm({
      message: 'Are you sure you want to delete this item?',
      onConfirm: () => dispatch(deletePageData(id as any)),
      onCancel: () => { },
    });
  };

  const handleCreateNew = () => {
    navigate('/dashboard/create/dynamic-page');
  };

  // Get unique page_type values
  const pageTypes = useMemo(() => {
    return Array.from(new Set(data.map((item) => (item as any)['page_type']))).filter(Boolean);
  }, [data]);

  // Filter data based on selected page_type
  const filteredData = useMemo(() => {
    if (!selectedPageType) return data;
    return data.filter((item) => (item as any)['page_type'] === selectedPageType);
  }, [data, selectedPageType]);

  const excellenceColumns: ColumnDefinition<ExcellenceSection>[] = useMemo(() => [
    { key: 'page_type' as keyof ExcellenceSection, title: 'Page Type', align: 'center' },
    { key: 'section_type' as keyof ExcellenceSection, title: 'Section Type', align: 'center' },
    { key: 'text_1' as keyof ExcellenceSection, title: 'Text 1', align: 'left' },
    { key: 'text_2' as keyof ExcellenceSection, title: 'Text 2', align: 'left' },
    { key: 'text_3' as keyof ExcellenceSection, title: 'Text 3', align: 'left' },
    {
      key: 'image' as keyof ExcellenceSection,
      title: 'Image',
      align: 'center',
      render: (_, row) =>
        row.image ? (
          <img
            src={row.image}
            alt="Section Image"
            className="w-16 h-16 object-contain mx-auto"
          />
        ) : (
          '-'
        )
    },
    {
      key: 'slider_video' as keyof ExcellenceSection,
      title: 'Video',
      align: 'center',
      render: (_, row) =>
        row.slider_video ? (
          <a
            href={row.slider_video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline" 
          >
            View Video
          </a>
        ) : (
          '-'
        )
    },
    { key: 'order' as keyof ExcellenceSection, title: 'Order', align: 'left' },
    {
      key: 'actions' as keyof ExcellenceSection,
      title: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex justify-center space-x-2">
          <GlassButton
            onClick={() => handleEdit(row.id, row)}
            icon={<FiEdit className="text-base" />}
            color="green"
            title="Edit"
          />
          <GlassButton
            onClick={() => handleDelete?.(row.id)}
            icon={<FiTrash className="text-base" />}
            color="red"
            title="Delete"
          />
        </div>
      )
    }
  ], [handleEdit, handleDelete]);

  useEffect(() => {
    dispatch(getPagesData(currentPage as any));
  }, [dispatch, currentPage]);

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dynamic Pages</h2>
        <div className="flex items-center gap-2">
          <select
            className="border border-purple-500 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 hover:border-purple-600 transition-colors duration-200 shadow-sm"
            style={{ minWidth: 140 }}
            value={selectedPageType}
            onChange={e => setSelectedPageType(e.target.value)}
          >
            <option value="">All Pages</option>
            {pageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Button
            onClick={handleCreateNew}
            className="ml-2"
          >
            Create New
          </Button>
        </div>
      </div>
      <DynamicServerTable<ExcellenceSection>
        data={filteredData}
        columns={excellenceColumns}
        currentPage={currentPage}
        pageSize={20}
        loading={loading}
        totalCount={count}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DynamicPages;