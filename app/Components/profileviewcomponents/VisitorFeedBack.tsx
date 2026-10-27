import React from 'react'
import { feedBack, ProfileType } from '../assets/assets' 
import Image from 'next/image'
import { useThemeContext } from '../assets/contexts'
import sunImg from "../../../public/images/doc-removebg-preview.png"

export default function VisitorFeedBack({ profile }: { profile: ProfileType }) {
    const {mode} = useThemeContext()
    return (
        <article className={`p-3 rounded-2xl ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b]/80 text-white"} `}>
            <div className="flex mb-2.5 gap-2.5 items-center">
                <Image
                    src={profile?.doctorImage?profile?.doctorImage:sunImg}
                    alt='img'
                    width={200}
                    height={200}
                    loading='lazy'
                    className='w-16 h-16 rounded-full border-2 border-blue-600'
                />
                <h3 className='text-2xl text-blue-600'> {profile?.doctorName} </h3>
            </div>
            <p className='text-[18px] mb-2.5'>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci iusto quae similique natus. Iste, ea.
            </p>
            your rate : 3/5
        </article>
    )
}
