
"use client"
import React, { useState } from 'react'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { signupType } from '../assets/assets'
import { useFormContext, useThemeContext } from '../assets/contexts'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { supabase } from '../assets/supabase-client'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
    const { mode } = useThemeContext()
    const { setForm } = useFormContext()
    const [showPassword, setShowPassword] = useState <boolean> (false)
    const { t } = useTranslation()
    const [activeAlert , setActiveAlert] = useState <boolean> (false)
    const [user, setUser] = useState<signupType>({
        id: 0,
        created_at:"",
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        image: "",
        type: "",
        bio: "",
        title:""
    })
    const router = useRouter()

    const handleCreate = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (user.name || user.email || user.password || user.phoneNumber) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        })

        if (authError) {
            console.error("Error in auth signup:", authError.message)
            return;
        }

        const userId = authData.user?.id;

        if (userId) {
            
            const { error: dbError } = await supabase
                .from('users') 
                .insert([
                    {
                        id: userId, 
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        image: user.image,
                        type: user.type,
                        bio: user.bio
                    }
                ]);

            if (dbError) {
                console.error("Error inserting into users table:", dbError.message);
            }
        }
        } else {
            setActiveAlert(true)
            setTimeout(() => {
                setActiveAlert(false)
            } , 3000)
        }

        setUser({
            id: 0,
            created_at:"",
            name: "",
            phoneNumber: "",
            email: "",
            password: "",
            image: "",
            type: "",
            bio: "",
            title:""
        })
        router.push("/")
    }



    const inputStyle = `p-2.5 focus:border-blue-600 outline-none mb-1 border rounded-xl transition-all ${
        mode === "light" ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-white"
    }`;

    return (
        <article className={`p-6 rounded-2xl shadow-xl transition-all ${
            mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"
        } w-11/12 md:w-175 border-t-4 border-blue-600`}>
            
            <h3 className='text-3xl font-black text-blue-600 mb-6 text-center uppercase tracking-tight'>
                {t("register.signUp.title")}
            </h3>

            <form  className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                
                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold' htmlFor="name"> {t("register.signUp.name")} </label>
                    <input 
                        name="name"
                        value={user.name} 
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setUser({...user , name:e.target.value})}}
                        className={inputStyle} 
                        type="text" 
                        placeholder='Dr. Ahmed Ali' 
                        required
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold' htmlFor="phoneNumber">{t("register.signUp.number")}</label>
                    <input 
                        name="phoneNumber"
                        value={user.phoneNumber} 
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setUser({...user , phoneNumber:e.target.value})}}
                        className={inputStyle} 
                        type="tel" 
                        placeholder='010xxxxxxx' 
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold' htmlFor="email">{t("register.signUp.email")} </label>
                    <input 
                        name="email"
                        value={user.email} 
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setUser({...user , email:e.target.value})}}
                        className={inputStyle} 
                        type="email" 
                        placeholder='name@venera.com' 
                        required
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold' htmlFor="password">{t("register.signUp.password")}</label>
                    <div className="relative w-full">
                        <input 
                            name="password"
                            value={user.password} 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setUser({...user , password:e.target.value})}}
                            className={`${inputStyle} w-full pr-10`} 
                            type={showPassword ? "text" : "password"} 
                            placeholder='••••••••' 
                            required
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 cursor-pointer text-blue-600 hover:text-blue-700"
                        >
                            {showPassword ? <EyeSlashFill size={18}/> : <EyeFill size={18}/>}
                        </div>
                    </div>
                </div>

                {/* Role Selection */}
                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold'>{t("register.signUp.i-am.iam")}</label>
                    <select 
                        name="role"
                        onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {
                            setUser({...user , type:e.target.value})
                        }}
                        className={inputStyle}
                    >
                        <option value="student">{t("register.signUp.i-am.patient")}</option>
                        <option value="dentist">{t("register.signUp.i-am.doctor")}</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold'>{t("register.signUp.pic")}</label>
                    <input 
                        className={`${inputStyle} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} 
                        type="file" 
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    setUser({ ...user, image: reader.result as string });
                                };
                                reader.readAsDataURL(file); // السطر ده كان ناقص في كودك!
                            }
                        }}
                    />
                </div>

                {/* title */}
                <div className={`  ${user.type==="dentist"?"flex":"hidden"} flex-col gap-1 col-span-1   md:col-span-2 `}>
                    <label className='text-sm font-semibold'>{t("register.signUp.jobTitle")}</label>
                    <textarea 
                        placeholder=' bachelor of dentistry'
                        value={user.title}
                        className={`${inputStyle} `} 
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setUser({...user , title:e.target.value})
                        }}
                    />
                </div>

                {/* bio */}
                <div className={`  ${user.type==="dentist"?"flex":"hidden"} flex-col gap-1 col-span-1   md:col-span-2 `}>
                    <label className='text-sm font-semibold'>{t("register.signUp.bio")}</label>
                    <textarea 
                        placeholder='i am a dentist...'
                        value={user.bio}
                        className={`${inputStyle} `} 
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setUser({...user , bio:e.target.value})
                        }}
                    />
                </div>

                <button   
                    onClick={handleCreate} 
                    type="button" 
                    className="md:col-span-2 col-span-1 mt-4 bg-blue-600 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer"
                >
                    {t("register.signUp.loginBtn")}
                </button>
            </form>

            <div className="flex mt-6 justify-center  flex-col md:flex-row items-center gap-2 text-sm opacity-80">
                <p>{t("register.signUp.already")}</p>
                <button 
                    onClick={() => setForm("login")} 
                    className='text-blue-600 font-bold hover:underline cursor-pointer'
                > 
                    {t("register.signUp.login")} 
                </button>
            </div>
            <article className={`fixed ${ activeAlert?"top-0" :"-top-full" } left-1/2   w-11/12 md:w-150 text-center  rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl  text-red-600 ${mode==="light" ? "bg-gray-300" :"bg-[#1e293b]" } `}> {t("register.alert")} </article>
        </article>
    )
}