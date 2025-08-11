import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllAuthors } from '../../../store/slices/bookSlice';
import type { AuthorProps } from '../../../utils/types';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiTrash } from 'react-icons/fi';
import DynamicServerTable from '../../../components/Table/Table';

type ColumnDefinition<T> = {
    key: keyof T | string;
    title: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: T) => React.ReactNode;
};

const Authors = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { authors: data, loading } = useAppSelector((state) => state.books);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllAuthors() as any);
    }, [dispatch]);

    const handleNavigate = (author: AuthorProps) => {
        navigate(`/dashboard/update-book/${author.id}`, { state: { author } });
    };

    const handleDeleteBook = async (id: string) => {
        // Implement delete logic here
    };

    const columns: ColumnDefinition<AuthorProps>[] = [
        { key: 'name', title: 'Author Name', align: 'left' },
        { key: 'description', title: 'About Author', align: 'left' },
        {
            key: 'image', title: 'Profile', align: 'center', render: (_, row: any) => {
                return <img src={row.image} alt={row.name} className='h-8 rounded-full w-8 object-contain mx-auto' />
            }
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'left',
            render: (_: any, row: AuthorProps) => (
                <div className="flex space-x-2">
                    <GlassButton
                        onClick={() => handleNavigate(row)}
                        icon={<FiEdit className="text-base" />}
                        color="green"
                        title="Edit"
                    />
                    <GlassButton
                        onClick={() => handleDeleteBook(row.id)}
                        icon={<FiTrash className="text-base" />}
                        color="red"
                        title="Delete"
                    />
                </div>
            )
        }
    ];

    return (
        <div className='overflow-x-hidden'>
            <div className='flex mb-4 gap-4 justify-between'>
                <h2 className="text-2xl font-bold text-gray-800">All Authors</h2>
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => navigate("/dashboard/new-author")}
                        className="cursor-pointer px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        + New Author
                    </button>
                </div>
            </div>
            <DynamicServerTable<AuthorProps>
                data={data}
                columns={columns}
                currentPage={currentPage}
                pageSize={20}
                loading={loading}
                totalCount={data.length}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Authors;