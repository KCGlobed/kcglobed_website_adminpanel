import React, { useState, useEffect } from "react";
import LexicalEditor from "../../../components/TextEditor";
import { useAppSelector } from "../../../hooks/useRedux";
import Button from "../../../components/TextEditor/ui/Button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import type { AuthorProps } from "../../../utils/types";
import { createNewAuthor } from "../../../services/book";


interface AuthorFormProps {
    initialData?: AuthorProps;
    onSubmit: (data: FormData) => void;
}

const AuthorForm: React.FC<AuthorFormProps> = () => {
    const { loading } = useAppSelector(state => state.books)
    const { showAlert } = useAlert()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<AuthorProps>({
        name: "",
        description: "",
        image: "",
    });
    const [previewImage, setPreviewImage] = useState<{ file: File; url: string } | null>(null);

    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage.url);
        };
    }, [previewImage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? Number(value) : value;
        setFormData(prev => ({
            ...prev,
            [name]: parsedValue,
        }));
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
            data.append(key, value instanceof File ? value : String(value))
        });
        if (previewImage) {
            data.append("image", previewImage.file);
        }
        try {
            const res = await createNewAuthor(data);
            console.log(res, 'res')
            showAlert(res.message, 'success')
            navigate("/dashboard/authors")
        } catch (err) {
            // console.error("Error creating book or uploading images", err);
        }
    };


    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add New Author
            </h2>
                <Button
                    onClick={() => navigate('/dashboard/authors')}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Author Name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Profile</label>
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
                    {/* Full Description */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            About Author
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
                            "Create Author"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthorForm;

