import React, { useEffect, useState } from "react";
import { Website_URL } from "../../../utils/constants";

interface SeoData {
    totalSeoPages: number;
    routes: string[];
}

export default function SeoPagesTable() {
    const [seoData, setSeoData] = useState<SeoData | null>(null);
    const baseUrl = "https://kcglobed.com";
    console.log(seoData, 'da')
    useEffect(() => {
        // Replace with your API endpoint
        fetch(`${Website_URL}/api/route-count`)
            .then((res) => res.json())
            .then((data) => setSeoData(data))
            .catch((err) => console.error("Error fetching SEO pages:", err));
    }, []);

    if (!seoData) {
        return <p className="p-4">Loading...</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">
                Total SEO Pages: {seoData.totalSeoPages}
            </h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="relative max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="min-w-full table-fixed divide-y divide-gray-200">
                        <thead
                            className="sticky top-0 z-10"
                            style={{ background: 'oklch(55.8% 0.288 302.321)', color: '#fff' }}
                        >
                            <tr className="">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider relative">#</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider relative">Page Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider relative">URL</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {seoData.routes.map((route, index) => {
                                const cleanRoute = route
                                    .replace(/\\/g, "/")
                                    .replace("/page.tsx", "");
                                const pageName = cleanRoute.split("/").pop()?.replace(/-/g, " ");
                                return (
                                    <tr className="hover:bg-gray-50 transition-colors duration-150" key={index}>
                                        <td className={`px-6 py-2 text-xs`}>{index + 1}</td>
                                        <td className={`px-6 py-2 text-xs`}>
                                            {pageName}
                                        </td>
                                        <td className={`px-6 py-2 text-xs`}>
                                            <a
                                                className="underline text-blue-600 hover:text-blue-800"
                                                href={`${baseUrl}${cleanRoute}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {`${baseUrl}${cleanRoute}`}
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
