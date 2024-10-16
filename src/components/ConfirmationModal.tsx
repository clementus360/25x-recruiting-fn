import React from "react";

type ModalProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
};

const ConfirmationModal: React.FC<ModalProps> = ({ message, onConfirm, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
                <p>{message}</p>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    <button onClick={onConfirm} className="bg-primary text-white px-4 py-2 rounded">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
