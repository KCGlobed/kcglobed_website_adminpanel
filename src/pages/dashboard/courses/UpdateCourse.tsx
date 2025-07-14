import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/useRedux';
import { updateExistingCourse } from '../../../store/slices/courseSlice';
import Button from '../../../components/TextEditor/ui/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { useAlert } from '../../../context/AlertContext';

interface Course {
  id: number;
  image: string;
  full_name: string;
  shortname: string;
  category: { id: number; name: string } | null;
  price: number;
  discount: number;
  duration: string;
  summary: string;
}

const UpdateCourse: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const course: Course = location.state?.course;
  const [formData, setFormData] = useState<Course | null>(null);
  const [imagePreview, setImagePreview] = useState<{ file?: File; url: string; isNew: boolean } | null>(null);
  const [bannerPreview, setBannerPreview] = useState<{ file?: File; url: string; isNew: boolean } | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({ ...course });
      if (course.image) {
        setImagePreview({ url: course.image, isNew: false });
      }
      if ((course as any).banner_image) {
        setBannerPreview({ url: (course as any).banner_image, isNew: false });
      }
    }
  }, [course]);

  if (!formData) return <div>Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = Number(value);
    }
    setFormData(prev => prev ? ({ ...prev, [name]: parsedValue }) : prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview && imagePreview.isNew) URL.revokeObjectURL(imagePreview.url);
      const url = URL.createObjectURL(file);
      setImagePreview({ file, url, isNew: true });
      setFormData(prev => prev ? ({ ...prev, image: file.name }) : prev);
    }
  };
  const handleRemoveImage = () => {
    if (imagePreview) {
      if (imagePreview.isNew) URL.revokeObjectURL(imagePreview.url);
      setImagePreview(null);
      setFormData(prev => prev ? ({ ...prev, image: '' }) : prev);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (bannerPreview && bannerPreview.isNew) URL.revokeObjectURL(bannerPreview.url);
      const url = URL.createObjectURL(file);
      setBannerPreview({ file, url, isNew: true });
      setFormData(prev => prev ? ({ ...prev, banner_image: file.name }) : prev);
    }
  };
  const handleRemoveBanner = () => {
    if (bannerPreview) {
      if (bannerPreview.isNew) URL.revokeObjectURL(bannerPreview.url);
      setBannerPreview(null);
      setFormData(prev => prev ? ({ ...prev, banner_image: '' }) : prev);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData?.id) return;
    const data: any = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'category' && value && typeof value === 'object') {
          data.append('category', value.id);
        } else {
          data.append(key, value instanceof File ? value : String(value));
        }
      }
    });
    if (imagePreview && imagePreview.isNew && imagePreview.file) {
      data.append('image', imagePreview.file);
    } else {
      data.delete && data.delete('image');
    }
    if (bannerPreview && bannerPreview.isNew && bannerPreview.file) {
      data.append('banner_image', bannerPreview.file);
    } else {
      data.delete && data.delete('banner_image');
    }
    try {
      await dispatch(updateExistingCourse({ data, id: formData.id }) as any).unwrap();
      showAlert('Course updated successfully', 'success');
      navigate('/dashboard/courses');
    } catch (err) {
      showAlert('Error updating course', 'error');
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Update Course
        </h2>
        <Button
          onClick={() => navigate('/dashboard/courses')}
          className="flex items-center gap-2"
        >
          <FaArrowLeft /> Back to List
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
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
                value={formData.category?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
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
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;