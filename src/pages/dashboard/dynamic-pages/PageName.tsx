import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/TextEditor/ui/Button'
import DynamicServerTable, { type ColumnDefinition } from '../../../components/Table/Table'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { getAllPageNames, getAllSection } from '../../../store/slices/pagesSlice'
import GlassButton from '../../../components/Button/Button'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function PageName() {
    const { data, loading, section_Data } = useAppSelector(state => state.pages)
    const dispatch = useAppDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const handleEdit = () => {

    }
    const handleDelete = () => {

    }

    const columns: ColumnDefinition<any>[] = useMemo(() => [
        { key: 'page_type', title: 'Page Type', align: 'center' },
        // {
        //     key: 'created_at', title: 'Created At', align: 'center', render: (_, row) => {
        //         return formatDate(row.created_at)
        //     }
        // },
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
    const columnsForSection: ColumnDefinition<any>[] = useMemo(() => [
        { key: 'section_type', title: 'Section Type', align: 'center' },
        {
            key: 'page_type', title: 'Page Type', align: 'center', render: (_, row) => {
                return row.page_info.page_type
            }
        },
        // {
        //     key: 'created_at', title: 'Created At', align: 'center', render: (_, row) => {
        //         return formatDate(row.created_at)
        //     }
        // },
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
                        // variant="primary"
                        className="ml-4"
                    >
                        Create New Page
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