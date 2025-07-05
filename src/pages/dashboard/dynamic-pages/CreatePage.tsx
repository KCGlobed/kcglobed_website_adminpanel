import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useRedux';
import { createPageData } from '../../../store/slices/pagesSlice';
import LoadingToast from '../../../components/LoadingToast/LoadingToast';

interface BannerFormData {
    page_type: string;
    section_type: string;
    text_1: string;
    text_2: string;
    text_3: string;
    description: string | null;
    slider_video: File | null;
    image: File | null;
    existingSliderVideo?: string;
    existingImage?: string;
}

// Predefined options
const PAGE_TYPES = [
    { value: 'homepage', label: 'Homepage' },
];

const SECTION_TYPES = [
    { value: 'banner', label: 'Banner' },
    { value: 'demo', label: 'Demo' },
];

const CreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { loading } = useAppSelector(state => state.pages)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState<BannerFormData>({
        page_type: 'homepage',
        section_type: 'banner',
        text_1: '',
        text_2: '',
        text_3: '',
        description: null,
        slider_video: null,
        image: null,
    });

    const sliderVideoRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const { name } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: e.target.files![0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            console.log(formData, 'formdata')
            const formDataToSend = new FormData();
            formDataToSend.append('page_type', formData.page_type);
            formDataToSend.append('section_type', formData.section_type);
            formDataToSend.append('text_1', formData.text_1);
            formDataToSend.append('text_2', formData.text_2);
            formDataToSend.append('text_3', formData.text_3);

            if (formData.description) {
                formDataToSend.append('description', formData.description);
            }

            if (formData.slider_video) {
                formDataToSend.append('slider_video', formData.slider_video);
            }

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            // await axios.post('/api/banners', formDataToSend, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });

            dispatch(createPageData(formDataToSend))
            // navigate('/banners');
        } catch (err) {
            setError('Failed to submit form. Please try again.');
            console.error(err);
        } finally {
        }
    };

    const handleRemoveFile = (field: 'slider_video' | 'image') => {
        if (field === 'slider_video') {
            setFormData(prev => ({ ...prev, slider_video: null }));
            if (sliderVideoRef.current) sliderVideoRef.current.value = '';
        } else {
            setFormData(prev => ({ ...prev, image: null }));
            if (imageRef.current) imageRef.current.value = '';
        }
    };

    return (
        <>
            <LoadingToast 
                message="Creating new page..." 
                isVisible={loading} 
            />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">
                    Create New Banner
                </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Page Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Page Type
                        </label>
                        <select
                            name="page_type"
                            value={formData.page_type}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {PAGE_TYPES.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section Type
                        </label>
                        <select
                            name="section_type"
                            value={formData.section_type}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {SECTION_TYPES.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Text Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Text 1
                        </label>
                        <input
                            type="text"
                            name="text_1"
                            value={formData.text_1}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Text 2
                        </label>
                        <input
                            type="text"
                            name="text_2"
                            value={formData.text_2}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Text 3
                        </label>
                        <input
                            type="text"
                            name="text_3"
                            value={formData.text_3}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                        />
                    </div>

                    {/* Slider Video */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slider Video
                        </label>
                        <input
                            type="file"
                            name="slider_video"
                            ref={sliderVideoRef}
                            onChange={handleFileChange}
                            accept="video/*"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.slider_video && (
                            <div className="mt-2 flex items-center">
                                <span className="text-sm text-gray-600 mr-2">
                                    {formData.slider_video.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile('slider_video')}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            ref={imageRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.image && (
                            <div className="mt-2 flex items-center">
                                <span className="text-sm text-gray-600 mr-2">
                                    {formData.image.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile('image')}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/banners')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                        ) : 'Create Banner'}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default CreatePage;