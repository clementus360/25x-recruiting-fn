import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Quill styles
import { FiX } from 'react-icons/fi';
import { useHireLetter } from '@/context/HireLetterContext';
import { getAccessToken } from '@/data/cookies';
import { useSuccess } from '@/context/SuccessContext';
import { useError } from '@/context/ErrorContext';
import { sendHireLetter } from '@/data/onboarding';
import { Oval } from 'react-loader-spinner';
import { hireLetterTemplate } from '@/data/constants';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface EmailComposerProps {
    onSendEmail: (subject: string, body: string) => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ onSendEmail }) => {
    const { closeHireLetter, companyId, applicantId } = useHireLetter(); // Use context to close the overlay
    const [subject, setSubject] = useState<string>('Job Offer');
    const [body, setBody] = useState<string>(hireLetterTemplate);
    const [loading, setLoading] = useState<boolean>(false);
    const { setSuccess } = useSuccess();
    const { setError } = useError();

    const [subjectTouched, setSubjectTouched] = useState<boolean>(false);
    const [bodyTouched, setBodyTouched] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable scrolling
        return () => {
            document.body.style.overflow = ''; // Re-enable scrolling when unmounted
        };
    }, []);

    const handleSendHireLetter = async () => {
        setLoading(true);

        if (!subject.trim() || !body.trim()) {
            if (!subject.trim()) {
                setSubjectTouched(true);
            }
            if (!body.trim()) {
                setBodyTouched(true);
            }
            setError('Please fill out both the subject and body of the email.');
            setLoading(false);
            return;
        }

        try {
            const token = getAccessToken();

            if (!token) {
                setError('Unable to retrieve access token.');
                setLoading(false);
                return;
            }

            if (!companyId || !applicantId) {
                setError('Company ID or Applicant ID is missing.');
                setLoading(false);
                return;
            }

            await sendHireLetter(companyId, applicantId, body, subject, token);
            setSuccess("Hire letter sent successfully");
            closeHireLetter(); // Close the overlay after sending the email
        } catch (error: any) {
            console.error("Error sending hire letter:", error);
            setError(error.message || "Failed to send hire letter");
        } finally {
            setLoading(false);
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        closeHireLetter();
    };

    return (
        <div onMouseDown={handleClickOutside} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen">
            <div onMouseDown={(e) => e.stopPropagation()} className="relative bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-2xl max-h-[70vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={closeHireLetter}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <FiX size={24} />
                </button>

                {/* Title */}
                <h4 className="font-bold text-lg sm:text-xl mb-4">Compose Email</h4>

                {/* Subject Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email-subject">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="email-subject"
                        value={subject}
                        onChange={(e) => {
                            setSubject(e.target.value);
                            setSubjectTouched(true);
                        }}
                        className={`w-full p-2 border ${subjectTouched && !subject.trim() ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none`}
                        placeholder="Enter email subject"
                        required
                    />
                    {subjectTouched && !subject.trim() && (
                        <p className="text-red-500 text-xs mt-1">Subject is required.</p>
                    )}
                </div>

                {/* Email Body (Rich Text Editor) */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email-body">
                        Email Body
                    </label>
                    <ReactQuill
                        value={body}
                        onChange={(value) => {
                            setBody(value);
                            setBodyTouched(true);
                        }}
                        className={`text-gray-800 ${bodyTouched && !body.trim() ? 'border-red-500' : ''}`}
                        placeholder="Compose your email here..."
                        theme="snow"
                    />
                    {bodyTouched && !body.trim() && (
                        <p className="text-red-500 text-xs mt-1">Email body is required.</p>
                    )}
                </div>

                {/* Send Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSendHireLetter}
                        disabled={loading}
                        className="flex gap-2 items-center justify-center py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading && <Oval
                            visible={true}
                            height="14"
                            width="14"
                            color="#ffffff"
                            secondaryColor="#ffffff"
                            ariaLabel="oval-loading"
                        />}

                        {loading ? 'Sending...' : 'Send Hire Letter'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailComposer;
