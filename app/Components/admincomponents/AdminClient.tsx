import React from 'react'
import Image from 'next/image'
import subImg from "../../../public/images/Gemini_Generated_Image_d2y7e3d2y7e3d2y7.png"
import { ProfileType } from '../assets/assets'
export default function AdminClient({profile}:{profile:ProfileType}) {
    return (
        <article className=' p-2 rounded-2xl border-2 mb-2.5 flex justify-between flex-wrap  gap-2.5 items-center border-blue-600 '>
            <Image
                src={profile?.doctorImage ? profile?.doctorImage :subImg}
                alt='img'
                width={200}
                height={200}
                loading='lazy'
                className='w-16 h-16 rounded-full '
            />
            <h3>  {profile?.doctorName} </h3>
            <h3> {profile?.currentPlan} </h3>
            <h3> {profile?.current_offer} </h3>
            {/* <h3> expires at 10/9/2026</h3> */}
        </article>
    )
}
