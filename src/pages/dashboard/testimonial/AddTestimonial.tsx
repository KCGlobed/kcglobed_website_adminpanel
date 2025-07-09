import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/TextEditor/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { useAlert } from '../../../context/AlertContext';
import { createTestimonial } from '../../../store/slices/testimonialSlice';

function AddTestimonial() {
    const { loading } = useAppSelector(state => state.testimonial)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        name: "",
        qualification: "",
        content: "",
        testimonial_type: "",
        college: "",
        image: null as File | null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setPreviewImage(null);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                if (key === 'image' && value instanceof File) {
                    data.append('image', value);
                } else {
                    data.append(key, value as string);
                }
            }
        });
        try {
            await dispatch(createTestimonial(data)).unwrap();
            showAlert('Testimonial created successfully!', 'success');
            navigate('/dashboard/testimonial');
        } catch (err) {
            showAlert('Failed to create testimonial.', 'error');
        }
    };
    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add Testimonial
            </h2>
                <Button
                    onClick={() => navigate('/dashboard/books')}
                    className="flex items-center gap-2"
                >
                    <FaArrowLeft /> Back to List
                </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            placeholder="e.g. CEO, Student"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                            name="college"
                            value={formData.college}
                            onChange={handleChange}
                            placeholder="e.g. IIT Kanpur, CSJMU"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Type</label>
                        <select
                            name="testimonial_type"
                            value={formData.testimonial_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Testimonial Type</option>
                            <option value="student">Student</option>
                            <option value="corporate">Corporate</option>
                            <option value="institutions">Institution</option>
                            <option value="placement">Placement</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {previewImage && (
                            <div className="mt-2 relative w-24 h-24 border rounded overflow-hidden">
                                <img src={previewImage} alt="Preview" className="object-cover w-full h-full" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='p-6 bg-gray-50 rounded-lg shadow-md'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Write the testimonial message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Add Testimonial"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTestimonial