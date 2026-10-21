"use client"
import React, { useState } from 'react'
import { useThemeContext, useUpdateProfileContext } from '../assets/contexts'
import { ProfileType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { BoxArrowLeft } from 'react-bootstrap-icons'
import subImg from "../../../public/images/doc-removebg-preview.png"
import Image from 'next/image'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
export default function DashboardUpadateProfile({profile}:{profile:ProfileType}) {
    const { mode } = useThemeContext() 
    const { openUpdateProfile  , setOpenUpdateProfile} = useUpdateProfileContext()
    const [name, setName] = useState<string>(profile?.doctorName ? profile?.doctorName : "")
    const [title, setTitle] = useState<string>(profile?.doctorTitle ? profile?.doctorTitle : "")
    const [bio, setBio] = useState<string>(profile?.doctorBio ? profile?.doctorBio : "")
    const [image, setImage] = useState<string>(profile?.doctorImage ? profile?.doctorImage : "")
    const {t} = useTranslation()
    const handleUpdateProfile = async () => {
        const { error } = await supabase.from("users").update({
            doctorName: name, 
            doctorBio: bio,
            doctorTitle: title,
            doctorImage : image
        }).eq("id", profile?.id)
        if (error) {
            console.log("error in updating user" , error.message)
        }
        setOpenUpdateProfile(false)
    }
return (
    <section className={`w-full fixed top-0 left-0 z-50 p-10 h-screen  ${openUpdateProfile? "flex" : "hidden"} justify-center items-center bg-white/10 backdrop-blur-md`}>
        <form action="" className={`w-11/12 md:w-[800px] p-6 rounded-3xl ${mode === "light" ? "bg-gray-300 text-black" : "text-white bg-[#1e293b]"}  `}>
            {/* Image Upload */}
            <div className="flex flex-col justify-center items-center gap-1">
            <Image
                src={profile?.doctorImage ? profile?.doctorImage : subImg}
                alt='img'
                width={200}
                height={200}
                className='w-36 h-36 rounded-full mb-3 border-2 border-blue-600 '
                />
                <div className='w-full'>
                <label className='text-sm font-semibold'> {t("updateProfile.image")} </label>
                <input 
                    className={` w-full mb-2.5 p-2 rounded-2xl border border-gray-300 focus:border-blue-600 mt-1 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} 
                    type="file"  
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                setImage(reader.result as string )
                            };
                            reader.readAsDataURL(file); // السطر ده كان ناقص في كودك!
                        }
                    }}
                />
                </div>
            </div>
            <div className="flex flex-col">
                <label htmlFor="name"> {t("updateProfile.name")} </label>
                <input 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                        setName(e.target.value)
                    }}
                    className='w-full mb-2.5 p-2 rounded-2xl border border-gray-300 focus:border-blue-600 mt-1' type="text" value={name} />
            </div>
            <div className="flex flex-col">
                <label htmlFor="title"> {t("updateProfile.title")} </label>
                <input 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                        setTitle(e.target.value)
                    }}
                    className='w-full mb-2.5 p-2 rounded-2xl border border-gray-300 focus:border-blue-600 mt-1' type="text" value={title} />
            </div>
            <div className="flex flex-col">
                <label htmlFor="name"> {t("updateProfile.bio")} </label>
                <textarea 
                    onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
                        setBio(e.target.value)
                    }}
                    className='w-full mb-2.5 p-2 rounded-2xl border border-gray-300 focus:border-blue-600 mt-1' value={bio} />
            </div>
            <button onClick={(e:React.MouseEvent) => {
                e.preventDefault()
                handleUpdateProfile()
                window.location.reload()
            }} className='w-full p-3 cursor-pointer  rounded-3xl bg-blue-600 hover:bg-blue-800'> update profile </button>
        </form>
        <BoxArrowLeft
            className=' absolute top-5 left-5 text-3xl hover:text-red-600'
            onClick={() => {
            setOpenUpdateProfile(false)
        }} />
    </section>
)
}
