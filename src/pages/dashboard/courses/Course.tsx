import React, { useEffect, useState } from 'react';
import DynamicServerTable from '../../../components/Table/Table';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { getAllCourse, deleteCourseById } from '../../../store/slices/courseSlice';
import { useAlert } from '../../../context/AlertContext';
import { useModal } from '../../../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/TextEditor/ui/Button';
import type { CourseProps } from '../../../utils/types';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiTrash } from 'react-icons/fi';

const Course: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, loading } = useAppSelector((state) => state.course);
    const dispatch = useAppDispatch();
    const { showAlert, showConfirm } = useAlert();
    const { showModal } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllCourse() as any);
    }, [dispatch]);

    const handleEdit = (course: any) => {
        navigate(`/dashboard/update-course/${course.id}`, { state: { course } });
    };

    const handleDelete = (id: number) => {
        showConfirm({
            message: 'Are you sure you want to delete this course?',
            onConfirm: async () => {
                await dispatch(deleteCourseById(id) as any);
                showAlert('Course deleted successfully', 'success');
                dispatch(getAllCourse() as any);
            },
        });
    };

    const columns = [
        {
            key: 'image',
            title: 'Image',
            align: 'center' as const,
            render: (_: any, row: any) => (
                <img src={row.image} alt={row.full_name} className="w-16 h-16 object-contain rounded py-3" />
            ),
        },
        { key: 'full_name', title: 'Full Name', align: 'center' as const },
        { key: 'shortname', title: 'Short Name', align: 'center' as const },
        { key: 'category', title: 'Category', align: 'center' as const, render: (_: any, row: any) => row.category?.name },
        { key: 'price', title: 'Price', align: 'center' as const },
        { key: 'discount', title: 'Discount', align: 'center' as const },
        { key: 'duration', title: 'Duration', align: 'center' as const },
        {
            key: 'actions',
            title: 'Actions',
            align: 'left',
            render: (_, row: CourseProps) => (
                <div className="flex space-x-2">
                    <GlassButton
                        onClick={() => handleEdit(row)}
                        icon={<FiEdit className="text-base" />}
                        color="green"
                        title="Edit"
                    />
                    <GlassButton
                        onClick={() => handleDelete(row.id as any)}
                        icon={<FiTrash className="text-base" />}
                        color="red"
                        title="Delete"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="overflow-x-hidden">
            <div className="flex mb-4 gap-4 justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
                <Button
                    onClick={() => navigate('/dashboard/new-course')}
                    className="px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                    + New Course
                </Button>
            </div>
            <DynamicServerTable<any>
                data={data}
                columns={columns}
                currentPage={currentPage}
                pageSize={20}
                loading={loading}
                totalCount={data?.length}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Course;