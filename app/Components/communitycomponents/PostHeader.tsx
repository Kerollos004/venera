import React from 'react'
import subImg from "../../../public/images/doc-removebg-preview.png"
import Image from 'next/image'
import Link from 'next/link'
import { ProfileType } from '../assets/assets'
export default function PostHeader({profile}:{profile:ProfileType}) {
    return (
            <div className="flex items-center gap-1.5  my-4">
                <Link href={`/doctors/${profile.id}`}>
                    <Image
                        src={profile?.doctorImage?profile?.doctorImage:subImg}
                        alt='img'
                        width={80}
                        height={80}
                        className=' w-16 h-16 rounded-full '
                        loading='lazy'
                    />
                </Link>
                    <div >
                        <h3 className='text-2xl  text-blue-500 font-bold '> {profile?.doctorName} </h3>
                        <p> {profile?.doctorTitle} </p>
                    </div>
            </div>
    )
}
