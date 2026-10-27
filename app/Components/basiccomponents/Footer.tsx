/* eslint-disable react-hooks/set-state-in-effect */

"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import emailjs from '@emailjs/browser';
import logo from "../../../public/images/Gemini_Generated_Image_d2y7e3d2y7e3d2y7.png"
import { useThemeContext } from '../assets/contexts'
import { SendFill, Instagram, Linkedin, Tiktok } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import { ProfileType,  } from '../assets/assets';
import { supabase } from '../assets/supabase-client';
import { Session } from '@supabase/supabase-js';
export default function Footer() {
    const { mode } = useThemeContext()
    const [supportMessage, setSupportMessage] = useState<string>("")
    const [session, setSession] = useState<Session | null>(null)
    const [sender , setSender] = useState<ProfileType|null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const {t} = useTranslation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSupportMessage( e.target.value)
    }

        const getSession = async() => {
            const {data} = await supabase.auth.getSession()
            setSession(data?.session)
        }

    const getMessageSender = async () => {
        const { data , error } = await supabase.auth.getUser()
        if (error || !data || !session ) {
            return
        }
        if (data) {
            const { data:senderData } = await supabase.from("users").select("*").eq("id", data?.user?.id).maybeSingle()
            setSender(senderData ? senderData  : {})
        }
    }



    useEffect(() => {
        getMessageSender()
    }, [])
    useEffect(() => {
        getSession()
    }, [])
    
        useEffect(() => {

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession)
            if (currentSession?.user) {
                getMessageSender()
            } else {
                setSender(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const sendEmail = (e:React.FormEvent) => {
        e.preventDefault();
        if (formRef.current) {
            emailjs
            .sendForm('service_ccwnsxc', 'template_nefch6n', formRef?.current, {
            publicKey: '-jC9UjfcysucFUcEw',
        })
        .then(
            (error) => {
            console.log('FAILED...', error.text);
            },
            );
            setSupportMessage("")
        }
    };

    return (
        <footer
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-16 px-6 md:px-16 border-t ${
                mode === "light" ? "text-black bg-gray-300 border-gray-100" : "text-white bg-[#1e293b] border-gray-800"
            }`}
        >
            <article className="flex flex-col items-center md:items-start gap-4">
                <div className="bg-blue-600/10 p-4 rounded-3xl inline-block">
                    <Image
                        src={logo}
                        alt="Venera Logo"
                        height={80}
                        width={180}
                        
                    />
                </div>
                <p className={`text-sm max-w-xs text-center md:text-left opacity-70 italic`}>
                    {t("footer.description")}
                </p>
                <div className="flex gap-5 mt-2">
                    <a href="https://instagram.com/kerollosmelad004?obrf=MW0xbXk1MjJ5eHJmMg%3D%3D" target="_blank" className="hover:text-blue-600 transition-transform hover:scale-110"><Instagram size={22}/></a>
                    <a href="https://linkedin.com/in/kerollos-melad" target="_blank" className="hover:text-blue-600 transition-transform hover:scale-110"><Linkedin size={22}/></a>
                    <a href="https://tiktok.com/@kerollos.melad" target="_blank" className="hover:text-blue-600 transition-transform hover:scale-110"><Tiktok size={22}/></a>
                </div>
            </article>

            <article className="flex flex-col items-center gap-4">
                <h3 className='text-2xl capitalize text-blue-600 font-bold'>{t("footer.linksTitle")}</h3>
                <ul className="flex flex-col items-center gap-3">
                    <li><Link className='hover:text-blue-500 transition-all hover:pl-2' href="/">{t("footer.links.home")}</Link></li>
                    <li><Link className='hover:text-blue-500 transition-all hover:pl-2' href="/feed">{t("footer.links.community")}</Link></li>
                    <li><Link className='hover:text-blue-500 transition-all hover:pl-2' href="/Pricing">{t("footer.links.pricing")}</Link></li>
                </ul>
            </article>

            <article className={`p-6 rounded-3xl h-fit border ${mode === "light" ? "bg-white border-gray-200" : "bg-gray-800/40 border-gray-700"} shadow-xl`}>
                <h3 className='text-xl font-bold text-blue-600 mb-4'>{t("footer.support.title")}</h3>
                <form ref={formRef} onSubmit={sendEmail} className="relative">
                    <input type="text" className='hidden' readOnly value={sender?.doctorName||""} name='name' />
                    <input type="text" className='hidden' readOnly value={sender?.doctorEmail||""} name='email'  />
                    <input
                        name="message"
                        onChange={handleChange}
                        value={supportMessage}
                        type="text" 
                        placeholder={t("footer.support.placeholder")}
                        className={`p-3 pr-12 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            mode === "light" ? "bg-gray-50 border-gray-300" : "bg-gray-900 border-gray-700"
                        } w-full`}
                    />
                    <button 
                        type="submit" 
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 transition-all ${supportMessage ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                    >
                        <SendFill className="rotate-45" size={20} />
                    </button>
                </form>
                <p className="text-[11px] mt-4 opacity-50 text-center">{t("footer.support.responseNote")}</p>
            </article>

            <div className={`col-span-1 md:col-span-3 border-t mt-6 pt-8 text-center opacity-60 ${mode === "light" ? "border-gray-100" : "border-gray-800"}`}>
                <p className="text-sm tracking-wide">
                    © 2026<span className="font-bold text-blue-600">Venera</span>. Developed with passion by <a href="https://kerollos-melad-jqdb.vercel.app" className="font-semibold underline decoration-blue-600">kerollos melad</a>
                </p>
            </div>
        </footer>
    )
}   