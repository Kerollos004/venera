/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon, MoonFill , BrightnessHighFill } from 'react-bootstrap-icons'
import { useThemeContext } from '../assets/contexts'
import { useTranslation } from 'react-i18next';
import "../../reacti18"
import logo from "../../../public/images/Gemini_Generated_Image_d2y7e3d2y7e3d2y7.png"
import Image from 'next/image'
import { motion } from 'motion/react'
import { ChevronDown } from 'react-bootstrap-icons'
import { supabase } from '../assets/supabase-client'
import { Session } from '@supabase/supabase-js'
import { ProfileType } from '../assets/assets'
import subImg from "../../../public/images/doc-removebg-preview.png"


export default function Header() {
    const [active, setActive] = useState<boolean>(false)
    const [activeMenu, setActiveMenu] = useState<boolean>(false)
    const [activeIcon, setActiveIcon] = useState<boolean>(false)
    const [ModeIcon, setModeIcon] = useState<Icon>(MoonFill)
    const { mode, setMode } = useThemeContext()
    const [opened, setOpened] = useState<boolean>(false)
    const { t, i18n } = useTranslation();
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType|null>(null)
    


    const getSession = async () => {
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
            setSession(data.session)
        }
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
        fetchUserData()

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

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setActive(true)
        } else {
            setActive(false)
        }
    }
    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

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

    const toggleLanguage = (lng: string) => {
        setOpened(false)
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);



    return (
        <motion.header
        className={`w-full hidden md:flex items-center justify-between h-18 px-3.5 md:px-10 fixed top-0 left-0 z-40 transition-all duration-300
        ${mode === "light" ? "text-black" : "text-white"} 
        ${active 
        ? (mode === "light" 
            ? "bg-white/70  backdrop-blur-md " 
            : "bg-[rgba(29,35,52,0.7)]  backdrop-blur-md ") 
        : "bg-transparent"
                }`}
            initial={{ y: -200, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{duration:1}}
        >
            <Image
                src={logo}
                alt='img'
                width={100}
                height={100}
                className='rounded-full'
            />
            <nav>
                <ul className={`${activeMenu ? "active" : ""}  ${mode==="light"?"":"dark-mode"} flex items-center gap-4`}>
                    <li>
                        <Link onClick={()=>{
                            setActiveMenu(false)
                            setActiveIcon(false)
                        }
                    } className='capitalize hover:text-blue-600 text-[18px] ' href={"/"}> {t("navbar.home")} </Link>
                    </li>
                    <li>
                        <Link onClick={()=>{
                            setActiveMenu(false)
                            setActiveIcon(false)
                        }
                    } className='capitalize hover:text-blue-600 text-[18px] ' href={"/feed"}> {t("navbar.community")} </Link>
                    </li>
                    <li>
                        <Link onClick={()=>{
                            setActiveMenu(false)
                            setActiveIcon(false)
                        }
                    } className='capitalize hover:text-blue-600 text-[18px] ' href={"/pricing"}> {t("navbar.pricing")} </Link>
                    </li>
                    <li>
                        {
                            session?.user.role === "authenticated" ?
                                user?.doctorType === "dentist" ?
                                    <Link
                                        href={`profiles/${user?.id}`}>
                                        <Image
                                            src={user?.doctorImage ? user?.doctorImage : subImg}
                                            alt='img'
                                            width={200}
                                            loading='lazy'
                                            height={200}
                                            className='w-16 h-16 border-2 border-blue-600 rounded-full cursor-pointer'
                                        />
                                    </Link> :
                                        <Image
                                            src={user?.doctorImage ? user?.doctorImage : subImg}
                                        alt='img'
                                        loading='lazy'
                                            width={200}
                                            height={200}
                                            className='w-16 h-16 border-2 border-blue-600 rounded-full'
                                        />
                            :
                                <Link onClick={() => {
                                setActiveIcon(false)
                                setActiveMenu(false)
                                }} className='py-2 px-5 rounded-3xl text-white text-[18px]  bg-blue-600 hover:bg-blue-900' href={"/login"}> {t("navbar.login")}
                                </Link>
                        }
                    </li>

                </ul>
            </nav>
            <ul className='flex items-center gap-2.5'>
                <li>

                    <div className='relative'>
                        <div onClick={() => { setOpened(!opened) }} className="flex items-center gap-2.5 py-2 px-3 text-[18px] rounded-3xl bg-blue-600">
                            <span className='text-white' > {i18n.language} </span>
                            <ChevronDown className={` ${opened?'rotate-360 ':'rotate-180'} text-white ` } />
                        </div>
                        <div className= { ` ${opened?"opacity-100 pointer-events-auto ":"opacity-0 pointer-events-none"} absolute top-full w-28 mt-1.5 rounded-3xl flex flex-col   -left-4 p-2 bg-blue-600 `}>
                            <button onClick={() => {
                                setOpened(false)
                                toggleLanguage("en")
                            }} className='w-full p-2 rounded-2xl mb-1.5 hover:bg-blue-500 text-white' >en</button>
                            <button onClick={() => {
                                setOpened(false)
                                toggleLanguage("ar")
                            }} className='w-full p-2 rounded-2xl mb-1.5 hover:bg-blue-500 text-white' >ar</button>
                        </div>
                    </div>
                </li>
                <li> <ModeIcon onClick={handleMode} className='text-2xl hover:text-blue-600' /> </li>
                <li>
                    <div onClick={() => {
                        setActiveMenu(!activeMenu)
                        setActiveIcon(!activeIcon)
                    }} className='menu-btn block md:hidden lg:hidden w-8 h-8 relative'>
                        <div className={` ${mode==="light"?"bg-black":"bg-white"}  ${activeIcon?" w-full top-1/2 -translate-y-1/2 rotate-45 ":" w-full top-1/4 -translate-y-1/2"}  absolute  left-0     h-0.5  `}  ></div>
                        <div className={` ${mode==="light"?"bg-black":"bg-white"}  ${activeIcon?" w-full  top-1/2 -translate-y-1/2 opacity-0 ":" w-1/2 top-1/2 -translate-y-1/2 opacity-100"}  absolute  left-0    h-0.5   `} ></div>
                        <div className={` ${mode==="light"?"bg-black":"bg-white"}  ${activeIcon?" w-full top-1/2 -translate-y-1/2 -rotate-45 ":"  w-1/4 top-3/4 -translate-y-1/2"}  absolute  left-0    h-0.5   `} ></div>
                    </div>
                </li>
            </ul>

        </motion.header>
    )
}
