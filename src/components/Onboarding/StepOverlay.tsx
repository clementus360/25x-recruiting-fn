import React from 'react';
import SignatureForm from './SignatureForm';
import PersonalInformationProcess from './PersonalInformationStep';
import DirectDepositProcess from './DirectDepositStep';
import AdditionalDocumentsProcess from './AdditionalDocumentStep';
import TestsAndCertificationsProcess from './TestsAndCertificationsStep';
import { FaCog } from 'react-icons/fa';
import TaxWithholdingProcess from './TaxWithholdingStep';

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
        } if (step === 'Test/Certifications') {
            return <TestsAndCertificationsProcess onClose={onClose} />
        } if (step === 'Tax Withholding') {
            return <TaxWithholdingProcess onClose={onClose} />
        } else {
            return <div className='flex flex-col gap-4 items-center justify-center w-full h-full text-lg'>
                <FaCog className='an motion-safe:animate-spin' color='#1579BE' size={100} />
                <p className='text-xl'>Incoming Feature</p>
            </div>;
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the event from bubbling up to the outside click handler
        onClose();
    };

    return (
        <div onMouseDown={handleClickOutside} className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div onMouseDown={(e) => e.stopPropagation()} className="flex flex-col gap-8 bg-white p-6 rounded-md shadow-md min-w-[50vw] max-w-3xl h-[90vh] overflow-y-scroll">
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
