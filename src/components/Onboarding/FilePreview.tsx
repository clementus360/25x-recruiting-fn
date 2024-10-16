'use client'

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import {Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

export default function FilePreview({ pdfUrl, handleChangeStep, onClose }: { pdfUrl: string, handleChangeStep: () => void, onClose: () => void }) {
    const [numPages, setNumPages] = useState<number>(); // For total number of PDF pages

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages); // Set the total number of pages when PDF is loaded
    };

    return (
        <div className='flex flex-col gap-6 w-full'>
            <h2 className="text-xl font-semibold mb-3">File Preview</h2>

            {/* Container for PDF with a fixed height and scroll */}
            <div className="pdf-viewer h-96 overflow-y-auto border">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
                    {/* Render all pages */}
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            className="pdf-page"
                            renderMode="canvas"
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    ))}
                </Document>
            </div>

            <div className='flex justify-between'>
                <button onClick={onClose} className="bg-gray-500 text-white px-3 py-2 rounded-md">Cancel</button>
                <div className="flex gap-2">
                    <button onClick={handleChangeStep} className="bg-gray-300 text-black px-3 py-2 rounded-md">Back</button>
                </div>
            </div>
        </div>
    );
}
