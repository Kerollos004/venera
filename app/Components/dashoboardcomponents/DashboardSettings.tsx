"use client"
import React from 'react'
import { ProfileType } from '../assets/assets'
import { useOpenCheckoutContext, useThemeContext, useUpdateProfileContext } from '../assets/contexts'
import Image from 'next/image'
import subImg from "../../../public/images/doc-removebg-preview.png"
import { PenFill, BoxArrowLeft } from 'react-bootstrap-icons'
import { useRouter } from 'next/navigation'
import { supabase } from '../assets/supabase-client'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

export default function DashboardSettings({ profile }: { profile: ProfileType }) {
    const { mode } = useThemeContext()
    const {setOpenUpdateProfile} = useUpdateProfileContext()
    const router = useRouter()
    const { setOpenCheckout } = useOpenCheckoutContext()
    const { t } = useTranslation()
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Error logging out:', error.message)
        router.push("/")
    }
return (
    <article className={` flex flex-col justify-center items-center p-6 rounded-3xl ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} `} >
        <div className="flex flex-col justify-center mb-4 items-center">
            <Image
                src={profile?.doctorImage ? profile?.doctorImage : subImg}
                alt='img'
                width={200}
                height={200}
                className='w-30 h-30 rounded-full mb-3 '
            />
            <h3 className='text-2xl text-blue-600'> {profile?.doctorName} </h3>
            <button onClick={() => {
                setOpenUpdateProfile(true)
            }} className='p-3 flex justify-center items-center  gap-1 hover:bg-blue-800 bg-blue-600 rounded-3xl'> {t("dashboard.settings.update")} <PenFill/>  </button>
        </div>
        <div className="flex w-full mb-4 justify-between items-center">
            <h3> {t("dashboard.settings.current")}: {profile?.currentPlan} </h3>
            <button onClick={()=>{setOpenCheckout(true)}} className='p-3  hover:bg-blue-800 bg-blue-600 rounded-3xl'>{t("dashboard.settings.upgrade")} </button>
        </div>
        {/* <Link href={"/adminpage"} className={`  ${profile?.is_admin ? "block" :"hidden"} text-center mb-3 p-3 rounded-3xl bg-blue-600 w-full `} > admin page </Link> */}
        <button onClick={async (e:React.MouseEvent) => {
            e.preventDefault()
            await handleLogout()
        }} className='p-3 flex w-full justify-center items-center  gap-1 hover:bg-red-800 bg-blue-600 rounded-3xl'>  < BoxArrowLeft/> {t("dashboard.settings.logout")} </button>
    </article>
)
}
