/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useState , useEffect } from 'react'
import { useThemeContext } from '../assets/contexts'
import { postType } from '../assets/assets'
import { Plus } from 'react-bootstrap-icons'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { supabase } from '../assets/supabase-client'
import { useRouter } from "next/navigation"
export default function DashboardAddPost() {
    const { mode } = useThemeContext()
    const [activeAlert, setActiveAlert] = useState<boolean>(false)
    const [activeAddAlert, setActiveAddAlert] = useState<boolean>(false)
    const router = useRouter()
    const [newPost, setNewPost] = useState<postType>(
        {
            name: "",
            description: "",
            image: "",
            type: "",
            likes: 0,
            user_id: "",
            post_likers: [],
        }
    )
    const { t } = useTranslation()

    const handleGetUser = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.log("Error getting user", authError?.message)
    }
    if (user) {
        setNewPost({...newPost , user_id:user.id})
        }
        
    }

    useEffect(() => {
        handleGetUser()
    }, [])
    
const handleAddPost = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (newPost?.name !== "" || newPost?.type !=="") {
        const { error } = await supabase.from("posts").insert(newPost)
        
        if (error) {
            console.log("error on adding post", error.message)
            return
        }
        setActiveAddAlert(true)
        setTimeout(() => {
            setActiveAddAlert(false)
        } , 3000)

    }
    else {
        setActiveAlert(true)
        setTimeout(() => {
            setActiveAlert(false)
        } , 3000)
        return
    }
    setNewPost({
            name: "",
            description: "",
            image: "",
            type: "",
            likes: 0,
            user_id: "",
        post_likers: [],
    })
    router.push("/feed")
    }

    return (
        <article className={`  p-4  mt-3.5 ${mode==="light"?"bg-gray-300":"bg-[#1e293b]"}  rounded-3xl w-full`}>
            <h3 className='text-3xl capitalize text-blue-600 mb-3'> {t("dashboard.add.title")} </h3>
            <form action="" className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="name">  {t("dashboard.add.name")} </label>
                    <input
                        value={newPost.name}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setNewPost({...newPost , name:e.target.value})}}
                        type="text"
                        className='p-3 rounded-2xl border-2 border-gray-400 focus:border-blue-600 '
                        placeholder='teeth veners'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="name"> {t("dashboard.add.type.title")} </label>
                    <select
                        className={` ${mode === "light" ? "bg-gray-200 text-black" : "bg-[#1e293b] text-white"} p-3 rounded-2xl border-2 border-gray-400  focus:border-blue-600 `}
                        onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {setNewPost({...newPost , type:e.target.value})}}
                        value={newPost.type}
                    >
                        <option  value="" disabled>{t("dashboard.add.type.choose")} </option>
                        <option  value="case">{t("dashboard.add.type.case")}</option>
                        <option  value="achievement">{t("dashboard.add.type.achivement")}</option>
                        <option  value="certificate">{t("dashboard.add.type.certificate")}</option>
                    </select>
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="name">  {t("dashboard.add.desc")} </label>
                    <textarea
                        value={newPost.description}
                        rows={4}
                        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {setNewPost({...newPost , description:e.target.value})}}
                        className='p-3 rounded-2xl border-2 border-gray-400 focus:border-blue-600 '
                        placeholder='teeth veners'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="name">  {t("dashboard.add.image")} </label>
                    <input 
                        className={` p-3 rounded-2xl border-2 border-gray-400 focus:border-blue-600 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} 
                        type="file" 
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    setNewPost({ ...newPost, image: reader.result as string });
                                };
                                reader.readAsDataURL(file); 
                            }
                        }}
                    />
                </div>
                <button type='button' onClick={handleAddPost} className='flex items-center gap-1 col-span-1 md:col-span-2 p-3 bg-blue-600 hover:bg-blue-800 justify-center text-2xl rounded-2xl' >{t("dashboard.add.add")} <Plus/> </button>
            </form>
            <article className={`fixed ${activeAlert ? "top-0" : "-top-full"} left-1/2    w-75  rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl  text-red-600 ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} `}> {t("dashboard.alert")} </article>
            <article className={`fixed ${ activeAddAlert?"top-0" :"-top-full" } left-1/2    w-75  rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl  text-blue-600 ${mode==="light" ? "bg-gray-300" :"bg-[#1e293b]" } `}> {t("dashboard.addAlert")} </article>
        </article>
    )
}
