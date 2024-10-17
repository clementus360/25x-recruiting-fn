import React from 'react';
import SignatureForm from './SignatureForm';
import PersonalInformationProcess from './PersonalInformationStep';
import DirectDepositProcess from './DirectDepositStep';
import AdditionalDocumentsProcess from './AdditionalDocumentStep';

interface OverlayModalProps {
    step: string;
    onClose: () => void;
}

const OverlayModal: React.FC<OverlayModalProps> = ({
    step,
    onClose,
}) => {

    const renderForm = () => {
        if (step === 'E-Signature') {
            return <SignatureForm onClose={onClose} />;
        } if (step === 'Personal Information') {
            return <PersonalInformationProcess onClose={onClose} />;
        } if (step === 'Direct Deposit') {
            return <DirectDepositProcess onClose={onClose} />
        } if (step === 'Additional Documents') {
            return <AdditionalDocumentsProcess onClose={onClose} />
        } else {
            return <div>Unsupported Step Type</div>;
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the event from bubbling up to the outside click handler
        onClose();
    };

    return (
        <div onClick={handleClickOutside} className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-8 bg-white p-6 rounded-md shadow-md min-w-[50vw] max-w-3xl h-[90vh] overflow-y-scroll">
                <div className='flex flex-col items-center justify-center px-8 py-8 bg-lightBlue'>
                    <h4 className="text-2xl font-semibold">{step}</h4>
                    <p className='text-grey'>Add {step}</p>
                </div>
                {renderForm()}
            </div>
        </div>
    );
};

export default OverlayModal;
