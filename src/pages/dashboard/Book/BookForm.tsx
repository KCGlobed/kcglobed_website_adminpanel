import React, { useState, useEffect } from "react";
import LexicalEditor from "../../../components/TextEditor";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { uploadBookImage, uploadNewBook } from "../../../store/slices/bookSlice";

interface Book {
    id?: number;
    uuid?: string;
    name: string;
    course_name: string;
    subject_name: string;
    short_description: string;
    no_of_pages: number;
    language: string;
    // book_file: File | null;
    perview_image: string;
    original_price: number;
    discount_percentage: number;
    discount_type: string | null;
    publisher: string;
    isbn: string | null;
    gst_amount: number;
    total_price: number;
    usa_original_price: number;
    usa_discount_percentage: number;
    usa_total_price: number;
    visible: number;
    out_of_stock: number;
    created_at?: string;
    description?: string
}

interface BookFormProps {
    initialData?: Book; // for update
    onSubmit: (data: FormData) => void;
}

const BookForm: React.FC<BookFormProps> = () => {
    const [formData, setFormData] = useState<Book>({
        name: "",
        course_name: "",
        subject_name: "",
        short_description: "",
        no_of_pages: 0,
        language: "English",
        // book_file: null,
        perview_image: "",
        original_price: 0,
        discount_percentage: 0,
        discount_type: null,
        publisher: "",
        isbn: null,
        gst_amount: 0,
        total_price: 0,
        usa_original_price: 0,
        usa_discount_percentage: 0,
        usa_total_price: 0,
        visible: 1,
        out_of_stock: 0,
        description: "",

    });
    const { data, loading } = useAppSelector(state => state.books)
    const dispatch = useAppDispatch()
    // New state for images with preview URLs
    const [images, setImages] = useState<{ file: File; url: string }[]>([]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.url));
        };
    }, [images]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? Number(value) : value;
        setFormData(prev => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    // Updated file change handler for multiple images
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        // Add new files and generate preview URLs
        const newImages = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
        // Optionally, if you want to keep the old single book_file for legacy reasons:
        // setFormData(prev => ({
        //     ...prev,
        //     book_file: files[0] ?? null,
        // }));
    };

    // Remove image handler
    const handleRemoveImage = (index: number) => {
        setImages(prev => {
            const toRemove = prev[index];
            if (toRemove) URL.revokeObjectURL(toRemove.url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: any = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                data.append(key, value instanceof File ? value : String(value));
            }
        });

        try {
            const res: any = await dispatch(uploadNewBook(data)).unwrap();
            console.log(res, 'this is the res')
            const book_id = res?.id;
            if (!book_id) {
                console.error("Book ID not returned!");
                return;
            }
            for (const img of images) {
                const imageData: any = new FormData();
                imageData.append("image", img);
                imageData.append("book_id", book_id);
                await dispatch(uploadBookImage(imageData));
            }

        } catch (err) {
            console.error("Error creating book or uploading images", err);
        }
    };


    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add New Book
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input
                                name="course_name"
                                value={formData.course_name}
                                onChange={handleChange}
                                placeholder="Course Name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                            <input
                                name="subject_name"
                                value={formData.subject_name}
                                onChange={handleChange}
                                placeholder="Subject Name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Pages</label>
                            <input
                                name="no_of_pages"
                                type="number"
                                value={formData.no_of_pages}
                                onChange={handleChange}
                                placeholder="e.g. 120"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preview Image URL</label>
                            <input
                                name="perview_image"
                                value={formData.perview_image}
                                onChange={handleChange}
                                placeholder="https://example.com/preview.jpg"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Pricing */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Pricing Details (India)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                            <input
                                name="original_price"
                                type="number"
                                value={formData.original_price}
                                onChange={handleChange}
                                placeholder="₹"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                            <input
                                name="discount_percentage"
                                type="number"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                placeholder="e.g. 10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                            <input
                                name="total_price"
                                type="number"
                                value={formData.total_price}
                                onChange={handleChange}
                                placeholder="₹"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <input
                                name="discount_type"
                                value={formData.discount_type || ""}
                                onChange={handleChange}
                                placeholder="e.g. Flat or %"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: USA Pricing */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Pricing Details (USA)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">USA Original Price</label>
                            <input
                                name="usa_original_price"
                                type="number"
                                value={formData.usa_original_price}
                                onChange={handleChange}
                                placeholder="$"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">USA Discount %</label>
                            <input
                                name="usa_discount_percentage"
                                type="number"
                                value={formData.usa_discount_percentage}
                                onChange={handleChange}
                                placeholder="e.g. 15"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">USA Total Price</label>
                            <input
                                name="usa_total_price"
                                type="number"
                                value={formData.usa_total_price}
                                onChange={handleChange}
                                placeholder="$"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 4: Additional Info */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Amount</label>
                            <input
                                name="gst_amount"
                                type="number"
                                value={formData.gst_amount}
                                onChange={handleChange}
                                placeholder="₹"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                            <input
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                                placeholder="Publisher Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                            <input
                                name="isbn"
                                value={formData.isbn || ""}
                                onChange={handleChange}
                                placeholder="ISBN Number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                            <select
                                name="visible"
                                value={formData.visible}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>Visible</option>
                                <option value={0}>Hidden</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                            <select
                                name="out_of_stock"
                                value={formData.out_of_stock}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>In Stock</option>
                                <option value={1}>Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* Section 5: Descriptions */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-6">
                    <h2 className="text-lg font-semibold text-gray-700">Descriptions</h2>

                    {/* Short Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Short Description
                        </label>
                        <div className="border border-gray-300 rounded-md p-2 bg-white">
                            <LexicalEditor
                                type="short_description"
                                value={formData.short_description}
                                onChange={(value) =>
                                    setFormData({ ...formData, short_description: value })
                                }
                                placeholder="Write a brief description..."
                            />
                        </div>
                    </div>

                    {/* Full Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Full Description
                        </label>
                        <div className="border border-gray-300 rounded-md p-2 bg-white">
                            <LexicalEditor
                                type="description"
                                value={formData.description}
                                onChange={(value) =>
                                    setFormData({ ...formData, description: value })
                                }
                                placeholder="Write a detailed description..."
                            />
                        </div>
                    </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        accept=".svg,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                                    <img
                                        src={img.url}
                                        alt={`preview-${idx}`}
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                        title="Remove image"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create Book
                    </button>
                </div>
            </form>


        </div>
    );
};

export default BookForm;

