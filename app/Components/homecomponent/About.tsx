"use client"
import React from 'react'
import { useThemeContext } from '../assets/contexts'
import { motion } from 'motion/react'
import {  useTranslation } from 'react-i18next'
import { Variants } from 'motion/react'
export default function About() {
    const { t } = useTranslation()
    const aboutText = t("about.aboutText")
    const words = aboutText.split(" ")
    const { mode } = useThemeContext()
    const aboutDivVariants:Variants = {
        hidden: {
            opacity:0.05
        }, 
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: .1,
                duration: .1,
                delayChildren: .1,
                stiffness: 100 
            }
        }

    } 

    const aboutTextVariants:Variants   = {
        hidden: {
            opacity:0.05
        }, 
        visible: {
            opacity:1
        },
    }

    const wordsMap = words.map((word:string , i:number) => {
        return (
            <motion.p variants={aboutTextVariants} key={i}>{word }</motion.p>
        )
    })
    
    return (
        <section className='px-3.5 md:px-10 py-10   flex items-center justify-center flex-col '>

            <motion.h3
                initial={{ opacity: 0, y: "-20px" }}
                whileInView={{ opacity: 1, y: "0" }}
                viewport={{amount:.5}}
                className='text-3xl md:text-5xl text-center text-blue-600 mb-3.5'
            >
                {t("about.aboutTitle")}
            </motion.h3>

            <motion.article
                initial= "hidden"
                whileInView="visible"
                variants = {aboutDivVariants}
                viewport={{amount:.7}}
                className={`border-t-6 border-blue-600 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} w-full md:w-3/4 lg:w-4/5  p-4 rounded-2xl`}
            >
                <motion.div className='text-2xl flex flex-wrap gap-1.5'>
                    {(wordsMap)}
                </motion.div>
            </motion.article>

        </section>
    )
}

