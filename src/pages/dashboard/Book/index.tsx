import React, { useEffect, useState } from 'react';
import DynamicServerTable from '../../../components/Table/Table';
import { enquiry } from '../../../data/partnerwithuseDummy';
import type { BookProps } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Columns } from './column';
import { deleteBook, getAllBooks, getBundleDetails } from '../../../store/slices/bookSlice';
import { useAlert } from '../../../context/AlertContext';
import { useModal } from '../../../context/ModalContext';


const Book: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { data, loading } = useAppSelector((state) => state.books);
    const { showAlert } = useAlert()
    const { showModal } = useModal()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [isBundleFilter, setIsBundleFilter] = useState<null | boolean>(null);

    useEffect(() => {
        dispatch(getAllBooks() as any)
    }, [dispatch])
    const handleNavigate = (book: BookProps) => {
        navigate(`/dashboard/update-book/${book.id}`, { state: { book } });
    };
    const handleDeleteBook = async (id: string) => {
        const res = await dispatch(deleteBook(id as any) as any)
        showAlert(res?.payload?.message, "success")
        dispatch(getAllBooks() as any)
    };

    // Filter books by is_bundle if filter is set
    const filteredBooks = isBundleFilter === null
        ? data
        : data.filter((book: any) => book.is_bundle === isBundleFilter);

    // Pass handleNavigate to Columns
    const columns = Columns(handleNavigate, navigate, handleDeleteBook, showModal);

    return (
        <div className='overflow-x-hidden'>
            <div className='flex mb-4 gap-4 justify-between'>
                <h2 className="text-2xl font-bold text-gray-800">All Books</h2>
                <div className="flex items-center gap-2 mb-4">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                        <select
                            value={isBundleFilter === null ? "all" : isBundleFilter ? "bundle" : "non-bundle"}
                            onChange={e => {
                                if (e.target.value === "all") setIsBundleFilter(null);
                                else if (e.target.value === "bundle") setIsBundleFilter(true);
                                else setIsBundleFilter(false);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="all">All Books</option>
                            <option value="bundle">Bundles Only</option>
                            <option value="non-bundle">Non-Bundles Only</option>
                        </select>
                    </label>
                    <Link to={"/dashboard/new-book"}
                        className="cursor-pointer px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        + New Book
                    </Link>
                </div>
            </div>
            <DynamicServerTable<BookProps>
                data={filteredBooks}
                columns={columns}
                currentPage={currentPage}
                pageSize={20}
                loading={loading}
                totalCount={enquiry.length}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Book; 