import React, { useEffect, useMemo, useState } from 'react';
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
    const { data, loading, count } = useAppSelector((state) => state.books);
    const { showAlert } = useAlert()
    const { showModal } = useModal()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [alphaRange, setAlphaRange] = useState<
        Record<string, { from?: string; to?: string }>
    >({});
    const [isBundleFilter, setIsBundleFilter] = useState<null | boolean>(null);
    const [filters, setFilters] = useState<Record<string, { type: 'text' | 'alpha-range'; value: any }>>({});
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    useEffect(() => {
        dispatch(getAllBooks({ page: currentPage } as any) as any)
    }, [dispatch])
    const handleNavigate = (book: BookProps) => {
        navigate(`/dashboard/update-book/${book.id}`, { state: { book } });
    };
    const handleDeleteBook = async (id: string) => {
        const res = await dispatch(deleteBook(id as any) as any)
        showAlert(res?.payload?.message, "success")
        dispatch(getAllBooks({ page: currentPage } as any) as any)
    };

    // Filter books by is_bundle if filter is set
    // const filteredBooks = isBundleFilter === null
    //     ? data
    //     : data.filter((book: any) => book.is_bundle === isBundleFilter);

    // Pass handleNavigate to Columns
    const columns = Columns(handleNavigate, navigate, handleDeleteBook, showModal);
    const filteredBooks = useMemo(() => {
        let result = [...data]; // clone to avoid mutating original

        // Step 1: Apply column filters
        Object.entries(filters).forEach(([key, filter]) => {
            if (filter.type === 'text') {
                result = result.filter((item) =>
                    String(item[key as keyof BookProps] || '')
                        .toLowerCase()
                        .includes(filter.value.toLowerCase())
                );
            } else if (filter.type === 'alpha-range') {
                const { from, to } = filter.value;
                result = result.filter((item) => {
                    const val = String(item[key as keyof BookProps] || '').toUpperCase();
                    return (!from || val >= from) && (!to || val <= to);
                });
            }
        });

        // Step 2: Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = String(a[sortConfig.key as keyof BookProps] || '').toUpperCase();
                const bVal = String(b[sortConfig.key as keyof BookProps] || '').toUpperCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, filters, sortConfig]);

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
                columns={columns}
                data={filteredBooks}
                currentPage={currentPage}
                pageSize={20}
                loading={loading}
                totalCount={count}
                onPageChange={setCurrentPage}
                enableFilters={true}
                filters={filters}
                onFilterChange={setFilters}
                setSortConfig={setSortConfig}
                alphaRange={alphaRange}
                setAlphaRange={setAlphaRange}
            />
            {/* <DynamicServerTable<BookProps>
                data={filteredBooks}
                columns={columns}
                currentPage={currentPage}
                pageSize={20}
                loading={loading}
                totalCount={enquiry.length}
                onPageChange={setCurrentPage}
            /> */}
        </div>
    )
}

export default Book; 