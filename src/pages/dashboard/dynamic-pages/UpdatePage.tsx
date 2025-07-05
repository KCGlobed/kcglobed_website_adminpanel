import React, { useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Button from '../../../components/TextEditor/ui/Button';
import type { ExcellenceSection } from '../../../utils/types';
import { updatePageData } from '../../../store/slices/pagesSlice';
import LoadingToast from '../../../components/LoadingToast/LoadingToast';

// Predefined options
const PAGE_TYPES = [
    { value: 'homepage', label: 'Homepage' },
    { value: 'coursepage', label: 'Course Page' },
    { value: 'aboutpage', label: 'About Page' },
];

const SECTION_TYPES = [
    { value: 'banner', label: 'Banner' },
    { value: 'featured', label: 'Featured Section' },
    { value: 'testimonial', label: 'Testimonial Section' },
];

interface LocationState {
    pageData: ExcellenceSection;
}

const UpdatePage: React.FC = () => {
    const { state } = useLocation();
    const { loading } = useAppSelector(state => state.pages)
    const { pageData } = state as LocationState;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const param = useParams()
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        page_type: pageData.page_type,
        section_type: pageData.section_type,
        text_1: pageData.text_1,
        text_2: pageData.text_2,
        text_3: pageData.text_3 || '',
        description: pageData.description || '',
        slider_video: null as File | null,
        image: null as File | null,
        existingSliderVideo: pageData.slider_video,
        existingImage: pageData.image,
    });

    const videoRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    // Handlers remain the same as before
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const { name } = e.target;
            setFormData(prev => ({ ...prev, [name]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('page_type', formData.page_type);
            formDataToSend.append('section_type', formData.section_type);
            formDataToSend.append('text_1', formData.text_1);
            formDataToSend.append('text_2', formData.text_2);
            formDataToSend.append('text_3', formData.text_3);
            formDataToSend.append('description', formData.description);

            if (formData.slider_video) {
                formDataToSend.append('slider_video', formData.slider_video);
            }

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }


            if (!param.id) {
                setError('Page ID is missing');
                return;
            }

            await dispatch(updatePageData({ id: param.id, formData: formDataToSend }));
        } catch (err) {
            setError('Failed to update page. Please try again.');
            console.error(err);
        } finally {
        }
    };

    const handleRemoveFile = (field: 'slider_video' | 'image') => {
        setFormData(prev => ({ ...prev, [field]: null }));
        if (field === 'slider_video' && videoRef.current) {
            videoRef.current.value = '';
        }
        if (field === 'image' && imageRef.current) {
            imageRef.current.value = '';
        }
    };

    return (
        <>
            <LoadingToast
                message="Updating page data..."
                isVisible={loading}
            />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Page</h2>
                    <Button
                        onClick={() => navigate('/dashboard/dynamic-pages')}
                        className="flex items-center gap-2"
                    >
                        <FaArrowLeft /> Back to List
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Page Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Page Type
                            </label>
                            <select
                                name="page_type"
                                value={formData.page_type}
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                value={formData.description}
                                onChange={handleChange}
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
                                ref={videoRef}
                                onChange={handleFileChange}
                                accept="video/*"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.slider_video && (
                                <div className="mt-2">
                                    <div className="flex items-center mb-2">
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
                                    <video
                                        controls
                                        className="w-full max-w-md rounded-md border"
                                        style={{ maxHeight: '200px' }}
                                    >
                                        <source src={URL.createObjectURL(formData.slider_video)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            {formData.existingSliderVideo && !formData.slider_video && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">Current Video:</p>
                                    <video
                                        controls
                                        className="w-full max-w-md rounded-md border"
                                        style={{ maxHeight: '200px' }}
                                    >
                                        <source src={formData.existingSliderVideo} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    {/* <p className="text-xs text-gray-500 mt-1">{formData.existingSliderVideo}</p> */}
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
                                <div className="mt-2">
                                    <div className="flex items-center mb-2">
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
                                    <img
                                        src={URL.createObjectURL(formData.image)}
                                        alt="Selected image"
                                        className="w-full max-w-md rounded-md border"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            {formData.existingImage && !formData.image && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                    <img
                                        src={formData.existingImage}
                                        alt="Current image"
                                        className="w-full max-w-md rounded-md border"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.existingImage}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            onClick={() => navigate('/dashboard/dynamic-pages')}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex items-center gap-2"
                            disabled={loading}
                        >
                            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdatePage;