import React, { useEffect, useMemo, useState } from 'react';
import type { ExcellenceSection } from '../../../utils/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { deletePageData, getPagesData } from '../../../store/slices/pagesSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/TextEditor/ui/Button';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { formatDate } from '../../../utils';
import { useAlert } from '../../../context/AlertContext';
import { useModal } from '../../../context/ModalContext';
import { Link } from 'react-router-dom';
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
// Add a type for grouped row
interface GroupedPageRow extends ExcellenceSection {
  page_type: string;
  section_types: string[];
  children: ExcellenceSection[];
}

const DynamicPages: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading } = useAppSelector((state) => state.pages);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showConfirm, showAlert } = useAlert();
  const { showModal } = useModal();

  const handleEdit = (id: string | number, row: ExcellenceSection) => {
    navigate(`/dashboard/dynamic-page/edit/${id}`, { state: { pageData: row } });
  };

  const handleDelete = (id: number) => {
    showConfirm({
      message: "Are you sure you want to delete?",
      onConfirm: async () => {
        try {
          await dispatch(deletePageData(id))
          showAlert("Blog Deleted Successfully...", "success");
        } catch (e: any) {
          showAlert("Something Went Wrong...", "error");
        }
      },
      onCancel: () => showAlert("Cancelled", "info"),
    });
  };

  const handleCreateNew = () => {
    navigate('/dashboard/create/dynamic-page');
  };

  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const toggleExpand = (pageType: string) => {
    setExpanded(prev => ({ ...prev, [pageType]: !prev[pageType] }));
  };

  // Group data by page_type
  const groupedData = useMemo<GroupedPageRow[]>(() => {
    const map = new Map<string, GroupedPageRow>();
    data.forEach((item: ExcellenceSection) => {
      const pageType = item.page_type as string;
      if (!map.has(pageType)) {
        map.set(pageType, {
          ...item,
          page_type: pageType,
          section_types: [item.section_type],
          children: [item],
        });
      } else {
        const entry = map.get(pageType)!;
        entry.section_types.push(item.section_type);
        entry.children.push(item);
      }
    });
    return Array.from(map.values());
  }, [data]);

  useEffect(() => {
    dispatch(getPagesData());
  }, [dispatch]);

  return (
    <div className='overflow-x-hidden'>
      <div className="flex mb-4 gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dynamic Pages</h2>
        <Button
          onClick={handleCreateNew}
          className="ml-4"
        >
          Create New
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {groupedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 w-full h-[70vh]">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg font-medium">No records found</p>
            <p className="text-gray-400 text-sm mt-1">No data available in table</p>
          </div>
        ) : (
          <>
            <div className="relative max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="sticky top-0 z-10" style={{ background: 'oklch(55.8% 0.288 302.321)', color: '#fff' }}>
                  <tr>
                    <th className="px-6 py-4 text-center w-10"></th>
                    <th className="px-6 py-4 text-left text-xs font-bold  min-w-[150px] uppercase tracking-wider">Page</th>
                    <th className="px-6 py-4 text-center text-xs font-bold  min-w-[150px] uppercase tracking-wider">Page Order</th>
                    <th className="px-6 py-4 text-center text-xs font-bold  min-w-[150px] uppercase tracking-wider">Section Types</th>
                    <th className="px-6 py-4 text-left text-xs font-bold min-w-[200px] uppercase tracking-wider">Text 1</th>
                    <th className="px-6 py-4 text-left text-xs font-bold  min-w-[200px] uppercase tracking-wider">Text 2</th>
                    <th className="px-6 py-4 text-left text-xs font-bold  min-w-[200px] uppercase tracking-wider">Text 3</th>
                    <th className="px-6 py-4 text-center text-xs font-bold  min-w-[150px] uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-center text-xs font-bold  min-w-[150px] uppercase tracking-wider">Video</th>
                    <th className="px-6 py-4 text-center text-xs font-bold min-w-[150px] uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedData.map((row: GroupedPageRow, i: number) => {
                    // Section Types cell logic
                    const sectionTypes = row.section_types;
                    let displaySectionTypes = sectionTypes.join(', ');
                    let showEllipsis = false;
                    if (sectionTypes.length > 2) {
                      displaySectionTypes = sectionTypes.slice(0, 2).join(', ') + ', ...';
                      showEllipsis = true;
                    }
                    return (
                      <React.Fragment key={row.page_type}>
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-2 text-center">
                            <button
                              onClick={() => toggleExpand(row.page_type)}
                              className="text-lg cursor-pointer font-bold focus:outline-none"
                              aria-label={expanded[row.page_type] ? 'Collapse' : 'Expand'}
                            >
                              {expanded[row.page_type] ? <MdExpandLess className='font-bold text-gray-600 text-2xl' /> : <MdExpandMore className='font-bold text-gray-600 text-2xl' />}
                            </button>
                          </td>
                          <td className="px-6 py-2 text-xs font-medium text-gray-900">{row.page_type}</td>
                          <td className="px-6 py-2 text-xs text-center">{row.order}</td>
                          <td
                            className="px-6 py-2 text-xs text-center cursor-pointer"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              maxHeight: '3.5em',
                            }}
                            title={showEllipsis ? 'Click to view more' : undefined}
                            onClick={() => {
                              if (showEllipsis) {
                                showModal({
                                  title: 'Section Types',
                                  content: (
                                    <div style={{ whiteSpace: 'pre-line' }}>
                                      {sectionTypes.join(', ')}
                                    </div>
                                  ),
                                });
                              }
                            }}
                          >
                            {displaySectionTypes}
                          </td>
                          <td className="px-6 py-2 text-xs text-left">{row?.text_1 || "-"}</td>
                          <td className="px-6 py-2 text-xs text-left">{row?.text_2 || "-"}</td>
                          <td className="px-6 py-2 text-xs text-left">{row?.text_3 || "-"}</td>
                          <td className="px-6 py-2 text-xs text-center">{row?.image ? <Link target='_blank' to={row?.image}>
                            <img className='h-12' src={row?.image} /></Link> : '-'}</td>
                          <td className="px-6 py-2 text-xs text-center">
                            {row?.slider_video ? (
                              <a
                                href={row.slider_video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                View Video
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-2 text-xs text-center">{formatDate(row?.created_at)}</td>
                        </tr>
                        {expanded[row.page_type] && (
                          <tr>
                            <td colSpan={11} className="bg-gray-50 px-0 py-0">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th className="px-6 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Section Type</th>
                                    <th className="px-6 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Text 1</th>
                                    <th className="px-6 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Text 2</th>
                                    <th className="px-6 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Text 3</th>
                                    <th className="px-6 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Video</th>
                                    <th className="px-6 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {row.children.map((child: ExcellenceSection) => (
                                    <tr key={child.id} className="hover:bg-gray-100">
                                      <td className="px-6 py-2 text-xs text-center">{child.section_type}</td>
                                      <td className="px-6 py-2 text-xs text-left">{child.text_1}</td>
                                      <td className="px-6 py-2 text-xs text-left">{child.text_2}</td>
                                      <td className="px-6 py-2 text-xs text-left">{child.text_3}</td>
                                      <td className="px-6 py-2 text-xs text-center">
                                        {child.image ? (
                                          <Link to={child?.image} target="_blank">
                                            <img src={child.image} alt="Section Image" className="w-16 h-16 object-contain mx-auto" /></Link>
                                        ) : '-'}
                                      </td>
                                      <td className="px-6 py-2 text-xs text-center">
                                        {child.slider_video ? (
                                          <a href={child.slider_video} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Video</a>
                                        ) : '-'}
                                      </td>
                                      <td className="px-6 py-2 text-xs text-center">{formatDate(child.created_at)}</td>
                                      <td className="px-6 py-2 text-xs text-center">
                                        <div className="flex justify-center space-x-2">
                                          <GlassButton
                                            onClick={() => handleEdit(child.id, child)}
                                            icon={<FiEdit className="text-base" />}
                                            color="green"
                                            title="Edit"
                                          />
                                          <GlassButton
                                            onClick={() => handleDelete?.(child.id)}
                                            icon={<FiTrash className="text-base" />}
                                            color="red"
                                            title="Delete"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination (copy from DynamicServerTable if needed) */}

          </>
        )}
      </div>
    </div>
  );
};

export default DynamicPages;