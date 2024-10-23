import React, { useEffect, useState } from 'react';
import SignatureSection from '../ESignature/SignatureSection';
import { useError } from '@/context/ErrorContext';
import { TBMedicalQuestionnaire } from '@/types/onboardingTypes';
import { Oval } from 'react-loader-spinner';
import { getTBMedicalQuestionnaire } from '@/data/onboarding';
import { getAccessToken } from '@/data/cookies';

interface TBMedicalQuestionnaireReviewProps {
    pdfUrl: string,
    step: number,
    onClose: () => void;
    onNext: () => void;
    documentStatus: string;
    handleQuestionnaireSubmit: () => void;
    handleChangeStep: (step: number) => void;
    loading: boolean;
}

const TBMedicalQuestionnaireReview: React.FC<TBMedicalQuestionnaireReviewProps> = ({
    pdfUrl,
    step,
    onClose,
    onNext,
    documentStatus,
    handleQuestionnaireSubmit,
    handleChangeStep,
    loading,
}) => {
    const { setError } = useError();
    const [agreed, setAgreed] = useState<boolean>(false);
    const [tbMedicalQuestionnaire, setTBMedicalQuestionnaire] = useState<TBMedicalQuestionnaire>({
        everHadTbSkin: 'YES',
        doYouCoughBlood: '',
        doYouHaveChronicCough: '',
        doYouHaveProlongedOrRecurrentFever: '',
        doYouHaveSweatingAtNight: '',
        haveYouEverHadBcgVaccine: '',
        haveYouRecentlyLostWeight: '',
        doYouHaveRiskFactors: '',
        describe: ''
    });

    const getTBMedicalQuestionnaireInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const tbMedicalQuestionnaireInformation = await getTBMedicalQuestionnaire(token)


            setTBMedicalQuestionnaire(tbMedicalQuestionnaireInformation.tbTargetedMedicalFormInfo)

        } catch (err: any) {
            setError(err.message || "Failed to get references and employment information");
        }
    }

    useEffect(() => {
        getTBMedicalQuestionnaireInfo()
    }, [])

    const handleAgreed = (value: boolean) => setAgreed(value);

    return (
        <div className="flex flex-col gap-6 w-full">
            <h2 className="text-xl font-semibold mb-3">Step {step}: Review TB Medical Questionnaire</h2>

            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <div className="flex flex-col gap-12">
                    <div className="pdf-viewer h-96 overflow-y-auto border">
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {documentStatus !== "COMPLETED" && (
                <div className="border p-4 rounded-md bg-lightBlue">
                    <SignatureSection
                        isAgreed={agreed}
                        setIsAgreed={handleAgreed}
                    />
                </div>
            )}

            <div className="flex justify-between">
                <button onClick={onClose} className="bg-gray-500 text-white px-3 py-2 rounded-md">Cancel</button>
                <div className="flex gap-2">
                    <button onClick={() => handleChangeStep(3)} className="bg-gray-300 text-black px-3 py-2 rounded-md">Edit</button>
                    {documentStatus === "COMPLETED" ? (
                        <button onClick={onNext} className="bg-primary text-white px-3 py-2 rounded-md">Next</button>
                    ) : (
                        <button
                            onClick={handleQuestionnaireSubmit}
                            className={`flex gap-2 items-center justify-center bg-primary text-white px-3 py-2 rounded-md ${!agreed || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!agreed}
                        >
                            {loading && <Oval visible={true} height="14" width="14" color="#ffffff" secondaryColor="#ffffff" ariaLabel="oval-loading" />}
                            <p>{loading ? "Submitting..." : "Submit"}</p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TBMedicalQuestionnaireReview;
