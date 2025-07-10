import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/TextEditor/ui/Button'
import DynamicServerTable, { type ColumnDefinition } from '../../../components/Table/Table'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { getAllPageNames, getAllSection } from '../../../store/slices/pagesSlice'
import GlassButton from '../../../components/Button/Button'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useModal } from '../../../context/ModalContext'
import UpdatePageSectionName from './UpdatePageSectionName'

function PageName() {
    const { data, loading, section_Data } = useAppSelector(state => state.pages)
    const dispatch = useAppDispatch()
    const { showModal, hideModal } = useModal()
    const [currentPage, setCurrentPage] = useState(1)

    const handleEdit = (id: string | number, row: any, type: 'page' | 'section') => {
        showModal({
            title: type === 'page' ? 'Edit Page' : 'Edit Section',
            content: (
                <UpdatePageSectionName
                    type={type}
                    editingItem={row}
                    onSuccess={() => {
                        hideModal()
                        if (type === 'page') dispatch(getAllPageNames())
                        else dispatch(getAllSection())
                    }}
                    onClose={hideModal}
                />
            ),
            size: 'md',
        })
    }

    const handleDelete = () => {
        // Implement delete functionality if needed
    }

    const columns: ColumnDefinition<any>[] = useMemo(() => [
        { key: 'page_type', title: 'Page Type', align: 'center' },
        {
            key: 'section_list', title: 'Sections', align: 'center', render: (_, row) => {
                return <div>
                    {
                        row.section_list?.map((item: any) => item.section_type).join(",")
                    }
                </div>
            }
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'center',
            render: (_, row) => (
                <div className="flex justify-center space-x-2">
                    <GlassButton
                        onClick={() => handleEdit(row.id, row, 'page')}
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

    const columnsForSection: ColumnDefinition<any>[] = useMemo(() => [
        { key: 'section_type', title: 'Section Type', align: 'center' },
        {
            key: 'page_type', title: 'Page Type', align: 'center', render: (_, row) => {
                return row.page_info.page_type
            }
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'center',
            render: (_, row) => (
                <div className="flex justify-center space-x-2">
                    <GlassButton
                        onClick={() => handleEdit(row.id, row, 'section')}
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
        dispatch(getAllPageNames())
    }, [])
    useEffect(() => {
        dispatch(getAllSection())
    }, [])

    return (
        <div className='overflow-x-hidden'>
            <div className="flex mb-4 gap-4 justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Pages</h2>
                <Link to={'/dashboard/dynamic-pages/names/create'} state={data}>
                    <Button
                        onClick={() => { }}
                        className="ml-4"
                    >
                        Create Page/Section
                    </Button>
                </Link>
            </div>
            <div className='flex gap-4 flex-wrap'>
                <div className='flex-1'>
                    <DynamicServerTable<any>
                        data={data}
                        columns={columns}
                        currentPage={currentPage}
                        pageSize={20}
                        loading={loading}
                        totalCount={data.length}
                        onPageChange={setCurrentPage}
                    />
                </div>
                <div className='flex-1'>  <DynamicServerTable<any>
                    data={section_Data}
                    columns={columnsForSection}
                    currentPage={currentPage}
                    pageSize={20}
                    loading={loading}
                    totalCount={data.length}
                    onPageChange={setCurrentPage}
                />
                </div>
            </div>

        </div>
    )
}

export default PageName