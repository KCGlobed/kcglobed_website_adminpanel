
function ExportButtons({ handleExportClick, showExportModal, startDate, endDate, setStartDate, setEndDate, exportType, setShowExportModal, handleSendExport, exportUrl }) {
    return (
        <div>
            <div className="flex gap-2 items-center">
                {/* Download link for exported file */}
                {exportUrl && (
                    <div className="px-4 py-2 bg-green-100 border border-green-300 rounded flex items-center gap-4 justify-between">
                        <span className="text-green-800 font-medium">Export successful!</span>
                        <a
                            href={exportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1 bg-blue-600 text-xs text-white rounded hover:bg-blue-700 transition"
                            download
                        >
                            Download File
                        </a>
                    </div>
                )}
                <button
                    className="px-4 cursor-pointer py-2 bg-[#9810FA] text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleExportClick('csv')}
                >
                    Export Excel
                </button>
                <button
                    className="px-4 cursor-pointer py-2 bg-[#9810FA] text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleExportClick('pdf')}
                >
                    Export PDF
                </button>
            </div>
            {/* Export Modal Popup */}
            {showExportModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-10 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col gap-4">
                        <h3 className="text-lg font-semibold mb-2">Export {exportType?.toUpperCase()}</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Start Date:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            />

                            <label className="text-sm font-medium text-gray-700">End Date:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                onClick={() => setShowExportModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 cursor-pointer py-2 bg-[#9810FA] text-white rounded hover:bg-blue-700 transition"
                                onClick={handleSendExport}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ExportButtons