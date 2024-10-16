'use client';

import Image from "next/image";
import { useState } from "react";
import EmailIcon from "@/assets/email.svg";
import { User } from "@/types/profileTypes";

const UserInfoCard: React.FC<{ user: User }> = ({ user }) => {
    const [role, setRole] = useState(user.roleName);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value);
    };

    return (
        <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between w-full border-b-2 border-b-grey pb-6">
            {/* Name column */}
            <div className="min-w-[150px] flex-1">
                <h2 className="font-bold">
                    {user.firstName} {user.lastName}
                </h2>
            </div>

            {/* Role dropdown column */}
            <div className="min-w-[150px] flex-1">
                <p className="bg-transparent text-grey font-light px-4 w-full">{role}</p>
            </div>

            {/* Email column */}
            <div className="min-w-[200px] flex-1 flex items-center gap-2">
                <Image src={EmailIcon} alt={"email"} className="w-3 h-3" />
                <p className="text-grey">{user.email}</p>
            </div>

            {/* Action buttons column */}
            <div className="min-w-[200px] flex-1 flex gap-2 justify-end">
                {/* Uncomment if Edit Permissions button is needed */}
                {/* <button className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                    Edit Permissions
                </button> */}
                <button className="flex gap-2 items-center bg-red-400 self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                    Deactivate User
                </button>
            </div>
        </div>
    );
};

export default UserInfoCard;
