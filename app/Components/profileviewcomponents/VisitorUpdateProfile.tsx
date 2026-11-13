"use client"
import React, { useState } from 'react'
import { useThemeContext, UseUpdateVisitorProfileContext } from '../assets/contexts'
import { ProfileType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { BoxArrowLeft } from 'react-bootstrap-icons'
import subImg from "../../../public/images/doc-removebg-preview.png"
import Image from 'next/image'
import "../../reacti18"
import { useTranslation } from 'react-i18next'

export default function UpadateVisitorProfile({ profile }: { profile: ProfileType }) {
    const { mode } = useThemeContext() 
    const [name, setName] = useState<string>(profile?.doctorName ? profile?.doctorName : "")
    const {openVisitorProfile , setOpenVisitorProfile} = UseUpdateVisitorProfileContext()

    const [image, setImage] = useState<string>(profile?.doctorImage ? profile?.doctorImage : "")
    const { t } = useTranslation()

    // دالة رفع الصورة للـ Supabase Storage وتوليد الرابط العام
    const uploadImageToStorage = async (file: File) => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `profiles/${profile?.id}_${Date.now()}.${fileExt}`
            
            const { error: uploadError } = await supabase.storage
                .from('images') 
                .upload(fileName, file, { upsert: true })

            if (uploadError) {
                console.error("Error uploading image:", uploadError.message)
                return null
            }

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(fileName)

            return data.publicUrl
        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault()
        
        // التحقق من الـ Session قبل التحديث لضمان عدم حدوث خطأ على Vercel
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession()
        if (sessionErr || !session) {
            console.log("No active session found on Vercel:", sessionErr?.message)
            return;
        }

        const { error } = await supabase.from("users").update({
            doctorName: name, 
            doctorImage: image
        }).eq("id", profile?.id)

        if (error) {
            console.log("error in updating user", error.message)
            return
        }
        
        setOpenVisitorProfile(false)
        window.location.reload()
    }

    return (
        <section className={`w-full fixed top-0 left-0 z-50 p-10 h-screen ${openVisitorProfile ? "flex" : "hidden"} justify-center items-center bg-white/10 backdrop-blur-md`}>
            <form onSubmit={handleUpdateProfile} className={`w-11/12 md:w-[800px] p-6 rounded-3xl ${mode === "light" ? "bg-gray-300 text-black" : "text-white bg-[#1e293b]"}`}>
                
                {/* Image Upload */}
                <div className="flex flex-col justify-center items-center gap-1">
                    <Image
                        src={image ? image : subImg}
                        alt='img'
                        width={200}
                        height={200}
                        className='w-36 h-36 rounded-full mb-3 border-2 border-blue-600 object-cover'
                    />
                    <div className='w-full'>
                        <input 
                            className={`w-full mb-2.5 p-2 rounded-2xl border border-white focus:border-blue-600 mt-1 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} 
                            type="file"  
                            accept="image/*"
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const publicUrl = await uploadImageToStorage(file);
                                    if (publicUrl) {
                                        setImage(publicUrl);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="name"> {t("updateProfile.name")} </label>
                    <input 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        className='w-full mb-2.5 p-2 rounded-2xl border border-white focus:border-blue-600 mt-1 outline-none' 
                        type="text" 
                        value={name} 
                    />
                </div>


                <button 
                    type="submit"
                    className={`w-full p-3 cursor-pointer rounded-3xl bg-blue-600 hover:bg-blue-800 text-white font-semibold transition`}
                > 
                    {t("dashboard.settings.update")}
                </button>
            </form>

            <BoxArrowLeft
                className='absolute top-5 left-5 text-3xl hover:text-red-600 cursor-pointer'
                onClick={() => setOpenVisitorProfile(false)} 
            />
        </section>
    )
}