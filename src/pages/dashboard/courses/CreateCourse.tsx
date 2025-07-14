import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uploadNewCourse } from '../../../store/slices/courseSlice';
import Button from '../../../components/TextEditor/ui/Button';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAlert } from '../../../context/AlertContext';

interface CourseForm {
    full_name: string;
    shortname: string;
    category: string;
    price: number;
    discount: number;
    duration: string;
    summary: string;
    image: string;
    banner_image: string;
    title: string;
    sub_title: string;
    description: string;
    lang: string;
    part: string;
    job_info: string;
    color_1: string;
    color_2: string;
    simulation_option: string;
}

const CreateCourse: React.FC = () => {
    const { loading } = useAppSelector(state => state.course)
    const { showAlert } = useAlert()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<CourseForm>({
        full_name: "",
        shortname: "",
        category: "",
        price: 0,
        discount: 0,
        duration: "",
        summary: "",
        image: "",
        banner_image: "",
        title: "",
        sub_title: "",
        description: "",
        lang: "",
        part: "",
        job_info: "",
        color_1: "#000000",
        color_2: "#ffffff",
        simulation_option: "None",
    });
    const dispatch = useAppDispatch()
    const [imagePreview, setImagePreview] = useState<{ file: File; url: string } | null>(null);
    const [bannerPreview, setBannerPreview] = useState<{ file: File; url: string } | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview.url);
            if (bannerPreview) URL.revokeObjectURL(bannerPreview.url);
        };
    }, [imagePreview, bannerPreview]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? Number(value) : value;
        setFormData(prev => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (imagePreview) URL.revokeObjectURL(imagePreview.url);
            const url = URL.createObjectURL(file);
            setImagePreview({ file, url });
            setFormData(prev => ({ ...prev, image: file.name }));
        }
    };
    const handleRemoveImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview.url);
            setImagePreview(null);
            setFormData(prev => ({ ...prev, image: "" }));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (bannerPreview) URL.revokeObjectURL(bannerPreview.url);
            const url = URL.createObjectURL(file);
            setBannerPreview({ file, url });
            setFormData(prev => ({ ...prev, banner_image: file.name }));
        }
    };
    const handleRemoveBanner = () => {
        if (bannerPreview) {
            URL.revokeObjectURL(bannerPreview.url);
            setBannerPreview(null);
            setFormData(prev => ({ ...prev, banner_image: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value instanceof File ? value : String(value));
            }
        });
        if (imagePreview) {
            data.append("image", imagePreview.file);
        }
        if (bannerPreview) {
            data.append("banner_image", bannerPreview.file);
        }
        try {
            await dispatch(uploadNewCourse(data)).unwrap();
            showAlert("Course added successfully", 'success')
            navigate("/dashboard/courses")
        } catch (err) {
            showAlert("Error creating course", 'error')
        }
    };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add New Course
            </h2>
                <Button
                    onClick={() => navigate('/dashboard/courses')}
                    className="flex items-center gap-2"
                >
                    <FaArrowLeft /> Back to List
                </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                            <input
                                name="shortname"
                                value={formData.shortname}
                                onChange={handleChange}
                                placeholder="Short Name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                            <input
                                name="discount"
                                type="number"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="Discount"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Duration"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Course Title"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle <span className="text-red-500">*</span></label>
                            <input
                                name="sub_title"
                                value={formData.sub_title}
                                onChange={handleChange}
                                placeholder="Course Subtitle"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Course Description"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language <span className="text-red-500">*</span></label>
                            <select
                                name="lang"
                                value={formData.lang}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Language</option>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Part <span className="text-red-500">*</span></label>
                            <input
                                name="part"
                                value={formData.part}
                                onChange={handleChange}
                                placeholder="Part (e.g. 1, 2, A, B)"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Info <span className="text-red-500">*</span></label>
                            <textarea
                                name="job_info"
                                value={formData.job_info}
                                onChange={handleChange}
                                placeholder="Job Info"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color <span className="text-red-500">*</span></label>
                            <input
                                name="color_1"
                                type="color"
                                value={formData.color_1}
                                onChange={handleChange}
                                required
                                className="w-16 h-10 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color <span className="text-red-500">*</span></label>
                            <input
                                name="color_2"
                                type="color"
                                value={formData.color_2}
                                onChange={handleChange}
                                required
                                className="w-16 h-10 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.svg"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {imagePreview && (
                                    <div className="relative w-32 h-32 border rounded overflow-hidden">
                                        <img
                                            src={imagePreview.url}
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            title="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.svg"
                                    onChange={handleBannerChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {bannerPreview && (
                                    <div className="relative w-32 h-32 border rounded overflow-hidden">
                                        <img
                                            src={bannerPreview.url}
                                            alt="Banner Preview"
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveBanner}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            title="Remove banner image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Simulation Option</label>
                            <select
                                name="simulation_option"
                                value={formData.simulation_option}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="None">None</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Course summary..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            "Create Course"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;