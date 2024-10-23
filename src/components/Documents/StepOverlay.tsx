import React from 'react';
import { FaCog } from 'react-icons/fa';
import QualificationDocumentForm from './QualificationDocumentForm';

interface OverlayModalProps {
    step: string;
    onClose: () => void;
}

const OverlayModal: React.FC<OverlayModalProps> = ({
    step,
    onClose,
}) => {

    const renderForm = () => {
        if (step === "Driver's Licence") {
            return <QualificationDocumentForm type="DRIVER_LICENSE" title="Driver's Licence" onClose={onClose} />;
        } if (step === 'Certifications/Licenses') {
            return <QualificationDocumentForm type="CERTIFICATIONS_AND_LICENCES" title="Certifications/Licenses" onClose={onClose} />;
        } if (step === 'CPR Card') {
            return <QualificationDocumentForm type="CPR_CARD" title="CPR Card" onClose={onClose} />
        } if (step === 'Auto Insurance Card') {
            return <QualificationDocumentForm type="AUTO_INSURANCE_CARD" title="Auto Insurance Card" onClose={onClose} />
        } if (step === 'Vehicle Registration (MVR)') {
            return <QualificationDocumentForm type="VEHICLE_REGISTRATION" title="Vehicle Registration (MVR)" onClose={onClose} />
        } if (step === 'Social Security Card') {
            return <QualificationDocumentForm type="SOCIAL_SECURITY_CARD" title="Social Security Card" onClose={onClose} />
        } if (step === 'Physical Form Signed By Doctor') {
            return <QualificationDocumentForm type="PHYSICAL_FORM" title="Physical Form" onClose={onClose} />
        } if (step === 'TB Test Signed By Doctor') {
            return <QualificationDocumentForm type="TB_TEST_FORM" title="TB Test" onClose={onClose} />
        } if (step === 'Copy Of Void Check') {
            return <QualificationDocumentForm type="COPY_OF_VOID_CHECK" title="Copy Of Void Check" onClose={onClose} />
        }else {
            return <div className='flex flex-col gap-4 items-center justify-center w-full h-full text-lg'>
                <FaCog className='an motion-safe:animate-spin' color='#1579BE' size={100}/>
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
            <div onMouseDown={(e) => e.stopPropagation()} className="flex flex-col gap-8 bg-white p-6 rounded-md shadow-md min-w-[50vw] max-w-3xl overflow-y-scroll">
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
