/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React from 'react'
import { feedBack, ProfileType } from '../assets/assets'
import Image from 'next/image'
import { ArrowRepeat , BoxArrowLeft, PinFill } from 'react-bootstrap-icons'
import subImg from "../../../public/images/doc-removebg-preview.png"
import { useRouter } from 'next/navigation'
import { supabase } from '../assets/supabase-client'
import "../../reacti18"
import { useEffect , useState } from 'react'
import { useTranslation } from 'react-i18next'
import VisitorsFeedBacks from './VisitorsFeedBacks'
import UpadateVisitorProfile from './VisitorUpdateProfile'
export default function VisitorData({ visitor , feedBacks }: { visitor: ProfileType , feedBacks:feedBack[] }) {
    const { t, i18n } = useTranslation()
const [user, setUser] = useState<ProfileType | null>(null)
    const router = useRouter()
    

const getUser = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData?.user) {
        console.log("error in getting auth user", authError?.message)
        setUser(null)
        return
    }

    const userId = authData.user.id
    if (userId) {
        const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle()
        
        if (profileError) {
        console.log("error in getting profile data", profileError.message)
        return
        }
        if (profileData) {
            setUser(profileData) 
    }
    }


}

useEffect(() => {
    getUser()
}, [])
        const handleLogout = async () => {
            const { error } = await supabase.auth.signOut()
            if (error) console.error('Error logging out:', error.message)
            router.push("/")
        }
        const handleChangeLanguage = () => {
            const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
            i18n.changeLanguage(nextLang);  
            }
            useEffect(() => {
                const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.dir = dir;
                document.documentElement.lang = i18n.language;
            }, [i18n.language]);
    return (
        <>
            <article className='grid grid-cols-1 md:grid-cols-2 mb-4 justify-between items-center'>
                <article className="mb-3  flex-col md:flex-row flex gap-2 items-center">
                <Image
                    src={visitor?.doctorImage ? visitor?.doctorImage : subImg}
                    alt='img'
                    width={130}
                    height={130}
                    className='rounded-full w-32 h-32 border-2 border-blue-500 object-cover'
                    loading='lazy'
                />
                <h3 className='text-4xl text-blue-500 mb-1 font-bold'>{visitor?.doctorName}</h3>
                </article>
                <article className={`${user?.id === visitor?.id  ?"grid":"hidden"} grid-cols-1 md:grid-cols-2  gap-2 items-center`}>
                        <button
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault()
                                handleChangeLanguage()
                            }}
                            className='p-3 flex  w-full mb-3 justify-center items-center  gap-1 hover:bg-blue-800 bg-blue-600 rounded-3xl'
                        >
                            <ArrowRepeat/>
                            {t("dashboard.settings.change")}
                        </button>
                        
                    <button onClick={async (e:React.MouseEvent) => {
                            e.preventDefault()
                            await handleLogout()
                    }}
                        className='p-3 flex w-full justify-center items-center  gap-1 hover:bg-red-800 bg-blue-600 rounded-3xl'>
                        < BoxArrowLeft /> {t("dashboard.settings.logout")}
                    </button>

                    <button onClick={async (e:React.MouseEvent) => {
                            e.preventDefault()
                            await handleLogout()
                    }}
                        className='p-3 flex w-full justify-center items-center  gap-1 hover:bg-red-800 bg-blue-600 rounded-3xl'>
                        < PinFill /> {t("dashboard.settings.update")}
                    </button>
                </article>
            </article>
            <VisitorsFeedBacks feedBacks={feedBacks} profile={visitor} />
            <UpadateVisitorProfile profile={visitor}/>
        </>
    )
}
