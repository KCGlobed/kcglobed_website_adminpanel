// src/components/ModalContent.tsx
import { useEffect, forwardRef } from "react";

interface ModalContentProps {
    data: any;
    onReadyForPdf?: () => void;
}

// Use forwardRef so parent can get ref to DOM element
export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
    ({ data, onReadyForPdf }, ref) => {
        useEffect(() => {
            if (onReadyForPdf) onReadyForPdf();
        }, [onReadyForPdf]);

        return (
            <div
                ref={ref}
                id={`order-${data.orderID}`}
                style={{ color: "#111", backgroundColor: "#fff" }}
                className="space-y-4 text-sm text-gray-700 bg-white p-4 rounded-md"
            >
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                    <p><strong>First Name:</strong> {data.first_name}</p>
                    <p><strong>Last Name:</strong> {data.last_name}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Mobile:</strong> {data.mobile}</p>
                    <p className="col-span-2"><strong>Address:</strong> {data.address}</p>
                    <p><strong>City:</strong> {data.city}</p>
                    <p><strong>Postal Code:</strong> {data.postal_code}</p>
                    <p><strong>Country:</strong> {data.country}</p>
                    <p><strong>Payment Method:</strong> {data.payment_method}</p>
                    <p><strong>Status:</strong> {data.payment_status}</p>
                    <p><strong>Amount:</strong> ₹{data.amount}</p>
                    <p><strong>Tax:</strong> ₹{data.tax_amount}</p>
                    <p><strong>Total:</strong> ₹{data.total_amount}</p>
                    <p><strong>Order Date:</strong> {new Date(data.order_date).toLocaleString()}</p>
                </div>

                {/* Ordered Books */}
                {Array.isArray(data.ordered_books) && data.ordered_books.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <h3 className="text-base font-semibold mb-2">Ordered Books</h3>
                        <div className="space-y-3">
                            {data.ordered_books.map((book: any) => (
                                <div key={book.id} className="flex gap-3 border border-gray-200 p-3 rounded-md">
                                    <img
                                        src={book.perview_image}
                                        alt={book.name}
                                        className="w-16 h-16 rounded-md object-cover border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{book.name}</p>
                                        <p className="text-gray-500 text-xs">{book.subject_name}</p>
                                        <p className="text-gray-600 text-sm">
                                            ₹{book.total_price} &nbsp;•&nbsp; {book.language}
                                        </p>
                                        <p className="text-xs mt-1">Publisher: {book.publisher}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export default ModalContent;
