/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { feedBack, ProfileType } from '../assets/assets' 
import Image from 'next/image'
import { useThemeContext } from '../assets/contexts'
import sunImg from "../../../public/images/doc-removebg-preview.png"
import { CaretRightFill } from 'react-bootstrap-icons'
import Link from 'next/link'
import { supabase } from '../assets/supabase-client'

export default function VisitorFeedBack({ profile, feedBack }: { profile: ProfileType, feedBack: feedBack }) {
    const [doctorName , setDoctorName] = useState<string>("")
    const { mode } = useThemeContext()
    const getDoctorName = async () => {
        const { data, error } = await supabase.from("users").select("doctorName").eq("id", feedBack?.feedback_doctor).maybeSingle()
        if (!data || error) {
            console.log("error in getting name" , error?.message)
        }
        if (data) {
            setDoctorName(data.doctorName)
        }
    }
    useEffect(() => {
        getDoctorName()
    },[])
    return (
        <article className={`p-3  mb-3 rounded-3xl ${mode === "light" ? "bg-white text-black" : "bg-[#151d29] text-white"} `}>
            <div className="flex items-center gap-2.5">
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
                <CaretRightFill className='text-2xl mb-1' />
                <Link className=' mb-1 text-2xl hover:underline' href={`/doctors/${feedBack?.feedback_doctor}`}>{doctorName}</Link>
            </div>
            <h3 className='text-xl mb-2.5'>
                {feedBack?.feedback}
            </h3>
            <h3 className='text-xl mb-2.5'>  your rate : {feedBack?.feedback_rate }/5 </h3>
        </article>
    )
}
