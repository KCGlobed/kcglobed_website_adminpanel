import { useEffect, useState } from 'react';

interface BundleDetailsModalProps {
    id: number | string;
    fetchBundleDetails: (id: number | string) => Promise<any>;
}

function BundleDetailsModal({ id, fetchBundleDetails }: BundleDetailsModalProps) {
    const [details, setDetails] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchBundleDetails(id).then(data => {
            if (mounted) {
                setDetails(data);
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setDetails(null);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [id, fetchBundleDetails]);

    if (loading) return <div className="py-8 text-center text-gray-500">Loading...</div>;
    if (!details || details?.length === 0) return <div className="py-8 text-center text-gray-500">No bundle details found.</div>;

    return (
        <div className="space-y-6">
            {/* Main Bundle Info - Find the main bundle (is_bundle: true) */}
            {details?.filter(item => item.bundle_book_info.is_bundle).map(bundle => (
                <div key={bundle.id} className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200">
                    <img
                        src={bundle.bundle_book_info.perview_image}
                        alt={bundle.bundle_book_info.name}
                        className="w-full md:w-48 h-auto rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mt-0">{bundle.bundle_book_info.name}</h3>
                        <div className="flex items-center gap-3 my-3">
                            {bundle.bundle_book_info.original_price && (
                                <span className="text-gray-500 line-through">
                                    ${Number(bundle.bundle_book_info.original_price).toFixed(2)}
                                </span>
                            )}
                            <span className="text-lg font-bold text-red-600">
                                ${Number(bundle.bundle_book_info.total_price).toFixed(2)}
                            </span>
                            {bundle.bundle_book_info.discount_percentage > 0 && (
                                <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">
                                    {bundle.bundle_book_info.discount_percentage}% OFF
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            {bundle.bundle_book_info.publisher && (
                                <span><strong>Publisher:</strong> {bundle.bundle_book_info.publisher}</span>
                            )}
                            {bundle.bundle_book_info.no_of_pages && (
                                <span><strong>Pages:</strong> {bundle.bundle_book_info.no_of_pages}</span>
                            )}
                            {bundle.bundle_book_info.language && (
                                <span><strong>Language:</strong> {bundle.bundle_book_info.language}</span>
                            )}
                        </div>
                        {bundle.bundle_book_info.short_description && (
                            <div
                                className="text-gray-700 text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: bundle.bundle_book_info.short_description }}
                            />
                        )}
                    </div>
                </div>
            ))}
            {/* Included Books Section - All items except the main bundle */}
            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Books Included in This Bundle:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {details.filter(item => !item.bundle_book_info.is_bundle).map(book => (
                        <div key={book.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                            <img
                                src={book.bundle_book_info.perview_image}
                                alt={book.bundle_book_info.name}
                                className="w-full h-auto rounded mb-2"
                            />
                            <div>
                                <h5 className="font-medium text-gray-800 truncate">{book.bundle_book_info.name}</h5>
                                <div className="flex items-center mt-1">
                                    <span className="font-bold text-sm">
                                        ${Number(book.bundle_book_info.total_price).toFixed(2)}
                                    </span>
                                    {book.bundle_book_info.original_price && (
                                        <span className="text-gray-500 text-xs line-through ml-2">
                                            ${Number(book.bundle_book_info.original_price).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Action Buttons */}

        </div>
    );
}

export default BundleDetailsModal;