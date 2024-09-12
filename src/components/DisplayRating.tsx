import Image from "next/image";

import StarIcon from "@/assets/star.svg"
import Star from "./Star";
import { editRating } from "@/data/jobsData";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { useState } from "react";

export default function DisplayRating({ applicantId, rating, handleLoadRatings }: { applicantId: number, rating: number, handleLoadRatings: (load: boolean) => void }) {

    const [localRating, setLocalRating] = useState<number>(rating)

    const { error, setError } = useError();
    const { setSuccess } = useSuccess();

    let stars = []

    const HandleSetRating = async (NewRating: number) => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setError("User is not authenticated");
                return;
            }

            await editRating(applicantId, token, NewRating)

            setLocalRating(NewRating)

            setSuccess("Applicant Rating Changed Successfully")
            handleLoadRatings(true)
        } catch (error: any) {
            setError(`Error changing rating: ${error.message}`);
        }
    }

    const displayStars = () => {

        const remaining = 5-localRating

        for (let i = 0; i < localRating; i++) {
            stars.push(
                <button onClick={() => HandleSetRating(i+1)}>
                    <Star selected={true} />
                </button>
            )
        }

        if (remaining > 0) {
            for (let i = 0; i < remaining; i++) {
                stars.push(
                    <button onClick={() => HandleSetRating(localRating+i+1)}>
                        <Star selected={false} />
                    </button>
                )
            }
        }

        return stars
    }
    return (
        <div className="flex">
            {displayStars()}
        </div>
    )
}