/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React from 'react'
import { useState , useEffect } from 'react'
import { HouseFill , PeopleFill , PersonFill , CashCoin , MoonFill , BrightnessHighFill , Icon } from 'react-bootstrap-icons'
import { useThemeContext } from '../assets/contexts'
import Link from 'next/link'
import { supabase } from '../assets/supabase-client'
import { Session } from '@supabase/supabase-js'
import { ProfileType } from '../assets/assets'
import Image from 'next/image'
import subImg from "../../../public/images/doc-removebg-preview.png"

export default function MobMenu() {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType|null>(null)
    const [ModeIcon, setModeIcon] = useState<Icon>(MoonFill)
    const { mode, setMode } = useThemeContext()
        const handleMode = () => {
            if (mode === "light") {
                setMode("dark")
                setModeIcon(BrightnessHighFill)
                localStorage.setItem("mode", "dark")
                document.body.classList.add("dark-mode")
                document.body.classList.remove("light-mode")
            } else {
                setMode("light")
                setModeIcon(MoonFill)
                localStorage.setItem("mode", 'light')
                document.body.classList.add("light-mode")
                document.body.classList.remove("dark-mode")
            }
        }
    
        useEffect(() => {
            const currentMode = localStorage.getItem("mode")
            if (currentMode === "dark") {
                setMode("dark")
                setModeIcon(BrightnessHighFill)
                document.body.classList.add("dark-mode")
                document.body.classList.remove("light-mode")
            }
            else {
                setMode("light")
                setModeIcon(MoonFill)
                document.body.classList.add("light-mode")
                document.body.classList.remove("dark-mode")
            }
        }, [setMode])
    
        const getSession = async() => {
            const {data} = await supabase.auth.getSession()
            setSession(data?.session)
        }
        
    const fetchUserData = async () => {
        const { data: authUser, error: authError } = await supabase.auth.getUser()

        const userId = authUser?.user?.id
        
        if (authError || !userId) {
            setUser(null)
            return
        }
        
        if (userId) {
            const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id",userId )
            .single()

        if (error) {
            console.log("error in getting user data", error.message)
            return
        }

        if (data) {
            setUser(data) 
        }
        }
    }
    
        
        useEffect(() => {
            getSession()
        }, [])
        
        useEffect(() => {
            fetchUserData()
        }, [])
    
        useEffect(() => {

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession)
            if (currentSession?.user) {
                fetchUserData()
            } else {
                setUser(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])
    return (
        <article className={` ${mode==="light"?"bg-gray-200 text-black":"text-white bg-[#06142a]"} fixed bottom-0 z-30 left-1/2 items-center w-full -translate-x-1/2  flex justify-between gap-2.5 p-3 md:hidden  rounded-t-4xl rounded-tr-4xl`}>
            <Link href={"/"} className='flex items-center justify-center p-3 text-3xl'>
                <HouseFill className='hover:text-blue-600'/>
            </Link>
            <Link href={"/feed"} className='flex items-center justify-center p-3 text-3xl'>
                <PeopleFill className='hover:text-blue-600'/>
            </Link>
            <Link  href={"/pricing"} className='flex items-center justify-center p-3 text-3xl'>
                <CashCoin className='hover:text-blue-600'/>
            </Link>
            {
                session?.user.role === "authenticated" ?
                    user?.doctorType === "dentist" ?
                        <Link
                            href={`profiles/${user?.id}`}
                        >
                            <Image
                                src={user?.doctorImage ? user?.doctorImage : subImg}
                                alt='img'
                                width={100}
                                loading='lazy'
                                height={100}
                                className=' w-15 h-15  border-2 border-blue-600 rounded-full cursor-pointer'
                            />
                        </Link> :
                            <Image
                                src={user?.doctorImage ? user?.doctorImage : subImg}
                            alt='img'
                            loading='lazy'
                                width={100}
                                height={100}
                                className='aspect-square border-2 border-blue-600 rounded-full'
                            />
                            :
                <Link href={"/login"} className='flex items-center justify-center p-3 text-3xl'>
                <PersonFill className='hover:text-blue-600'/>
                </Link>
            }
            <div className='flex items-center justify-center p-3 text-3xl'>
                <ModeIcon onClick={handleMode} className='hover:text-blue-600'/>
            </div>            
        </article>
    )
}
