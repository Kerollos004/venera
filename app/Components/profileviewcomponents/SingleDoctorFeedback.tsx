/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect } from 'react'
import { feedBack, ProfileType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import subImg from "../../../public/images/doc-removebg-preview.png"
import { useThemeContext } from '../assets/contexts'
import { StarFill } from 'react-bootstrap-icons'
export default function SingleDoctorFeedback({ feedback }: { feedback: feedBack }) {
    const [owner, setOwner] = useState<ProfileType | null>(null)
    const {mode} = useThemeContext()
    const getFeedbackOwner = async () => {
        const { data, error } = await supabase.from("users").select("*").eq("id", feedback?.feedback_owner).maybeSingle()
        if (!data || error) { 
            console.log("error in getting owner", error?.message)
            return
        }
        if (data) {
            setOwner(data)
        }
    }
    const getFeedbacks = async () => {
        const { data, error } = await supabase.from("feedbacks").select("*").eq("id", feedback?.id).maybeSingle()
        if (!data || error) { 
            console.log("error in getting owner", error?.message)
            return
        }
    }
    useEffect(() => {
        getFeedbackOwner()
    }, [])
    useEffect(() => {
        getFeedbacks()
    } , [])
    return (
        <div className={`p-3 flex  flex-col items-center justify-center gap-2.5 ${mode === "light" ? "bg-white text-black" : "bg-[#151d29] text-white"} rounded-3xl `}>
            <Link href={`/visitors/${owner?.id}`}>
                <Image
                src={owner?.doctorImage ? owner?.doctorImage : subImg}
                alt='img'
                width={200} 
                height={200}
                loading='lazy'
                className='w-25 h-25 rounded-full border-2 border-blue-600 mb-1'
            />
            </Link>
            <h3 className='text-3xl text-blue-600 mb-1' > {owner?.doctorName} </h3>
            <p className='text-2xl '>  {feedback.feedback}  </p>
            <div>
{
    feedback?.feedback_rate && Array.from({ length: feedback.feedback_rate }).map((_, i) => (
        <StarFill key={i} className='mx-1 text-yellow-400 inline-block' size={18} />
    ))
}
            </div>
        </div>
    )
}
