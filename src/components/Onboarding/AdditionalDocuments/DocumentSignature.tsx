'use client'

import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureSection from '../ESignature/SignatureSection';
import { getAccessToken } from '@/data/cookies';
import { getAdditionalDocument } from '@/data/onboarding';
import { useError } from '@/context/ErrorContext';
import { FaCheckCircle } from 'react-icons/fa';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Oval } from 'react-loader-spinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentSignatureProps {
    type: string;
    onClose: () => void;
    onBack: () => void;
    onNext: () => void;
    handleSubmit: () => void;
    step: number;
    title: string;
    loading: boolean
}

const DocumentSignature: React.FC<DocumentSignatureProps> = ({
    onClose,
    onBack,
    onNext,
    handleSubmit,
    step,
    type,
    title,
    loading,
}) => {
    const [pdfUrl, setPdfUrl] = useState("")
    const [status, setStatus] = useState("")
    const { setError } = useError();
    const [agreed, setAgreed] = useState<boolean>(false);
    const [numPages, setNumPages] = useState<number>(1); // Total pages of the PDF
    const handleAgreed = (value: boolean) => setAgreed(value);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const fetchDocument = async (documentType: string) => {
        try {
            const token = getAccessToken();
            if (!token) return;

            const documentInfo = await getAdditionalDocument(documentType, token);

            setPdfUrl(documentInfo.documentUrl); // Set the document URL in the corresponding state
            setStatus(documentInfo.documentStatus)
        } catch (err: any) {
            setError(err.message || `Failed to get the ${documentType.replace('_', ' ').toLowerCase()}`);
        }
    };

    useEffect(() => {
        const fetchCurrentDocument = async () => {
            await fetchDocument(type);
        };

        fetchCurrentDocument();
    }, [])

    return (
        <div className="flex flex-col gap-6 w-full">

            {status === "COMPLETED" ? (
                <div className="flex flex-col min-h-[26rem] gap-8 items-center justify-center p-10 bg-green-50 rounded-md">
                    <h2 className="text-xl font-semibold mb-3">Step {step}: {title}</h2>
                    <FaCheckCircle size={100} className="text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold">Document Completed</h3>
                    <p className="text-sm text-grey text-center">This document has been successfully completed. No further action is required.</p>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-3">Step {step}: Review {title}</h2>
                    {/* PDF Viewer */}
                    <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-4">Review {title} Document</h3>
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
                                        className="pdf-page flex items-center justify-center"
                                        renderMode="canvas"
                                        renderAnnotationLayer={true}  // Enable annotation layer to support links
                                        renderTextLayer={false}
                                    />
                                ))}
                            </Document>
                        </div>
                    </div>

                    {/* Signature Section */}
                    <div className="border p-4 rounded-md bg-lightBlue">
                        <SignatureSection
                            isAgreed={agreed}
                            setIsAgreed={handleAgreed}
                        />
                    </div>
                </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button onClick={onClose} className="bg-gray-500 text-white px-3 py-2 rounded-md">
                    Cancel
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onBack}
                        className={`bg-gray-500 text-white px-3 py-2 rounded-md`}
                    >
                        Back
                    </button>
                    {status != "COMPLETED" ?
                        <button
                            onClick={handleSubmit}
                            className={`flex gap-2 items-center justify-center bg-primary text-white px-3 py-2 rounded-md ${!agreed || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!agreed || loading}
                        >
                            {loading && <Oval
                                visible={true}
                                height="14"
                                width="14"
                                color="#ffffff"
                                secondaryColor="#ffffff"
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass="flex items-center justify-center"
                            />}
                            <p>{loading ? "Submitting..." : "Submit"}</p>
                        </button>
                        :
                        <button
                        onClick={onNext}
                        className={`bg-primary text-white px-3 py-2 rounded-md`}
                        disabled={false}
                      >
                        {loading && <Oval
                          visible={true}
                          height="14"
                          width="14"
                          color="#ffffff"
                          secondaryColor="#ffffff"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass="flex items-center justify-center"
                        />}
                        <p>{loading ? "Saving..." : "Next"}</p>
                      </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default DocumentSignature;
