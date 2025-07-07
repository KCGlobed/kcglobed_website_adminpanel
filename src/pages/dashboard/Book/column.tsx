import type { ColumnDefinition } from "../../../components/Table/Table";
import type { BookProps } from "../../../utils/types";

export const Columns: ColumnDefinition<BookProps>[] = [
    { key: 'name', title: 'Product Name', align: 'left' },
    { key: 'course_name', title: 'Course', align: 'center' },
    { key: 'subject_name', title: 'Subject', align: 'center' },
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
];
