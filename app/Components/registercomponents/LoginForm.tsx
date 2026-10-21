"use client"
import React, { useState } from 'react'
import { Google, EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Logintype } from '../assets/assets'
import { useFormContext, useThemeContext } from '../assets/contexts'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { supabase } from '../assets/supabase-client'
import { useRouter } from 'next/navigation'


export default function LoginForm() {
    const { mode } = useThemeContext()
    const { setForm } = useFormContext()
    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState<Logintype>({ email: "", password: "" })
    const [activeAlert , setActiveAlert] = useState<boolean>(false)
    const { t } = useTranslation()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login Attempt:", user);
    }

    const inputStyle = `p-2.5 focus:border-blue-500 ou mb-1 border rounded-xl transition-all w-full ${
        mode === "light" ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"
        }`;
    
    const handleLogin = async () => {
        if (user.email !== "" || user.password) {
        const { error:authErorr } = await supabase.auth.signInWithPassword({email: user.email, password: user.password })
        if (authErorr) {
            console.log("login error" , authErorr.message)
        }
        setUser({ email: "", password: "" })
        router.push("/")
        } else {
            setActiveAlert(true)
            setTimeout(() => {
                setActiveAlert(false)
            }, 3000);
            return
        }
    }

const handleGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // This route must process the temporary code 
                redirectTo: 'https://venera-orcin.vercel.app',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    if (error || !data) {
        console.log("login error", error?.message)
        return
    }
    }
    

    return (
        <article className={`p-6 rounded-2xl shadow-xl transition-all ${
            mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"
        } w-11/12 md:w-112.5 border-t-4 border-blue-500`}>
            
            <h3 className='text-3xl font-black text-blue-500 mb-6 text-center uppercase tracking-tight'>
                {t("register.login.title")}
            </h3>

            <button onClick={async (e:React.MouseEvent) => {
                e.preventDefault()
                await handleGoogle()
            }} className='p-2.5 w-full flex justify-center text-[16px] font-semibold items-center gap-2.5 text-white rounded-xl bg-blue-600 hover:bg-blue-900  mb-6 '>
                <Google size={20}/> {t("register.login.google")}
            </button>

            {/* Divider */}
            <div className="relative mb-6 flex items-center">
                <div className="grow border-t border-gray-400 opacity-30"></div>
                <span className="shrink mx-4 text-sm opacity-50">{t("register.login.or")}</span>
                <div className="grow border-t border-gray-400 opacity-30"></div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Email Field */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold" htmlFor="email">{t("register.login.email")}</label>
                    <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className={inputStyle}
                        type="email"
                        placeholder='doctor@venera.com'
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold" htmlFor="password">{t("register.login.password")}</label>
                        <a href="#" className="text-xs text-blue-600 hover:underline">{t("register.login.forgot")}</a>
                    </div>
                    <div className="relative w-full">
                        <input
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className={`${inputStyle} pr-10`}
                            type={showPassword ? "text" : "password"}
                            placeholder='••••••••'
                            required
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 cursor-pointer text-blue-500 hover:text-blue-700"
                        >
                            {showPassword ? <EyeSlashFill size={18}/> : <EyeFill size={18}/>}
                        </div>
                    </div>
                </div>

                <button onClick={async (e:React.MouseEvent) => {
                    e.preventDefault()
                    await handleLogin()
                }} type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.01] shadow-lg">
                    {t("register.login.loginBtn")}
                </button>
            </form>

            <div className="flex mt-8 justify-center items-center gap-2 text-sm opacity-80">
                <p> {t("register.login.dont")}</p>
                <button
                    onClick={() => setForm("signup")}
                    className='text-blue-600 font-bold hover:underline cursor-pointer'
                >
                    {t("register.login.create")}
                </button>
            </div>
            <article className={`fixed ${ activeAlert?"top-0" :"-top-full" } left-1/2    w-11/12 md:w-150 text-center  rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl  text-red-600 ${mode==="light" ? "bg-gray-300" :"bg-[#1e293b]" } `}> {t("register.alert")} </article>
        </article>
    )
}
