/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { TrashFill } from 'react-bootstrap-icons'
import { CommentType, postType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { useThemeContext } from '../assets/contexts'
export default function DashboardPost({ post }: { post: postType }) {
    const [postComments, setPostComments] = useState<CommentType[]>([])
    const { t } = useTranslation()
    const [activeDelAlert, setActiveDelAlert] = useState<boolean>(false)
    const { mode } = useThemeContext()
    const getPostComments = async () => {
        const { data, error } = await supabase.from("comments").select("*").eq("post_id", post?.id)
        if (error) {
            console.log("error im getting comments" , error.message)
        }
        if (data) {
            setPostComments(data)
        }
    }
    useEffect(() => {
        getPostComments()
    }, [])
    const handleDeletePost = async ( id:string  ) => {
        const { error } = await supabase.from("posts").delete().eq("id", id)
        if (error) {
            console.log("error in deleting post" , error.message)
        }
        setActiveDelAlert(true)
        setTimeout(() => {
            setActiveDelAlert(false)
        }, 3000);
    }
    return (
        <article className=' p-2 rounded-2xl border-2 mb-2.5 flex justify-between  gap-2.5 items-center border-blue-600 '>
            <div className='flex items-center gap-2.5'>
                {
                    post?.image ? 
                <Image
                    src={post?.image? post?.image:""}
                    alt='img'
                    width={200}
                    height={200}
                    className={` ${post?.image?"block":"hidden"}  w-16 h-16 rounded-full `}
                />:""
                }
                <div className=""> 
                    <h3 className='text-3xl '> {post?.name} </h3>
                    <div className="flex gap-2.5 items-start flex-col md:flex-row md:items-center">
                        <h3> total likes : {post?.likes} </h3>
                        <h3> total comments : {postComments?.length } </h3>
                    </div>
                </div>
            </div>
            <TrashFill onClick={ async (e: React.MouseEvent) => {
                e.preventDefault()
                if (post?.id) {
                    await handleDeletePost(post?.id)
                }
                window.location.reload()
            }} className='text-3xl hover:text-red-500' />
            <article className={`fixed ${activeDelAlert ? "top-0" : "-top-full"} left-1/2  rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl  text-red-600 ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} `}> {t("dashboard.delAlert")} </article>
        </article>
        
    )
}
