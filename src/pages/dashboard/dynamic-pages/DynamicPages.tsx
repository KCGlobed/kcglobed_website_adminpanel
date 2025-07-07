import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';
import type { ExcellenceSection } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { getPagesData } from '../../../store/slices/pagesSlice';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../../../components/TextEditor/ui/Button';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { formatDate } from '../../../utils';

const DynamicPages: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading } = useAppSelector((state) => state.pages);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = (id: string, row: ExcellenceSection) => {
    navigate(`/dashboard/dynamic-page/edit/${id}`, { state: { pageData: row } });
  };

  const handleDelete = (id: string) => {
    // confirmAlert({
    //   title: 'Confirm to delete',
    //   message: 'Are you sure you want to delete this item?',
    //   buttons: [
    //     {
    //       label: 'Yes',
    //       onClick: () => dispatch(deletePageData(id))
    //     },
    //     {
    //       label: 'No',
    //       onClick: () => { }
    //     }
    //   ]
    // });
  };

  const handleCreateNew = () => {
    navigate('/dashboard/create/dynamic-page');
  };

  const excellenceColumns: ColumnDefinition<ExcellenceSection>[] = useMemo(() => [
    { key: 'page_type', title: 'Page Type', align: 'center' },
    { key: 'section_type', title: 'Section Type', align: 'center' },
    { key: 'text_1', title: 'Text 1', align: 'left' },
    { key: 'text_2', title: 'Text 2', align: 'left' },
    { key: 'text_3', title: 'Text 3', align: 'left' },
    {
      key: 'image',
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
      key: 'slider_video',
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
    {
      key: 'created_at', title: 'Created At', align: 'center', render: (_, row) => {
        return formatDate(row.created_at)
      }
    },
    {
      key: 'actions',
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
  ], []);

  useEffect(() => {
    dispatch(getPagesData());
  }, [dispatch]);

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dynamic Pages</h2>
        <Button
          onClick={handleCreateNew}
          // variant="primary"
          className="ml-4"
        >
          Create New
        </Button>
      </div>
      <DynamicServerTable<ExcellenceSection>
        data={data}
        columns={excellenceColumns}
        currentPage={currentPage}
        pageSize={20}
        loading={loading}
        totalCount={data.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DynamicPages;