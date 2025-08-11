import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { deleteBookImage, getBookImage, uploadBookImage } from "../../../store/slices/bookSlice";


const BookImageManager: React.FC = () => {
    const { id: bookId } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const bookImages: any = useAppSelector(state => state.books.bookImages || []);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [files, setFiles] = useState<{
        low: File[];
        medium: File[];
        high: File[];
    }>({ low: [], medium: [], high: [] });

    const handleFileChange = (quality: "low" | "medium" | "high", newFiles: FileList | null) => {
        if (!newFiles) return;
        setFiles(prev => ({
            ...prev,
            [quality]: [...prev[quality], ...Array.from(newFiles)]
        }));
    };

    const removeFile = (quality: "low" | "medium" | "high", index: number) => {
        setFiles(prev => {
            const updatedQualityFiles = [...prev[quality]].filter((_, i) => i !== index);
            return { ...prev, [quality]: updatedQualityFiles };
        });
    };


    const handleUpload = async () => {
        if (!bookId) return;

        if (!files.low.length || !files.medium.length || !files.high.length) {
            alert("Please select images for all three qualities (low, medium, high)");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("book_id", bookId);

            // Append multiple images for each quality
            files.high.forEach((file, index) => {
                formData.append(`high[${index}]`, file);
            });

            // Medium images with index
            files.medium.forEach((file, index) => {
                formData.append(`medium[${index}]`, file);
            });

            // Low images with index
            files.low.forEach((file, index) => {
                formData.append(`low[${index}]`, file);
            });

            console.log(files.low, files.medium, files.high);
            await dispatch(uploadBookImage(formData));
            await dispatch(getBookImage(bookId as any));
            setFiles({ low: [], medium: [], high: [] }); // Reset
        } catch (error) {
            console.error("Error uploading images:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookId) {
            dispatch(getBookImage(bookId as any));
        }
    }, [bookId, dispatch]);

    // const handleFileChange = (quality: "low" | "medium" | "high", file: File | null) => {
    //     setFiles(prev => ({ ...prev, [quality]: file }));
    // };

    // const handleUpload = async () => {
    //     if (!bookId) return;
    //     if (!files.low || !files.medium || !files.high) {
    //         alert("Please select all three image files (low, medium, high quality)");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const formData = new FormData();
    //         formData.append("book_id", bookId);
    //         formData.append("low", files.low);
    //         formData.append("medium", files.medium);
    //         formData.append("high", files.high);

    //         await dispatch(uploadBookImage(formData));
    //         await dispatch(getBookImage(bookId as any));

    //         // Reset files after successful upload
    //         setFiles({ low: null, medium: null, high: null });
    //     } catch (error) {
    //         console.error("Error uploading images:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await dispatch(deleteBookImage(id as any));
            await dispatch(getBookImage(bookId as any));
        } catch (error) {
            console.error("Error deleting image:", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Book Images Management</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload New Image Set</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {(["low", "medium", "high"] as const).map((quality) => (
                        <div key={quality} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
                                {quality} Quality
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".svg,.jpg,.jpeg,.png,.webp"
                                    id={`upload-${quality}`}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(quality, e.target.files)}
                                    multiple
                                    disabled={loading}
                                />
                                <label
                                    htmlFor={`upload-${quality}`}
                                    className={`block w-full py-3 px-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${files[quality].length
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                >
                                    {files[quality].length ? (
                                        <div className="space-y-1">
                                            {files[quality].map((file, index) => (
                                                <div key={index} className="flex justify-between items-center text-green-700 font-medium bg-green-100 px-2 py-1 rounded">
                                                    <span className="truncate max-w-[120px]">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();      // Stops label's file input behavior
                                                            e.stopPropagation();     // Stops click from bubbling up
                                                            removeFile(quality, index);
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}

                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Select {quality} quality images</span>
                                    )}
                                </label>
                            </div>

                        </div>
                    ))}
                </div>
                <button
                    onClick={handleUpload}
                    disabled={loading || !files.low || !files.medium || !files.high}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${loading || !files.low || !files.medium || !files.high
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        "Upload All Images"
                    )}
                </button>
            </div>

            {/* Existing Images Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
                    <div className="col-span-2 font-medium text-gray-700">Upload Date</div>
                    <div className="col-span-3 font-medium text-gray-700">Low Quality</div>
                    <div className="col-span-3 font-medium text-gray-700">Medium Quality</div>
                    <div className="col-span-3 font-medium text-gray-700">High Quality</div>
                    <div className="col-span-1 font-medium text-gray-700">Actions</div>
                </div>

                {bookImages?.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No image sets uploaded yet
                    </div>
                ) : (
                    bookImages?.map((image: any) => (
                        <div key={image.id} className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <div className="col-span-2 flex items-center text-sm text-gray-600">
                                {new Date(image.created_at).toLocaleString()}
                            </div>

                            {(["low", "medium", "high"] as const).map((quality) => (
                                <div key={quality} className="col-span-3 flex items-center">
                                    {image[quality] ? (
                                        <div className="relative group w-full max-w-[6rem]">
                                            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 group-hover:border-blue-300 group-hover:shadow-md">
                                                <img
                                                    src={image[quality]}
                                                    alt={`${quality} quality preview`}
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all duration-200 group-hover:bg-black/20">
                                                <a
                                                    href={image[quality]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-full shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                                                    title={`View ${quality} quality in full size`}
                                                >
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2 text-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="mt-1 text-xs font-medium text-gray-400">
                                                {quality}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="col-span-1 flex items-center justify-end">
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    disabled={deletingId === image.id}
                                    className="p-2 text-red-500 hover:text-red-700 disabled:text-red-300 transition-colors"
                                    title="Delete this image set"
                                >
                                    {deletingId === image.id ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookImageManager;