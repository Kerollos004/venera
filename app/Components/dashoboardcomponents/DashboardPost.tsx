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
            console.log("error in getting comments", error.message)
        }
        if (data) {
            setPostComments(data)
        }
    }

    useEffect(() => {
        getPostComments()
    }, [])

    // دالة لاستخراج مسار الصورة النسبي من الـ URL الكامل عشان السْتوريج تفهمه
    const extractStoragePath = (url: string) => {
        const marker = '/images/';
        const index = url.indexOf(marker);
        return index !== -1 ? decodeURIComponent(url.substring(index + marker.length)) : url;
    }

    const handleDeletePost = async () => {
        if (!post?.id) return;

        // تجهيز مصفوفة الصور والتأكد إنها أراي سليمة
        const rawImages = Array.isArray(post?.images) ? post.images : [];
        const imagePaths = rawImages.map(extractStoragePath).filter(Boolean);

        // 1. مسح الصور من الـ Storage أولاً لو المصفوفة مش فاضية
        if (imagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('images') // اسم البكت بتاع الصور
                .remove(imagePaths);

            if (storageError) {
                console.log("خطأ أثناء مسح الصور من الستوريج:", storageError.message);
                return;
            }
        }

        // 2. مسح البوست نفسه من جدول الداتابيز
        const { error: dbError } = await supabase
            .from('posts')
            .delete()
            .eq('id', post.id);

        if (dbError) {
            console.log("خطأ أثناء مسح البوست من الداتابيز:", dbError.message);
        } else {
            setActiveDelAlert(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    // بنجيب أول صورة من المصفوفة عشان تعرض في الكارت كمصغرة
    const firstImage = Array.isArray(post?.images) && post.images.length > 0 ? post.images[0] : "";

    return (
        <article className='p-2 rounded-2xl border-2 mb-2.5 flex justify-between gap-2.5 items-center border-blue-600'>
            <div className='flex items-center gap-2.5'>
                {firstImage ? (
                    <Image
                        src={firstImage}
                        alt='img'
                        width={200}
                        height={200}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : null}
                <div className=""> 
                    <h3 className='text-xl md:text-3xl'> {post?.name} </h3>
                    <div className="flex gap-2.5 items-start flex-col md:flex-row md:items-center">
                        <h3> total likes : {post?.likes} </h3>
                        <h3> total comments : {postComments?.length} </h3>
                    </div>
                </div>
            </div>

            <TrashFill 
                onClick={async (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (post?.id) {
                        await handleDeletePost();
                    }
                }} 
                className='text-3xl hover:text-red-500 cursor-pointer transition' 
            />

            <article className={`fixed ${activeDelAlert ? "top-5" : "-top-full"} transition-all duration-300 left-1/2 text-center w-75 rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl text-red-600 shadow-xl ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"}`}> 
                {t("dashboard.delAlert")} 
            </article>
        </article>
    )
}