import React from 'react';
import SignatureForm from './SignatureForm';
import PersonalInformationProcess from './PersonalInformationStep';
import DirectDepositForm from './DirectDepositStep';

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
            return <SignatureForm onClose={onClose}/>;
        } if (step === 'Personal Information') {
            return <PersonalInformationProcess onClose={onClose}/>;
        } if (step ==='Direct Deposit') {
            return <DirectDepositForm onClose={onClose} />
        } else {
            return <div>Unsupported Step Type</div>;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md min-w-[50vw] max-w-3xl h-[90vh] overflow-y-scroll">
                <h4 className="mb-4 text-lg font-semibold">Step: {step}</h4>
                {renderForm()}
            </div>
        </div>
    );
};

export default OverlayModal;
