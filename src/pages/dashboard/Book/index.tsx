import React, { useEffect, useState } from 'react';
import DynamicServerTable from '../../../components/Table/Table';
import { enquiry } from '../../../data/partnerwithuseDummy';
import type { BookProps } from '../../../utils/types';
import { useAppSelector } from '../../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Columns } from './column';
import { getAllBooks } from '../../../store/slices/bookSlice';


const Book: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { data, loading } = useAppSelector((state) => state.books);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllBooks())
    }, [dispatch])

    return (
        <div className='overflow-x-hidden'>
            <div className="flex mb-4 gap-4 justify-between">
                <h2 className="text-2xl font-bold text-gray-800">All Books</h2>
                <Link to={"/dashboard/new-book"}
                    className="cursor-pointer px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                    + New Book
                </Link>
            </div>
            <DynamicServerTable<BookProps>
                data={data}
                columns={Columns}
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