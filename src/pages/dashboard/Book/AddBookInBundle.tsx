import { useNavigate } from "react-router-dom"
import Button from "../../../components/TextEditor/ui/Button"
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux"
import { FaArrowLeft } from "react-icons/fa"
import { useEffect, useState } from "react"
import { addBookBundle, getAllBooks } from "../../../store/slices/bookSlice"
import { useAlert } from "../../../context/AlertContext"

function AddBookInBundle() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { showAlert } = useAlert()
    const { loading, data } = useAppSelector(state => state.books)
    // const [selectedBookId, setSelectedBookId] = useState("");
    const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedBundleId, setSelectedBundleId] = useState("");
    const [bookIds, setBooks] = useState<any>([])
    const [bundleBooks, setBundleBooks] = useState<any>([])
    useEffect(() => {
        dispatch(getAllBooks());
    }, [dispatch]);
    const handleToggleBook = (id: string) => {
        setSelectedBookIds((prev) =>
            prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (data) {
            const updatedBooks = data?.filter((item) => !item?.is_bundle)?.map((item: any) => ({
                id: item.id,
                book_name: item.name,
            }));
            setBooks(updatedBooks);
        }
    }, [data]);
    useEffect(() => {
        if (data) {
            const updatedBooks = data?.filter((item) => item?.is_bundle)?.map((item: any) => ({
                id: item.id,
                book_name: item.name,
            }));
            setBundleBooks(updatedBooks);
        }
    }, [data]);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const payload = {
            book_id: selectedBundleId,
            bundle_book_id: selectedBookIds,
        };
        const res = await dispatch(addBookBundle(payload as any))
        showAlert((res.payload as any)?.message, "success")
        navigate("/dashboard/books")
    };
    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add New Book in bundle
            </h2>
                <Button
                    onClick={() => navigate('/dashboard/books')}
                    className="flex items-center gap-2"
                >
                    <FaArrowLeft /> Back to List
                </Button></div>
            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
                            <select
                                value={selectedBookId}
                                onChange={e => setSelectedBookId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Book</option>
                                {bookIds?.map((book: { id: string; book_name: string }) => (
                                    <option key={book.id} value={book.id}>
                                        {book.book_name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Books</label>

                            {/* Dropdown trigger */}
                            <div
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex flex-wrap gap-2 min-h-[42px]"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {selectedBookIds.length === 0 && (
                                    <span className="text-gray-400">Select books...</span>
                                )}
                                {selectedBookIds.map((id) => {
                                    const book = bookIds.find((b: any) => b.id === id);
                                    return (
                                        <span
                                            key={id}
                                            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                                        >
                                            {book?.book_name}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Dropdown options */}
                            {dropdownOpen && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {bookIds.map((book: any) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleToggleBook(book.id)}
                                            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center justify-between ${selectedBookIds.includes(book.id) ? "bg-blue-50" : ""
                                                }`}
                                        >
                                            <span>{book.book_name}</span>
                                            {selectedBookIds.includes(book.id) && (
                                                <svg
                                                    className="h-4 w-4 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bundle</label>
                            <select
                                value={selectedBundleId}
                                onChange={e => setSelectedBundleId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Bundle</option>
                                {bundleBooks?.map((bundle: any) => (
                                    <option key={bundle.id} value={bundle.id}>
                                        {bundle.book_name}
                                    </option>
                                ))}
                            </select>
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
                            "Create Bundle"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddBookInBundle