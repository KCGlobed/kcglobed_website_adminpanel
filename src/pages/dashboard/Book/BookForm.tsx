import React, { useState, useEffect } from "react";
import LexicalEditor from "../../../components/TextEditor";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { getAllAuthors, uploadNewBook } from "../../../store/slices/bookSlice";
import Button from "../../../components/TextEditor/ui/Button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import { addBookImage, assignAuthorToBook } from "../../../services/book";

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
    gst_percentage: number;
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
    const { loading, authors } = useAppSelector(state => state.books)
    const [highImages, setHighImages] = useState<{ file: File; url: string }[]>([]);
    const [mediumImages, setMediumImages] = useState<{ file: File; url: string }[]>([]);
    const [lowImages, setLowImages] = useState<{ file: File; url: string }[]>([]);
    const [assignAuthor, setAssignAuthor] = useState()
    const { showAlert } = useAlert()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<Book & { is_bundle: boolean }>({
        name: "",
        course_name: "",
        subject_name: "",
        short_description: "",
        no_of_pages: undefined,
        language: "English",
        // book_file: null,
        perview_image: "",
        original_price: undefined,
        discount_percentage: undefined,
        discount_type: null,
        publisher: "",
        isbn: null,
        gst_percentage: undefined,
        total_price: undefined,
        usa_original_price: undefined,
        usa_discount_percentage: undefined,
        usa_total_price: undefined,
        visible: 1,
        out_of_stock: undefined,
        description: "",
        is_bundle: false,
    });
    const dispatch = useAppDispatch()
    const [previewImage, setPreviewImage] = useState<{ file: File; url: string } | null>(null);

    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage.url);
        };
    }, [previewImage]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number"
            ? value === "" ? "" : Number(value)
            : value;


        setFormData(prev => {
            let updated = { ...prev, [name]: parsedValue };

            // Auto-calculate India selling price
            if (name === "original_price" || name === "discount_percentage") {
                const discount = updated.discount_percentage || 0;
                const original = updated.original_price || 0;
                updated.total_price = Number((original - (original * discount) / 100).toFixed(2));
            }

            // Auto-calculate USA selling price
            if (name === "usa_original_price" || name === "usa_discount_percentage") {
                const discountUSA = updated.usa_discount_percentage || 0;
                const originalUSA = updated.usa_original_price || 0;
                updated.usa_total_price = Number((originalUSA - (originalUSA * discountUSA) / 100).toFixed(2));
            }

            return updated;
        });
    };


    const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewImage) URL.revokeObjectURL(previewImage.url);

            const url = URL.createObjectURL(file);
            setPreviewImage({ file, url });
            setFormData(prev => ({ ...prev, perview_image: file.name }));
        }
    };

    const handleRemovePreviewImage = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage.url);
            setPreviewImage(null);
            setFormData(prev => ({ ...prev, perview_image: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: any = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                if (key === "is_bundle") {
                    data.append(key, value ? "true" : "false");
                } else {
                    data.append(key, value instanceof File ? value : String(value));
                }
            }
        });
        if (previewImage) {
            data.append("perview_image", previewImage.file);
        }

        try {
            const res: any = await dispatch(uploadNewBook(data)).unwrap();
            // assign the author to the book

            if (assignAuthor) {
                await assignAuthorToBook({ book_id: res.data.book_id, author_id: assignAuthor });
            }
            // // prepare second API payload
            const formData = new FormData();
            formData.append("book_id", res.data.book_id);

            if (highImages?.length) {
                highImages.forEach((file: any, index: number) => {
                    formData.append(`high[${index}]`, file.file);
                });
            }

            if (mediumImages?.length) {
                mediumImages.forEach((file: any, index: number) => {
                    formData.append(`medium[${index}]`, file.file);
                });
            }

            if (lowImages?.length) {
                lowImages.forEach((file: any, index: number) => {
                    formData.append(`low[${index}]`, file.file);
                });
            }
            await addBookImage(formData);
            showAlert("Book added successfully", "success");
            navigate("/dashboard/books");
        } catch (err) {
            console.error("Error creating book or uploading images", err);
        }
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "high" | "medium" | "low"
    ) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        if (type === "high") setHighImages(prev => [...prev, ...newImages]);
        if (type === "medium") setMediumImages(prev => [...prev, ...newImages]);
        if (type === "low") setLowImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (type: "high" | "medium" | "low", index: number) => {
        if (type === "high") {
            URL.revokeObjectURL(highImages[index].url);
            setHighImages(prev => prev.filter((_, i) => i !== index));
        }
        if (type === "medium") {
            URL.revokeObjectURL(mediumImages[index].url);
            setMediumImages(prev => prev.filter((_, i) => i !== index));
        }
        if (type === "low") {
            URL.revokeObjectURL(lowImages[index].url);
            setLowImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        dispatch(getAllAuthors() as any)
    }, [])

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add New Book
            </h2>
                <Button
                    onClick={() => navigate('/dashboard/books')}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                            <select
                                value={assignAuthor || ""}
                                onChange={(e) => setAssignAuthor(e.target.value as any)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Author</option>
                                {Array.isArray(authors) && authors?.map((author: any) => (
                                    <option key={author.id || author.uuid || author.name} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preview Image</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.svg"
                                    onChange={handlePreviewImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {previewImage && (
                                    <div className="relative w-32 h-32 border rounded overflow-hidden">
                                        <img
                                            src={previewImage.url}
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemovePreviewImage}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            title="Remove preview image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                High Quality Images
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={(e) => handleImageChange(e, "high")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {highImages.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {highImages.map((img, index) => (
                                        <div key={index} className="relative w-32 h-32 border rounded overflow-hidden">
                                            <img src={img.url} alt={`High ${index + 1}`} className="object-cover w-full h-full" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage("high", index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Medium Quality Images
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={(e) => handleImageChange(e, "medium")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {mediumImages.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {mediumImages.map((img, index) => (
                                        <div key={index} className="relative w-32 h-32 border rounded overflow-hidden">
                                            <img src={img.url} alt={`Medium ${index + 1}`} className="object-cover w-full h-full" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage("medium", index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Low Quality Images
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={(e) => handleImageChange(e, "low")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {lowImages.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {lowImages.map((img, index) => (
                                        <div key={index} className="relative w-32 h-32 border rounded overflow-hidden">
                                            <img src={img.url} alt={`Low ${index + 1}`} className="object-cover w-full h-full" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage("low", index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Full Description */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Full Description
                        </label>
                        <div className="border border-gray-300 rounded-md p-2 w-full bg-white">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                            <input
                                name="total_price"
                                type="number"
                                value={formData.total_price}
                                onChange={handleChange}
                                placeholder="₹"
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <input
                                name="discount_type"
                                value={formData.discount_type || ""}
                                onChange={handleChange}
                                placeholder="e.g. Flat or %"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div> */}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">USA Selling Price</label>
                            <input
                                name="usa_total_price"
                                type="number"
                                value={formData.usa_total_price}
                                onChange={handleChange}
                                readOnly
                                placeholder="$"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 4: Additional Info */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Product Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Amount(%)</label>
                            <input
                                name="gst_percentage"
                                type="number"
                                value={formData.gst_percentage}
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
                        {/* isBundle Toggle */}
                        <div className="flex items-center mt-6">
                            <input
                                id="is_bundle"
                                name="is_bundle"
                                type="checkbox"
                                checked={formData.is_bundle}
                                onChange={e => setFormData(prev => ({ ...prev, is_bundle: e.target.checked }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_bundle" className="ml-2 block text-sm text-gray-700">
                                Is Bundle
                            </label>
                        </div>
                    </div>
                </div>
                {/* Section 5: Additional Info */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-6">
                    <h2 className="text-lg font-semibold text-gray-700">Additional Information (Optional)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input
                                name="course_name"
                                value={formData.course_name}
                                onChange={handleChange}
                                placeholder="Course Name"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
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
                </div>


                {/* Submit Button */}
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
                            "Create Book"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;

