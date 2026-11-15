"use client"
import React from 'react'
import Image from 'next/image'
import { useOpenSearchDoctorsContext, useThemeContext } from '../assets/contexts'
import { ProfileType } from '../assets/assets'
import subimg from "../../../public/images/doc-removebg-preview.png"
import Link from 'next/link';

export default function SearchResult({ profile }: { profile: ProfileType }) {
    const { mode } = useThemeContext()
    
    // تحديد الرابط بناءً على نوع المستخدم (طبيب أسنان أو زائر)
    const profileLink = profile?.doctorType === "dentist" 
        ? `/doctors/${profile?.id}` 
        : `/visitors/${profile?.id}`;

    return (
        <Link 
            
            href={profileLink}
            className={`w-full mb-3 border-2 border-blue-500/50 ${
                mode === "light" 
                    ? "bg-white/75 text-slate-900 shadow-sm" 
                    : "bg-slate-900/75 text-white shadow-xl"
            } backdrop-blur-xl p-3 rounded-3xl flex items-center gap-2.5 transition hover:border-blue-600 `}
        >
            <Image
                src={profile?.doctorImage ? profile?.doctorImage : subimg}
                alt='img'
                width={200}
                height={200} 
                loading='lazy'
                className='w-20 h-20 rounded-full  object-top-left '
            />
            <div className="overflow-hidden">
                <h3 className='text-xl mb-1 truncate'>{profile?.doctorName}</h3>
                <p className='text-sm opacity-80 truncate'>{profile?.doctorTitle}</p>
            </div>
        </Link>
    )
}
