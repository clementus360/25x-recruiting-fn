'use client'

import React from 'react';

export default function FilePreview({ pdfUrl, handleChangeStep, onClose }: { pdfUrl: string, handleChangeStep: () => void, onClose: () => void }) {

    return (
        <div className='flex flex-col gap-6 w-full'>
            <h2 className="text-xl font-semibold mb-3">File Preview</h2>

            {/* Container for PDF with a fixed height and scroll */}
            <div className="pdf-viewer h-96 overflow-y-auto border">
                <iframe
                    src={pdfUrl}
                    title="PDF Preview"
                    className="w-full h-full"
                />
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
