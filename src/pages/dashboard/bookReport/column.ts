import type { ColumnDefinition } from "../../../components/Table/Table";
import type { BookOrder } from "../../../utils/types";

export const Columns: ColumnDefinition<BookOrder>[] = [
    { key: 'orderID', title: 'Order ID', align: 'center' },
    { key: 'order_date', title: 'Order Date', align: 'center' },
    { key: 'first_name', title: 'First Name', align: 'center' },
    { key: 'last_name', title: 'Last Name', align: 'center' },
    { key: 'email', title: 'Email', align: 'center' },
    { key: 'mobile', title: 'Mobile', align: 'center' },
    { key: 'address', title: 'Address', align: 'left' },
    { key: 'city', title: 'City', align: 'center' },
    { key: 'postal_code', title: 'Postal Code', align: 'center' },
    { key: 'country', title: 'Country', align: 'center' },
    { key: 'payment_method', title: 'Payment Method', align: 'center' },
    { key: 'payment_status', title: 'Status', align: 'center' },
    { key: 'amount', title: 'Amount', align: 'right' },
    { key: 'tax_amount', title: 'Tax', align: 'right' },
    { key: 'total_amount', title: 'Total', align: 'right' },
    { key: 'razorpay_order_id', title: 'Razorpay Order ID', align: 'left' },
    { key: 'razorpay_payment_id', title: 'Razorpay Payment ID', align: 'left' }
]