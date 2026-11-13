"use client"
import React from 'react'
import Image from 'next/image'
import { useThemeContext } from '../assets/contexts'
import { ProfileType } from '../assets/assets'
import subimg from "../../../public/images/doc-removebg-preview.png"
import Link from 'next/link';
export default function SearchResult({profile}:{profile:ProfileType}) {
    const {mode} = useThemeContext()
    return (
        <div className={`w-full mb-3 border-2 border-blue-500/50 ${mode === "light" ? "bg-white/75 text-slate-900 shadow-sm" : "bg-slate-900/75 text-white shadow-xl"} backdrop-blur-xl p-3 rounded-3xl flex items-center gap-2.5`}>            <Link href={`${profile?.doctorType === "dentist" ? `/doctors/${profile?.id}` : `/visitors/${profile?.id}`}`}>
            <Image
                src={profile?.doctorImage ? profile?.doctorImage : subimg}
                alt='img'
                width={200}
                height={200} 
                loading='lazy'
                className='w-15 h-15 rounded-full '
            />
            </Link>
            <div className="">
                <h3 className='text-xl mb-1' > {profile?.doctorName} </h3>
                <p> {profile?.doctorTitle} </p>
            </div>
        </div>
    )
}
