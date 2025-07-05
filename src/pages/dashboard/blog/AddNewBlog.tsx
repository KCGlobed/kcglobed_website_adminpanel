import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import LexicalEditor from '../../../components/TextEditor';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { addBlogs, getBlogsCourseCategory } from '../../../store/slices/blogSlice';
import { useAppSelector } from '../../../hooks/useRedux';
import { useNavigate } from 'react-router-dom';

type BlogForm = {
  title: string;
  createdBy: string;
  category: string;
  date: string;
  altTag: string;
  metaTitle: string;
  slug: string;
  primaryKeyword: string;
  metaDescription: string;
  image: FileList;
  canonicalurl: string
};

const AddNewBlog: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BlogForm>();
  const { category } = useAppSelector((state) => state.blog);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [contant, setContant] = useState<any>("")
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const imageFile = watch('image');

  const onSubmit = async (data: BlogForm) => {
    setIsSubmitting(true);
    let tag = tags.map((tag) => tag.trim()).join(',');
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', contant);
      formData.append('image', data.image[0]);
      formData.append('created_by', data.title);
      formData.append('category_id', data.category);
      formData.append('tags',tag);
      formData.append('live_date', data.date);
      formData.append('meta_title', data.metaTitle);
      formData.append('meta_description', data.metaDescription);
      formData.append('meta_keys', data.primaryKeyword);
      formData.append('img_alt_tag', data.altTag);
      formData.append('slug', data.slug);
      formData.append('canonical_url', data.canonicalurl);
      await dispatch(addBlogs(formData))
      navigate("/dashboard/blog")
    } catch (error) {
      console.error('Error submitting blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
  };

  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    dispatch(getBlogsCourseCategory())
  }, [dispatch])


  return (
    <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Add New Blog Post
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blog Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter blog title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              {...register('createdBy', { required: 'Author name is required' })}
              className={`w-full px-3 py-2 border ${errors.createdBy ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Author name"
            />
            {errors.createdBy && <p className="mt-1 text-sm text-red-600">{errors.createdBy.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              {...register('category', { required: 'Please select a category' })}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select a category</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date *</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className={`w-full px-3 py-2 border ${errors.date ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            SEO Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              {...register('metaTitle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SEO meta title"
            />
            <p className="mt-1 text-xs text-gray-500">Recommended: 50-60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="example-blog-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Keyword</label>
            <input
              type="text"
              {...register('primaryKeyword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Main SEO keyword"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical url</label>
            <input
              type="text"
              {...register('canonicalurl')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Main SEO keyword"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div key={tag} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type tag and press Enter"
            />
            <p className="mt-1 text-xs text-gray-500">Press Enter to add tags</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              {...register('metaDescription')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
              placeholder="Brief meta description for search engines..."
              maxLength={160}
            />
            <p className="mt-1 text-xs text-gray-500">Recommended: 150-160 characters</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Featured Image
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image *</label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('image', { required: 'Image is required' })}
                    className="sr-only"
                  />
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  {imageFile?.length > 0 ? imageFile[0].name : 'No file chosen'}
                </span>
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
            </div>

            {imagePreview && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                <div className="mt-1">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs h-auto rounded-md shadow-sm border border-gray-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
              <input
                type="text"
                {...register('altTag')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description for accessibility"
              />
              <p className="mt-1 text-xs text-gray-500">Important for SEO and accessibility</p>
            </div>
          </div>
        </div>
        <div className='p-4 bg-gray-50 rounded-lg'>
          <LexicalEditor
            type="question"
            value=""
            onChange={setContant}
            placeholder="Enter sub-question..."
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Publish Blog
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBlog;