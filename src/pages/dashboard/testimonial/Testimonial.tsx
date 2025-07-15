import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import DynamicServerTable, { type ColumnDefinition } from '../../../components/Table/Table';
import { useEffect, useState } from 'react';
import type { TestimonialProps } from '../../../utils/types';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { getAllTestimonials, removeTestimonial } from '../../../store/slices/testimonialSlice';
import { useAlert } from '../../../context/AlertContext';

function Testimonial() {
    const navigate = useNavigate()
    const { data, loading } = useAppSelector(state => state.testimonial)
    const dispatch = useAppDispatch()
    const { showConfirm, showAlert } = useAlert();
    const [filterValue, setFilterValue] = useState<keyof typeof data | "all">("all");
    const [currentPage, setCurrentPage] = useState(1)
    const filteredTestimonials =
        filterValue === "all"
            ? [...data.corporate, ...data.institutions, ...data.student, ...data.placement]
            : data[filterValue];
    const handleNavigate = (row: any) => {
        navigate(`/dashboard/testimonial/update/${row.id}`, { state: { testimonial: row } })
    }
    const handleDeleteTestimonial = async (id: string) => {
        try {
            await dispatch(removeTestimonial(id))
            showAlert('Testimonial created successfully!', 'success');
            dispatch(getAllTestimonials())
        } catch (error) {
            console.log();

        }
    }
    const columns: ColumnDefinition<TestimonialProps>[] = [
        { key: 'name', title: 'Name', align: 'left' },
        { key: 'qualification', title: 'Designation', align: 'center' },
        { key: 'college', title: 'College', align: 'center' },
        {
            key: 'image', title: 'Profile', align: 'center', render: (_, row: TestimonialProps) => {
                return <img src={row.image} alt={row.name} className='h-8 rounded-full w-8 mx-auto' />
            }
        },
        { key: 'content', title: 'Content', align: 'center' },
        { key: 'testimonials_type', title: 'Type', align: 'center' },
        {
            key: 'actions',
            title: 'Actions',
            align: 'left',
            render: (_, row: TestimonialProps) => (
                <div className="flex space-x-2">
                    <GlassButton
                        onClick={() => handleNavigate(row)}
                        icon={<FiEdit className="text-base" />}
                        color="green"
                        title="Edit"
                    />
                    <GlassButton
                        onClick={() => showConfirm({
                            message: 'Are you sure you want to delete this testimonial?',
                            onConfirm: () => handleDeleteTestimonial(row.id as string),
                        })}
                        icon={<FiTrash className="text-base" />}
                        color="red"
                        title="Delete"
                    />
                </div>
            )
        }
    ];

    useEffect(() => {
        dispatch(getAllTestimonials())
    }, [])

    const pageSize = 20;
    const paginatedTestimonials = filteredTestimonials.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className='overflow-x-hidden'>
            <div className='flex mb-4 gap-4 justify-between'>
                <h2 className="text-2xl font-bold text-gray-800">All Testimonial</h2>
                <div className="flex items-center gap-2 mb-4">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                        <select
                            value={filterValue}
                            onChange={e => {
                                setFilterValue(e.target.value as keyof typeof data | "all")
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="all">All Testimonials</option>
                            <option value="student">Student</option>
                            <option value="placement">Placement</option>
                            <option value="institutions">Institutions</option>
                            <option value="corporate">Corporate</option>
                        </select>
                    </label>
                    <Link to={"/dashboard/testimonial/add"}
                        className="cursor-pointer px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        + Add Testimonial
                    </Link>
                </div>
            </div>
            <DynamicServerTable<TestimonialProps>
                data={paginatedTestimonials}
                columns={columns}
                currentPage={currentPage}
                pageSize={pageSize}
                loading={loading}
                totalCount={filteredTestimonials.length}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Testimonial