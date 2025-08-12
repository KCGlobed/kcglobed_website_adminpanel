import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LexicalEditor from "../../../components/TextEditor";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { getAllAuthors, getAllBooks, getBookImage, updateExistingBook } from "../../../store/slices/bookSlice";
import Button from "../../../components/TextEditor/ui/Button";
import { FaArrowLeft } from "react-icons/fa";
import { addRelatedBooks, assignAuthorToBook, deleteBookAuthor, deleteRelatedBook, getBookAuthorsApi, getRelatedBooks } from "../../../services/book";

interface Book {
    id?: number;
    uuid?: string;
    name: string;
    course_name: string;
    subject_name: string;
    short_description: string;
    no_of_pages: number;
    language: string;
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
    description?: string;
    images?: string[];
    is_bundle?: boolean;
}

const UpdateBookForm: React.FC = () => {
    const location = useLocation();
    const [initialAuthor, setInitialAuthor] = useState('')
    const [assignAuthor, setAssignAuthor] = useState()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [alreadyRelatedBooks, setAlreadyRelatedBooks] = useState([]);
    const { authors, data } = useAppSelector(state => state.books);
    const book: Book = location.state?.book;
    const [idForDeleteAuthor, setIdForDeleteAuthor] = useState('')
    const [formData, setFormData] = useState<Book | null>(null);
    const [previewImage, setPreviewImage] = useState<{ file?: File; url: string; isNew: boolean } | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [related_books, setRelatedBooks] = useState<string[]>([]);
    // Prefill from backend
    useEffect(() => {
        if (book && book.id !== undefined) {
            dispatch(getBookImage(book.id as any));
            setFormData({ ...book, is_bundle: (book as any).is_bundle ?? false });
            if (book.perview_image) {
                setPreviewImage({ url: book.perview_image, isNew: false });
            }
        }
    }, [book]);
    const getBookAuthors = async () => {
        try {
            const res = await getBookAuthorsApi(book.id);
            if (res && res.length > 0) {
                setIdForDeleteAuthor(res[0]?.id || '')
                const authorId = res[0]?.author_info?.id || '';
                setAssignAuthor(authorId);
                setInitialAuthor(authorId);
            }
        } catch (error) {

        }
    }
    const handleToggleBook = (id: string) => {
        setRelatedBooks((prev) =>
            prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
        );
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let parsedValue: any = value;
        if (type === "number") {
            parsedValue = Number(value);
        } else if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked;
        }
        setFormData(prev => prev ? ({
            ...prev,
            [name]: parsedValue,
        }) : prev);
    };

    const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewImage && previewImage.isNew) URL.revokeObjectURL(previewImage.url);
            const url = URL.createObjectURL(file);
            setPreviewImage({ file, url, isNew: true });
            setFormData(prev => prev ? ({ ...prev, perview_image: file.name }) : prev);
        }
    };
    const handleRemovePreviewImage = () => {
        if (previewImage) {
            if (previewImage.isNew) URL.revokeObjectURL(previewImage.url);
            setPreviewImage(null);
            setFormData(prev => prev ? ({ ...prev, perview_image: "" }) : prev);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData?.id) return;
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
        if (previewImage && previewImage.isNew && previewImage.file) {
            data.append("perview_image", previewImage.file);
        } else {
            data.delete && data.delete("perview_image");
        }
        try {
            await dispatch(updateExistingBook({ data, id: formData.id })).unwrap();
            if (assignAuthor && assignAuthor !== initialAuthor) {
                await deleteBookAuthor(idForDeleteAuthor);
                await assignAuthorToBook({ book_id: book.id, author_id: assignAuthor });
            }
            if (related_books?.length) {
                const deletedIds = alreadyRelatedBooks
                    .filter((item: any) => !related_books.includes(item.related_book))
                    .map((item: any) => item.id);
                if (deletedIds?.length) {
                    await deleteRelatedBook({ related_book_id: deletedIds });
                }
                const alreadyIds = alreadyRelatedBooks.map((item: any) => item.related_book);
                const newIds = related_books.filter(id => !alreadyIds.includes(id));
                if (newIds?.length) {
                    await addRelatedBooks({
                        book_id: book.id,
                        related_book_id: newIds.map(id => Number(id))
                    });
                }
            }
            navigate("/dashboard/books")
        } catch (err) {
            console.error("Error updating book or uploading images", err);
        }
    };
    // when you set alreadyRelatedBooks
    const getAlreadyRelatedBooks = async () => {
        try {
            const res = await getRelatedBooks(book.id);
            if (res && res.length > 0) {
                setRelatedBooks(res.map((b: any) => b.related_book));

                setAlreadyRelatedBooks(res);
                console.log(res, ' res');
            }
        } catch (error) {
            console.error("Error fetching related books", error);
        }
    };
    useEffect(() => {
        dispatch(getAllAuthors() as any)
        getBookAuthors()
        getAlreadyRelatedBooks()
    }, [])
    useEffect(() => {
        dispatch(getAllBooks() as any);
    }, [])
    if (!formData) return <div>Loading...</div>;
    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center"> <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Book
            </h2>
                <Button
                    onClick={() => navigate('/dashboard/books')}
                    className="flex items-center gap-2"
                >
                    <FaArrowLeft /> Back to List
                </Button></div>
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
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Table of Contents
                        </label>
                        <div className="border border-gray-300 rounded-md p-2 bg-white">
                            <LexicalEditor
                                type="description"
                                value={formData.description}
                                onChange={(value) =>
                                    setFormData(prev => prev ? { ...prev, description: value } : prev)
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
                                checked={!!formData.is_bundle}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_bundle" className="ml-2 block text-sm text-gray-700">
                                Is Bundle
                            </label>
                        </div>
                    </div>
                </div>
                {/* Section 5: Descriptions */}
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
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Related Books
                        </label>

                        {/* Dropdown trigger */}
                        <div
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex flex-wrap gap-2 min-h-[42px]"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            {related_books.length === 0 && (
                                <span className="text-gray-400">Select books...</span>
                            )}
                            {related_books.map((id) => {
                                const book = data?.find((b) => b.id === id);
                                return (
                                    <span
                                        key={id}
                                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                                    >
                                        {book?.name}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Dropdown options */}
                        {dropdownOpen && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {data.map((book) => (
                                    <div
                                        key={book.id}
                                        onClick={() => handleToggleBook(book.id)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center justify-between ${related_books.includes(book.id) ? "bg-blue-50" : ""
                                            }`}
                                    >
                                        <span>{book.name}</span>
                                        {related_books.includes(book.id) && (
                                            <svg
                                                className="h-4 w-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
                                    setFormData(prev => prev ? { ...prev, short_description: value } : prev)
                                }
                                placeholder="Write a brief description..."
                            />
                        </div>

                    </div>
                    {/* Full Description */}

                </div>
                {/* Submit Button */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Update Book
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateBookForm;