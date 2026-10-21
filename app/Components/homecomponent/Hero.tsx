"use client"
import React from 'react'
import Link from "next/link"
import tooth from "../../../public/images/tooth-removebg-preview.png"
import doc from "../../../public/images/doc-removebg-preview.png"
import Image from "next/image"
import { useThemeContext } from '../assets/contexts'
import "../../reacti18"
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Variants } from 'motion/react'
import { useRouter } from 'next/navigation'
import { supabase } from '../assets/supabase-client'
export default function Hero() {
    const { mode } = useThemeContext()
    const {t} = useTranslation()
const textsVariants:Variants = {
    hidden: { opacity: 0, y: "50px" },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            staggerChildren: 0.2, 
            delayChildren: 2, 
            type: "spring",     
            stiffness: 100       
        }
    }
}

const textVariants:Variants = {
    hidden: { opacity: 0, y: "20px" },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 } 
    }
}
const toothVariants:Variants = {
        hidden: { 
            x: "100px", 
            rotate: 360, 
            opacity: 0 
        },
        visible: { 
            x: "0px", 
            rotate: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 15,
                delay: 0.6 
            }
        }
    }

    const docVariants:Variants = {
        hidden: { 
            x: "-100px", 
            opacity: 0 
        },
        visible: { 
            x: "0px", 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 15,
                delay: 0.8 
            }
        }
    }


const router = useRouter()

useEffect(() => {
    // السطر ده مهم جداً: بيسمح لـ Supabase إنه يلقط الـ Hash tokens من الـ URL ويخزن الـ Session
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // لو التسجيل تم بنجاح، ممكن تعمل شيل للـ tokens من الـ URL عشان يبמו نظيف
        window.history.replaceState({}, document.title, window.location.pathname)
    }
    })

    return () => {
        authListener.subscription.unsubscribe()
    }
}, [router])

    return (
        <section className='flex justify-center items-center w-full h-screen relative overflow-hidden'>
            <motion.article initial="hidden" whileInView="visible" viewport={{amount:.2}} variants={textsVariants} className="w-11/12 md:w-xl text-center">
                <motion.h3
                variants={textVariants}
                className="text-5xl text-blue-600 mb-4"
                >
                    {t("hero.welcome")}
                </motion.h3>
                <motion.p
                variants={textVariants}
                    className={` ${mode === "light" ? "text-black" : "text-white"} text-[19px]`}
                >
                    {t("hero.description")}
                </motion.p>
                <motion.div
                variants={textVariants}
                    className="flex mt-4 gap-5 items-center justify-center"
                >
                    <Link className="p-2.5 text-blue-600 border border-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white" href={"/feed"}> {t("hero.btn1")} </Link>
                    <Link className="p-2.5 text-white rounded-2xl bg-blue-600 hover:bg-blue-900" href={"/pricing"}>  {t("hero.btn2")} </Link>
                </motion.div>
            </motion.article>
            <motion.article 
                initial="hidden"
                whileInView="visible"
                variants={toothVariants}
                viewport={{amount:0}}
                transition={{
                    duration: 1.2,
                    type:"spring",
                    delay: .5,
                }}
                className="absolute bottom-3 right-3 md:bottom-5 md:right-20  lg:bottom-20 lg:right-30"
            >
                <Image
                    src={tooth}
                    width={120}
                    height={120}
                    alt="img"
                    className=" w-40 h-40 md:w-48 md:h-48  "
                />
            </motion.article>
            <motion.article 
                initial="hidden"
                whileInView="visible"
                variants={docVariants}
                viewport={{amount:0}}
                transition={{ delay: .5 }}
                className="absolute top-16 left-3 md:top-20 md:left-20  lg:top-20 lg:left-30"
            >
            <Image
                src={doc}
                width={120}
                height={120}
                alt="img"
                className=" w-40 h-40 md:w-48 md:h-48  "
            />
            </motion.article>
        </section>
    )
}
