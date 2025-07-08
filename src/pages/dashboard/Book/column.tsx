import { FiEdit, FiTrash } from "react-icons/fi";
import GlassButton from "../../../components/Button/Button";
import type { ColumnDefinition } from "../../../components/Table/Table";
import type { BookProps } from "../../../utils/types";
import { getBundleDetail } from "../../../services/book";
import BundleDetailsModal from "./BundleDetailsModal";
import { useModal } from "../../../context/ModalContext";

const fetchBundleDetailsDirect = async (id: any) => {
    // Call your API directly, not via Redux
    const result = await getBundleDetail(id);
    return result;
};

export const Columns = (
    handleNavigate: (book: BookProps) => void,
    navigate: any,
    handleDeleteBook: any,
    showModal
): ColumnDefinition<BookProps>[] => [
        { key: 'name', title: 'Product Name', align: 'left' },
        { key: 'course_name', title: 'Course', align: 'center' },
        { key: 'subject_name', title: 'Subject', align: 'center' },
        {
            key: 'is_bundle', title: 'Bundle', align: 'center', render: (_, row) => {
                return row?.is_bundle ? (
                    <span
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-lg cursor-pointer"
                        onClick={async e => {
                            e.stopPropagation();
                            showModal({
                                title: "Book Bundle Details",
                                content: (
                                    <BundleDetailsModal id={row.id} fetchBundleDetails={fetchBundleDetailsDirect} />
                                ),
                                type: "default",
                                size: "lg"
                            });
                        }}
                    >
                        Yes
                    </span>
                ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">No</span>
                );
            }
        },
        { key: 'language', title: 'Language', align: 'center' },
        { key: 'original_price', title: 'Original Price', align: 'right' },
        { key: 'discount_percentage', title: 'Discount (%)', align: 'right' },
        { key: 'total_price', title: 'Discounted Price', align: 'right' },
        {
            key: 'out_of_stock',
            title: 'Stock Status',
            align: 'center',
            render: (_, row) => row.out_of_stock === 0 ? <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">In Stock</span> : <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-lg">Out of Stock</span>
        },
        { key: 'publisher', title: 'Publisher', align: 'left' },
        {
            key: 'actions',
            title: 'Actions',
            align: 'left',
            render: (_, row: BookProps) => (
                <div className="flex space-x-2">
                    <GlassButton
                        onClick={() => handleNavigate(row)}
                        icon={<FiEdit className="text-base" />}
                        color="green"
                        title="Edit"
                    />
                    <GlassButton
                        onClick={() => navigate(`/dashboard/book-images/${row.id}`)}
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>}
                        color="green"
                        title="Images"
                    />
                    <GlassButton
                        onClick={() => handleDeleteBook(row.id)}
                        icon={<FiTrash className="text-base" />}
                        color="red"
                        title="Delete"
                    />
                </div>
            )
        }
    ];
