import Select from '@/components/Select';
import { TBMedicalQuestionnaire } from '@/types/onboardingTypes';
import React, { useState, useEffect } from 'react';
import { Oval } from 'react-loader-spinner';

interface MedicalQuestionnaireFormProps {
    tbMedicalQuestionnaire: TBMedicalQuestionnaire;
    status: string;
    onSave: (formData: TBMedicalQuestionnaire) => void;
    onEdit: (formData: TBMedicalQuestionnaire) => void;
    onNext: () => void;
    onClose: () => void;
    loading: boolean;
}

const TBMedicalQuestionnaireForm: React.FC<MedicalQuestionnaireFormProps> = ({ tbMedicalQuestionnaire, status, onSave, onEdit, onNext, onClose, loading }) => {
    const [formData, setFormData] = useState<TBMedicalQuestionnaire>(tbMedicalQuestionnaire);
    const [initialData, setInitialData] = useState<TBMedicalQuestionnaire>(tbMedicalQuestionnaire);
    const [errors, setErrors] = useState({
        everHadTbSkin: "",
        doYouCoughBlood: "",
        doYouHaveChronicCough: "",
        doYouHaveProlongedOrRecurrentFever: "",
        doYouHaveSweatingAtNight: "",
        haveYouEverHadBcgVaccine: "",
        haveYouRecentlyLostWeight: "",
        doYouHaveRiskFactors: "",
        describe: ""
    });
    const [touched, setTouched] = useState({
        everHadTbSkin: false,
        doYouCoughBlood: false,
        doYouHaveChronicCough: false,
        doYouHaveProlongedOrRecurrentFever: false,
        doYouHaveSweatingAtNight: false,
        haveYouEverHadBcgVaccine: false,
        haveYouRecentlyLostWeight: false,
        doYouHaveRiskFactors: false,
        describe: false
    });

    const yesNoOptions = [
        { value: 'YES', label: 'Yes' },
        { value: 'NO', label: 'No' }
    ];

    useEffect(() => {
        validate();
    }, [formData]);

    useEffect(() => {
        if (status === "COMPLETED") {
            onNext()
        }
    }, [status])

    useEffect(() => {
        setFormData(tbMedicalQuestionnaire);
        setInitialData(tbMedicalQuestionnaire);
    }, [tbMedicalQuestionnaire]);

    const handleChange = (field: keyof TBMedicalQuestionnaire, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'everHadTbSkin' && value === 'NO' ? resetOtherFields() : {})
        }));
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const resetOtherFields = () => ({
        doYouCoughBlood: 'NO',
        doYouHaveChronicCough: 'NO',
        doYouHaveProlongedOrRecurrentFever: 'NO',
        doYouHaveSweatingAtNight: 'NO',
        haveYouEverHadBcgVaccine: 'NO',
        haveYouRecentlyLostWeight: 'NO',
        doYouHaveRiskFactors: 'NO',
        describe: ''
    });

    const validate = () => {
        const newErrors: any = {};

        if (!formData.everHadTbSkin) newErrors.everHadTbSkin = 'This field is required';
        if (formData.everHadTbSkin === 'YES') {
            if (!formData.doYouCoughBlood) newErrors.doYouCoughBlood = 'This field is required';
            if (!formData.doYouHaveChronicCough) newErrors.doYouHaveChronicCough = 'This field is required';
            if (!formData.doYouHaveProlongedOrRecurrentFever) newErrors.doYouHaveProlongedOrRecurrentFever = 'This field is required';
            if (!formData.doYouHaveSweatingAtNight) newErrors.doYouHaveSweatingAtNight = 'This field is required';
            if (!formData.haveYouEverHadBcgVaccine) newErrors.haveYouEverHadBcgVaccine = 'This field is required';
            if (!formData.haveYouRecentlyLostWeight) newErrors.haveYouRecentlyLostWeight = 'This field is required';
            if (!formData.doYouHaveRiskFactors) newErrors.doYouHaveRiskFactors = 'This field is required';

            if (formData.doYouHaveRiskFactors === 'YES' && !formData.describe) {
                newErrors.describe = 'Please describe your risk factors';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validate()) {
            const isEmptyForm = Object.keys(initialData).every(key => !initialData[key as keyof TBMedicalQuestionnaire]);

            console.log(isEmptyForm)

            if (isEmptyForm) {
                onSave(formData);
            } else {
                const isSameAsInitial = Object.keys(formData).every(key => formData[key as keyof TBMedicalQuestionnaire] === initialData[key as keyof TBMedicalQuestionnaire]);
                if (isSameAsInitial) {
                    onNext();
                } else {
                    onEdit(formData);
                }
            }
        }
    };


    const showError = (field: keyof typeof touched) => touched[field] && errors[field];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-6xl">
            <div className="flex flex-col">
                <label htmlFor="everHadTbSkin">
                    <p className='text-sm font-semibold text-gray-600'>Have you ever had a positive TB skin test or a history of TB infection?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.everHadTbSkin}
                    onChange={(value) => handleChange('everHadTbSkin', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.everHadTbSkin ? 'border-red-500' : ''}`}
                />
                {showError('everHadTbSkin') && <span className="text-red-500 text-sm">{errors.everHadTbSkin}</span>}
            </div>

            <p className='text-sm'>If the answer is YES, please answer the following questions:</p>

            <div className="flex flex-col">
                <label htmlFor="doYouCoughBlood">
                    <p className='text-sm font-semibold text-gray-600'>Do you cough up blood?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.doYouCoughBlood}
                    onChange={(value) => handleChange('doYouCoughBlood', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.doYouCoughBlood ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('doYouCoughBlood') && <span className="text-red-500 text-sm">{errors.doYouCoughBlood}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="doYouHaveChronicCough">
                    <p className='text-sm font-semibold text-gray-600'>Do you have a chronic cough?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.doYouHaveChronicCough}
                    onChange={(value) => handleChange('doYouHaveChronicCough', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.doYouHaveChronicCough ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('doYouHaveChronicCough') && <span className="text-red-500 text-sm">{errors.doYouHaveChronicCough}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="doYouHaveProlongedOrRecurrentFever">
                    <p className='text-sm font-semibold text-gray-600'>Do you have prolonged or recurrent fever?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.doYouHaveProlongedOrRecurrentFever}
                    onChange={(value) => handleChange('doYouHaveProlongedOrRecurrentFever', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.doYouHaveProlongedOrRecurrentFever ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('doYouHaveProlongedOrRecurrentFever') && <span className="text-red-500 text-sm">{errors.doYouHaveProlongedOrRecurrentFever}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="doYouHaveSweatingAtNight">
                    <p className='text-sm font-semibold text-gray-600'>Do you have sweating at night?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.doYouHaveSweatingAtNight}
                    onChange={(value) => handleChange('doYouHaveSweatingAtNight', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.doYouHaveSweatingAtNight ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('doYouHaveSweatingAtNight') && <span className="text-red-500 text-sm">{errors.doYouHaveSweatingAtNight}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="haveYouEverHadBcgVaccine">
                    <p className='text-sm font-semibold text-gray-600'>Have you ever had a BCG vaccine?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.haveYouEverHadBcgVaccine}
                    onChange={(value) => handleChange('haveYouEverHadBcgVaccine', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.haveYouEverHadBcgVaccine ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('haveYouEverHadBcgVaccine') && <span className="text-red-500 text-sm">{errors.haveYouEverHadBcgVaccine}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="haveYouRecentlyLostWeight">
                    <p className='text-sm font-semibold text-gray-600'>Have you recently lost weight?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.haveYouRecentlyLostWeight}
                    onChange={(value) => handleChange('haveYouRecentlyLostWeight', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.haveYouRecentlyLostWeight ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('haveYouRecentlyLostWeight') && <span className="text-red-500 text-sm">{errors.haveYouRecentlyLostWeight}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="haveYouRecentlyLostWeight">
                    <p className='text-sm font-semibold text-gray-600'>Have you recently lost weight?</p>
                </label>
                <Select
                    options={yesNoOptions}
                    value={formData?.doYouHaveRiskFactors}
                    onChange={(value) => handleChange('doYouHaveRiskFactors', value)}
                    placeholder="Yes or No"
                    className={`border p-2 rounded-md ${errors.doYouHaveRiskFactors ? 'border-red-500' : ''}`}
                    isDisabled={formData?.everHadTbSkin === 'NO'}
                />
                {showError('doYouHaveRiskFactors') && <span className="text-red-500 text-sm">{errors.doYouHaveRiskFactors}</span>}
            </div>

            <div className="flex flex-col">
                <label htmlFor="describe">
                    <p className='text-sm font-semibold text-gray-600'>Describe your risk factors (if applicable)</p>
                </label>
                <textarea
                    name="describe"
                    placeholder="Describe your risk factors"
                    value={formData?.describe}
                    onChange={(e) => handleChange('describe', e.target.value)}
                    className={`border p-2 rounded-md ${errors.describe ? 'border-red-500' : ''}`}
                />
                {showError('describe') && <span className="text-red-500 text-sm">{errors.describe}</span>}
            </div>

            <div className='flex w-full justify-between'>
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`flex gap-2 items-center justify-center bg-primary text-white px-4 py-2 rounded-md mt-2 ${Object.keys(errors).length || loading ? 'opacity-50' : ''}`}
                    disabled={Object.keys(errors).length > 0}
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
            </div>
        </form>

    );
};

export default TBMedicalQuestionnaireForm;
