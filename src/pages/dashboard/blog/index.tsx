import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { getBlogs, removeBlog, type Blog } from '../../../store/slices/blogSlice';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../context/AlertContext';
import { deleteBlog } from '../../../services/blogService';
import { useModal } from '../../../context/ModalContext';
import DynamicServerTable, { type ColumnDefinition } from '../../../components/Table/Table';
import GlassButton from '../../../components/Button/Button';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';

const BlogPage: React.FC = () => {
    const { data, loading } = useAppSelector((state) => state.blog);
    const { showConfirm, showAlert } = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const { showModal } = useModal();

    const dispatch = useAppDispatch();
    const nevigate = useNavigate();

    const handleAddBlog = () => {
        nevigate("/dashboard/add-new-blog")
    }

    const handleDeleteBlog = (blogId: number) => {
        showConfirm({
            message: "Are you sure you want to delete?",
            onConfirm: async () => {
                try {
                    await deleteBlog(blogId);
                    dispatch(removeBlog(blogId));
                    showAlert("Blog Deleted Successfully...", "success");
                } catch (e: any) {
                    showAlert("Something Went Wrong...", "error");
                }

            },
            onCancel: () => showAlert("Cancelled", "info"),
        });
    }

    const handleViewBlog = (blogId: number) => {
        showModal({
            title: "View Blog",
            content: <ViewBlogModal blog={data.find(blog => blog.id === blogId)} />,
            type: "success", // not used in UI yet, but can be
            size: "xl", // sm, md, lg, xl
        });
    }

    const handleEditBlog = (blogId: number) => {
        nevigate(`/dashboard/edit-blog/${blogId}`);
    }
    useEffect(() => {
        dispatch(getBlogs());
    }, [dispatch]);

    const columns: ColumnDefinition<Blog>[] = useMemo(() => [
        { key: 'id', title: 'Blog ID', width: '120px', align: 'left', },
        {
            key: 'image', title: 'Blog Image', align: 'center',
            render: (_, row: any) => (
                <span className="flex justify-center items-center">
                    <img
                        src={row?.image || '/placeholder.png'}
                        alt="Blog"
                        className="w-16 h-16 object-cover rounded"
                    />
                </span>)
        },
        { key: 'title', title: 'Blog Name', align: 'center', },
        { key: 'slug', title: 'Blog Slug', align: 'center', },
        {
            key: 'created_at', title: 'Create Date',align: 'center',
            render: (value: any) => <span className="">{moment(value.created_at).format("MMM Do YY")}</span>
        },
        {
            key: 'category',
            title: 'Blog Category', align: 'center',
            render: (value: any) => <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs">{value?.title}</span>
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'left',
            render: (_, row: any) => (
                <div className="flex space-x-2">
                    <GlassButton
                        onClick={() => handleViewBlog?.(row.id)}
                        icon={<FiEye className="text-base" />}
                        color="blue"
                        title="Edit"
                    />
                    <GlassButton
                        onClick={() => handleEditBlog?.(row.id)}
                        icon={<FiEdit className="text-base" />}
                        color="green"
                        title="Edit"
                    />
                    <GlassButton
                        onClick={() => handleDeleteBlog?.(row.id)}
                        icon={<FiTrash className="text-base" />}
                        color="red"
                        title="Delete"
                    />
                </div>
            )
        }

    ], []);



    return (
        <div>
            <div className="flex mb-4 gap-4 justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Blogs</h2>
                <button
                    className="cursor-pointer px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={handleAddBlog}
                >
                    + New Blog
                </button>
            </div>

            <DynamicServerTable<Blog>
                data={data}
                columns={columns}
                currentPage={currentPage}
                pageSize={20}
                totalCount={data.length}
                onPageChange={setCurrentPage}
                loading={loading}
            />
        </div>
    )
};

export default BlogPage;


const ViewBlogModal = ({ blog }: { blog: any }) => {
    return (
        <div className="p-6 h-[500px]  overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
            <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-4" />
            <div
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: blog.description }}
            />
            <p className="text-sm text-gray-500">Category: {blog.category.title}</p>
            <p className="text-sm text-gray-500">Created by: {blog.created_by}</p>
            <p className="text-sm text-gray-500">Created at: {moment(blog.created_at).format("MMM Do YY")}</p>
        </div>
    );
}