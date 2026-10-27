
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react'
import { useThemeContext } from '../assets/contexts'
import Image from 'next/image'
import { ProfileType } from '../assets/assets'
import Certificate from './Certificate'
import Achievments from './Achievment'
import ProfilePost from './ProfilePost'
import { Whatsapp, Envelope } from 'react-bootstrap-icons'
import Link from 'next/link'
import subImg from "../../../public/images/doc-removebg-preview.png"
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { supabase } from '../assets/supabase-client'
import { useRouter } from 'next/navigation'

export default function Profile({ profile }: { profile: ProfileType }) {
    const { mode } = useThemeContext()
    const { t } = useTranslation()
    const router = useRouter()

    const [activeAlert, setActiveAlert] = useState<boolean>(false)
    const [isOwner, setIsOwner] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [profileOwnerId, setProfileOwnerId] = useState<string | null>(null)




const checkAuth = async () => {
        setLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session || !session.user) {
            console.log("No active session found", error?.message)
            setIsAuthenticated(false)
            setLoading(false)
            setActiveAlert(true)
            router.push("/")
        } else {
            setIsAuthenticated(true)
            setLoading(false)
            setActiveAlert(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

const checkOwner = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
        setProfileOwnerId(session.user.id) 
    } else {
        setProfileOwnerId(null)
    }
    }
    useEffect(() => {
        if (profile?.id !== profileOwnerId) {
            setIsOwner(false)
        }
        else {
            setIsOwner(true)
        }
    }, [profile?.id, profileOwnerId])
    
    console.log(profile.id)
    console.log(profileOwnerId)
    console.log(isOwner)

    useEffect(() => {
        checkOwner()
    } , [])




    if (loading) {
        return (
            <main className={`w-full min-h-screen md:pt-20 py-10 px-3.5 md:px-10 ${mode === "light" ? "bg-gray-100" : "bg-[#0f172a]"}`}>
                {/* Header Skeleton */}
                <section className='flex flex-col md:flex-row items-center gap-4 justify-between mb-8 animate-pulse'>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <div className='w-24 h-24 rounded-full bg-gray-500/30 border-2 border-blue-500/40 shrink-0' />
                        <div className='flex flex-col items-center md:items-start gap-2'>
                            <div className='h-8 bg-gray-500/30 rounded-xl w-48' />
                            <div className='h-4 bg-gray-500/20 rounded-lg w-32' />
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-full bg-gray-500/30' />
                        <div className='w-12 h-12 rounded-full bg-gray-500/30' />
                    </div>
                </section>

                {/* Grid Sections Skeleton */}
                <section className='grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-6 animate-pulse'>
                    <div className={`col-span-1 md:col-span-4 p-5 rounded-2xl ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} border-b-8 border-blue-600/40`}>
                        <div className='h-7 bg-gray-500/30 rounded-lg w-32 mb-4' />
                        <div className='h-4 bg-gray-500/20 rounded-lg w-full mb-2' />
                        <div className='h-4 bg-gray-500/20 rounded-lg w-3/4' />
                    </div>

                    <div className={`col-span-1 md:col-span-4 p-5 rounded-2xl ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} border-b-8 border-blue-600/40`}>
                        <div className='h-7 bg-gray-500/30 rounded-lg w-40 mb-4' />
                        <div className='h-16 bg-gray-500/20 rounded-xl w-full' />
                    </div>

                    <div className={`col-span-1 md:col-span-4 p-5 rounded-2xl ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} border-b-8 border-blue-600/40`}>
                        <div className='h-7 bg-gray-500/30 rounded-lg w-44 mb-4' />
                        <div className='h-16 bg-gray-500/20 rounded-xl w-full' />
                    </div>
                </section>

                <section className={`p-5 rounded-2xl ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} border-b-8 border-blue-600/40 animate-pulse`}>
                    <div className='h-7 bg-gray-500/30 rounded-lg w-36 mb-6' />
                    <div className='h-32 bg-gray-500/20 rounded-2xl w-full' />
                </section>
            </main>
        )
    }

    // 2. حظر العرض لو مفيش سجل دخول أو مفيش بروفايل
    if (!isAuthenticated || !profile) {
        return (
            <main className={`w-full min-h-screen flex flex-col items-center justify-center px-3.5 md:pt-20 py-10 ${mode === "light" ? "bg-gray-100 text-black" : "bg-[#0f172a] text-white"}`}>
                <div className={`p-8 rounded-3xl text-center max-w-md shadow-xl ${mode === "light" ? "bg-white" : "bg-[#1e293b]"}`}>
                    <h3 className='text-2xl font-bold text-red-500 mb-3'>
                        {t("profile.alert") || "Please login or sign up to view this profile"}
                    </h3>
                    <Link href="/login" className='inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition'>
                        {t("navbar.login") || "Login Now"}
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className={`w-full min-h-screen bg-fixed md:pt-20 py-10 px-3.5 md:px-10`}>
            <section className='flex flex-col md:flex-row items-center gap-2.5 justify-between mb-4'>

                <article className='flex flex-col gap-2.5'>
                <article className='flex flex-col md:flex-row items-center gap-2.5'>
                    <Image
                        src={profile.doctorImage ? profile.doctorImage : subImg}
                        alt='img'
                        width={130}
                        height={130}
                        className='rounded-full w-32 h-32 border-2 border-blue-500 object-cover'
                        loading='lazy'
                    />
                    <article className='text-center md:text-left'>
                        <h3 className='text-4xl text-blue-500 mb-1 font-bold'>{profile.doctorName}</h3>
                        {profile.doctorTitle ? <p>{profile.doctorTitle}</p> : ""}
                    </article>
                    </article>
                    <article className={`${!isOwner ? "hidden" : "inline-block"}`}>
                        <Link className={` p-3 px-8 rounded-3xl border w-fit border-blue-600 hover:bg-blue-800 text-white font-semibold `} href={`/doctor_dashboard/${profile?.id}`}> 
                            {t("profile.view")} 
                        </Link>
                    </article>
                </article>
                

                <article className={`${profile?.currentPlan === "free" ? "hidden" : "flex"} items-center gap-2`}>
                    <a href={`https://wa.me/${profile?.doctorPhoneNumber}`} target="_blank" rel="noopener noreferrer" className={`p-3.5 rounded-full border text-[19px] border-blue-600 hover:bg-blue-600 transition`}> 
                        <Whatsapp /> 
                    </a>    
                    <a 
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile?.doctorEmail}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-3.5 rounded-full border text-[19px] border-blue-600 hover:bg-blue-600 transition`}
                    > 
                        <Envelope /> 
                    </a>
                </article>
            </section>

            <section className='grid grid-cols-1 md:grid-cols-4 gap-3.5 items-start'>
                <article className={`col-span-1 md:col-span-4 p-3 rounded-2xl ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} border-b-8 border-blue-600`}>
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">{t("profile.about")}</h3>
                    {profile?.doctorBio ? <p className='leading-relaxed'>{profile?.doctorBio}</p> : ""}
            </article>

                <article className={`col-span-1 md:col-span-4 p-3 rounded-2xl ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} border-b-8 border-blue-600`}>
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">{t("profile.certificates")}</h3>
                    {profile?.doctorCertificates && profile.doctorCertificates.length > 0 ? (
                        <Certificate certificates={profile.doctorCertificates} />
                    ) : (
                        <h3 className='text-xl text-center text-blue-600 capitalize'>{t("profile.noCerticates")}</h3>
                    )}
                </article>

                <article className={`col-span-1 md:col-span-4 p-3 rounded-2xl ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} border-b-8 border-blue-600`}>
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">{t("profile.achievements")}</h3>
                    {profile?.doctorAchievements && profile.doctorAchievements.length > 0 ? (
                        <Achievments achievements={profile.doctorAchievements} />
                    ) : (
                        <h3 className='text-xl text-center text-blue-600 capitalize'>{t("profile.noAchievements")}</h3>
                    )}
                </article>
            </section>

            <section className={`mt-3.5 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} p-3 md:px-20 lg:px-40 rounded-2xl border-b-8 border-blue-600`}>
                <h3 className="text-3xl font-bold text-blue-600 mb-4">{t("profile.posts")}</h3>
                {profile.doctorPosts && profile.doctorPosts.length > 0 ? (
                    <ProfilePost profile={profile} />
                ) : (
                    <h3 className='text-blue-600 capitalize text-center'>{t("profile.noPosts")}</h3>
                )}
            </section>

            <article className={`fixed  ${ activeAlert ? "block" : "hidden" }  ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b] "} left-1/2 top-1/2 rounded-3xl z-50 -translate-x-1/2 -translate-y-1/2 p-4 text-xl  text-red-600 shadow-lg`}> 
                <h3>{t("profile.alert")} </h3>
            </article>
        </main>
    )
}