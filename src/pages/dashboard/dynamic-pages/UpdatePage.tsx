import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { FaArrowLeft, FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import Button from '../../../components/TextEditor/ui/Button';
import type { ExcellenceSection } from '../../../utils/types';
import LoadingToast from '../../../components/LoadingToast/LoadingToast';
import { removeSubSec, updatePage, updateSubSec } from '../../../services/pages';
import { getAllPageNames } from '../../../store/slices/pagesSlice';

interface SubSection {
    id?: number;
    title: string;
    description: string;
    image: any;
    existingImage?: string;
}

interface LocationState {
    pageData: ExcellenceSection & { sub_section?: SubSection[] };
}

const UpdatePage: React.FC = () => {
    const { state } = useLocation();
    const { loading, data } = useAppSelector(state => state.pages)
    const { pageData } = state as LocationState;
    const navigate = useNavigate();
    const param = useParams();
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch()
    const [subSec, setSubSec] = useState<any>([]);
    
    const [formData, setFormData] = useState({
        page_id: pageData.page_id,
        section_id: pageData.section_type_id,
        text_1: pageData.text_1,
        text_2: pageData.text_2,
        text_3: pageData.text_3 || '',
        description: pageData.description || '',
        slider_video: null as File | null,
        image: null as File | null,
        existingSliderVideo: pageData.slider_video,
        existingImage: pageData.image,
        order: pageData.order,
        sub_section: pageData.sub_section?.map(sub => ({
            ...sub,
            image: null,
            existingImage: sub.image
        })) || [] as SubSection[],
    });

    const videoRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const subSectionImageRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        dispatch(getAllPageNames())
    }, [dispatch])

    useEffect(()=>{
        if(data.length){
            const selectedSec:any = data.find((sec:any)=> sec.id == pageData.page_id);
            setSubSec(selectedSec ? selectedSec.section_list : []);
        }
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(name=="page_id"){
            const selectedSec:any = data.find((val:any)=>val.id==value);
            setSubSec(selectedSec.section_list);
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const { name } = e.target;
            setFormData(prev => ({ ...prev, [name]: e.target.files![0] }));
        }
    };

    const handleSubSectionFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const updatedSubSections = [...formData.sub_section];
            updatedSubSections[index] = {
                ...updatedSubSections[index],
                image: e.target.files[0]
            };
            setFormData(prev => ({
                ...prev,
                sub_section: updatedSubSections
            }));
        }
    };

    const handleSubSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = e.target;
        const updatedSubSections = [...formData.sub_section];
        updatedSubSections[index] = {
            ...updatedSubSections[index],
            [name]: value
        };
        setFormData(prev => ({
            ...prev,
            sub_section: updatedSubSections
        }));
    };

    const addSubSection = () => {
        setFormData(prev => ({
            ...prev,
            sub_section: [
                ...prev.sub_section,
                {
                    title: '',
                    description: '',
                    image: null
                }
            ]
        }));
    };

    const removeSubSection = async (index: number) => {
        if(formData.sub_section[index]){
            console.log(formData.sub_section[index])
            await removeSubSec(formData.sub_section[index].id);
        } 
        const updatedSubSections = formData.sub_section.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            sub_section: updatedSubSections
        }));
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

    const handleRemoveSubSectionFile = (index: number) => {
        const updatedSubSections = [...formData.sub_section];
        updatedSubSections[index] = {
            ...updatedSubSections[index],
            image: null
        };
        setFormData(prev => ({
            ...prev,
            sub_section: updatedSubSections
        }));
        if (subSectionImageRefs.current[index]) {
            subSectionImageRefs.current[index]!.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const formDataToSend = new FormData();
            const subSecFormData = new FormData();
            formDataToSend.append('page_id', formData.page_id);
            formDataToSend.append('section_id', formData.section_id);
            formDataToSend.append('text_1', formData.text_1);
            formDataToSend.append('text_2', formData.text_2);
            formDataToSend.append('text_3', formData.text_3);
            formDataToSend.append('order', formData.order);
            formDataToSend.append('description', formData.description);

            if (formData.slider_video) {
                formDataToSend.append('slider_video', formData.slider_video);
            }

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            formData.sub_section.forEach((item:any, index:number) => {
                subSecFormData.append(`section_data[${index}][title]`, item.title);
                subSecFormData.append(`section_data[${index}][description]`, item.description);
                subSecFormData.append(`section_data[${index}][main_id]`, pageData.id.toString());
                if (item.image) {
                    subSecFormData.append(`section_data[${index}][image]`, item.image);
                }
                if (item.id) {
                    subSecFormData.append(`section_data[${index}][id]`, item.id.toString());
                }
            });

            if (!param.id) {
                setError('Page ID is missing');
                return;
            }
            await updatePage({ id: param.id, formData: formDataToSend });
            await updateSubSec({formData : subSecFormData});
            history.back();
        } catch (err) {
            setError('Failed to update page. Please try again.');
            console.error(err);
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
                                name="page_id"
                                value={formData.page_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {data.map((option:any) => (
                                    <option key={option.id} value={option.id}>
                                        {option.page_type}
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
                                name="section_id"
                                value={formData.section_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {subSec.map((option:any) => (
                                    <option key={option.id} value={option.id}>
                                        {option.section_type}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Page Order
                            </label>
                            <input
                                type="text"
                                name="order"
                                value={formData.order}
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
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sub Sections */}
                    <div className="mb-6">

                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Sub Sections</h3>
                        </div>

                        {formData.sub_section.map((subSection, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={subSection.title}
                                            onChange={(e) => handleSubSectionChange(e, index)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={subSection.description}
                                            onChange={(e) => handleSubSectionChange(e, index)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            ref={el => subSectionImageRefs.current[index] = el}
                                            onChange={(e) => handleSubSectionFileChange(e, index)}
                                            accept="image/*"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {subSection.image && (
                                            <div className="mt-2">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-sm text-gray-600 mr-2">
                                                        {subSection.image.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSubSectionFile(index)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <img
                                                    src={URL.createObjectURL(subSection.image)}
                                                    alt="Selected sub-section image"
                                                    className="w-[100px] rounded-md border"
                                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        {subSection.existingImage && !subSection.image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                                <img
                                                    src={subSection.existingImage}
                                                    alt="Current sub-section image"
                                                    className="w-[100px] rounded-md border"
                                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeSubSection(index)}
                                    className="flex items-center gap-2"
                                >
                                    <FaTrash /> Remove Sub Section
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-end items-center mb-4">
                            <Button
                                onClick={addSubSection}
                                className="flex items-center gap-2"
                            >
                                <FaPlus /> Add Sub Section
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/dynamic-pages')}
                            variant="secondary"
                        >
                            Cancel
                        </button>
                        <button
                            className="flex items-center gap-2"
                            disabled={loading}
                        >
                            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdatePage;